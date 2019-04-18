#!/usr/bin/env groovy

import java.text.SimpleDateFormat
import java.util.Date

def dateFormat = new SimpleDateFormat("yyyyMMddHHmm")
def deployTimestamp = dateFormat.format(new Date())
def label = "address-book-builder-${UUID.randomUUID().toString()}"
def branch
def deployJob = "${env.JOB_NAME}-${env.BUILD_NUMBER}"
def commitSha
def buildJob
def buildTimestamp

try {
  notifyOnSlack("warning", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🚨  Starting promotion to production of release ${deployTimestamp}.${env.BUILD_NUMBER}! Man your stations! 🚨")

	podTemplate(
		label: label,
		serviceAccount: 'jenkins',
		containers: [
			containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave:alpine', resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi', envVars: [envVar(key: 'JAVA_OPTS', value: '-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -XshowSettings:vm')]),
			containerTemplate(name: 'docker', image: 'docker:18.02', command: 'cat', ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi'),
			containerTemplate(name: 'awscli', image: 'quay.io/coreos/awscli:master', command: 'cat', ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi'),
			containerTemplate(name: 'hyperaurora', image:  '914904879356.dkr.ecr.eu-west-1.amazonaws.com/hyperaurora:latest', command: 'cat', alwaysPullImage: true, ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi')
		],
		volumes: [
			hostPathVolume(hostPath: '/var/run/secure/jenkins-docker.sock', mountPath: '/var/run/docker.sock'),
			secretVolume(secretName: 'tiller-secret', mountPath: '/tiller')
		],
		annotations: [
			podAnnotation(key: "iam.amazonaws.com/role", value: "jenkins-slave-oneaccount")
		]) {

		node(label) {
			stage('Checkout the repository') {
        def gitData = checkout(scm)
				commitSha = gitData.GIT_COMMIT.trim()
			}

			stage('Login into AWS ECR') {
				container('awscli') {
					sh 'aws ecr get-login --region eu-west-1 --no-include-email > ecr-login.sh'
					sh 'chmod +x ecr-login.sh'
				}
				container('docker') {
					sh "./ecr-login.sh"
				}
			}

			stage('Build address book docker image and push it to ECR') {
				container('docker') {
          // Pull images
          sh "docker pull 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest"
          sh "docker pull 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-latest"
          sh "docker pull 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:app-${commitSha}"
          sh "docker pull 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-${commitSha}"

          // Retag old latest to previous
					sh "docker tag 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:previous"
					sh "docker tag 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-latest 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-previous"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:previous"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-previous"

          // Tag new latest
					sh "docker tag 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:app-${commitSha} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest"
					sh "docker tag 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-${commitSha} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-latest"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-latest"

          // Get image labels
          branch = sh(returnStdout: true, script: "docker inspect 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest -f \"{{ .Config.Labels.branch }}\"").trim()
          buildJob = sh(returnStdout: true, script: "docker inspect 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest -f \"{{ .Config.Labels.jobName }}\"").trim()
          buildTimestamp = sh(returnStdout: true, script: "docker inspect 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest -f \"{{ .Config.Labels.timestamp }}\"").trim()
				}
			}

			stage('Deploy address book') {
				sh "wget -q http://dex-file-server.auth.svc.cluster.local:8080/bin/linux/dex-client"
        sh "chmod +x dex-client"
        sh "./dex-client pod" +
					" --cluster-name eu-west-1a-prod" +
					" --cluster-name eu-west-1b-prod" +
					" --cluster-name eu-west-1c-prod"

				withEnv(["KUBECONFIG=kubeconfig"]) {
					container('hyperaurora') {
						sh "helm init --client-only"
            sh "echo ${branch} ${buildJob} ${buildTimestamp} ${deployJob} ${deployTimestamp} ${commitSha}"

            deployToEnvironment('a', branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha)

            deployToEnvironment('b', branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha)

            deployToEnvironment('c', branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha)

            withCredentials([string(credentialsId: 'github-access-token', variable: 'GITHUB_TOKEN'),]) {
              sh "curl -H \"Content-Type: application/json\" -X POST -d '{\"tag_name\": \"v${deployTimestamp}.${env.BUILD_NUMBER}\", \"target_commitish\": \"${commitSha}\", \"name\":\"${deployTimestamp}.${env.BUILD_NUMBER}\", \"body\":\"\", \"draft\": false, \"prerelease\": false }' https://github.dev.global.tesco.org/api/v3/repos/oneaccount/address-book/releases?access_token=${env.GITHUB_TOKEN}"
            }
					}
				}
			}
		}
	}

  notifyOnSlack("good", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🎉  ${commitSha} was successfully tagged as release <https://github.dev.global.tesco.org/oneaccount/address-book/releases/tag/v${deployTimestamp}.${env.BUILD_NUMBER}|${deployTimestamp}.${env.BUILD_NUMBER}> and promoted to <https://www.tesco.com/address-book/en-GB|production!>! 🎉")
	currentBuild.result = 'SUCCESS'
} catch (e) {
  notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🔥 Release ${deployTimestamp}.${env.BUILD_NUMBER} failed! Everybody panic! 🔥\n${e.getMessage()}")
	println('Failure' + e.getMessage())
	currentBuild.result = 'FAILURE'
}

def notifyOnSlack(toneColor, message) {
  slackSend channel: '#oneaccount',
            teamDomain: 'tescooneaccount',
            color: toneColor,
            message: message
}

def deployToEnvironment(zone, branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha) {
  def dc
  switch (zone) {
    case 'a':
      dc = 'AWS1'
      break
    case 'b':
      dc = 'AWS2'
      break
    case 'c':
      dc = 'AWS3'
      break
  }

  // Prepare env-specific configuration
  sh "mkdir -p helm/address-book-prod-eu-west-1${zone}/; " +
    " cp helm/address-book/Chart.yaml helm/address-book-prod-eu-west-1${zone}/"

  // Decrypt secrets
  sh "render" +
    " --input helm/address-book/templates/deployment.yaml" +
    " --output helm/address-book-prod-eu-west-1${zone}/templates/deployment.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.prod.yaml" +
    " --var app.branch=${branch}" +
    " --var app.buildJob=${buildJob}" +
    " --var app.buildTimestamp=${buildTimestamp}" +
    " --var app.deployJob=${deployJob}" +
    " --var app.deployTimestamp=${deployTimestamp}" +
    " --var app.sha=${commitSha}"

  sh "render" +
    " --input helm/address-book/templates/service.yaml" +
    " --output helm/address-book-prod-eu-west-1${zone}/templates/service.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.prod.yaml"

  sh "render" +
    " --input helm/address-book/templates/ingress.yaml" +
    " --output helm/address-book-prod-eu-west-1${zone}/templates/ingress.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.prod.yaml" +
    " --var app.dc=${dc}"

  // Perform the upgrade
  sh "helm upgrade address-book helm/address-book-prod-eu-west-1${zone}" +
    " --tiller-namespace oneaccount-management" +
    " --kube-context eu-west-1${zone}-prod" +
    " --namespace oneaccount" +
    " --install" +
    " --tls" +
    " --tls-cert /tiller/tls.crt" +
    " --tls-key /tiller/tls.key" +
    " --tls-ca-cert /tiller/tls.key"
}
