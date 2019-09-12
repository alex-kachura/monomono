#!/usr/bin/env groovy

import java.text.SimpleDateFormat
import java.util.Date

def dateFormat = new SimpleDateFormat("yyyyMMddHHmm")
def timestamp = dateFormat.format(new Date())
def label = "address-book-builder-${UUID.randomUUID().toString()}"
def branch
def jobName = "${env.JOB_NAME}-${env.BUILD_NUMBER}"
def commitSha

try {
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
        branch = gitData.GIT_BRANCH.tokenize('/')[-1]
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
          // Build the new images
          withCredentials([string(credentialsId: 'nexus-npm-token', variable: 'NPM_AUTH_TOKEN'),]) {
            sh "docker build -f ./Dockerfile.prod -t address-book:app-${commitSha} --build-arg NPM_AUTH_TOKEN=${env.NPM_AUTH_TOKEN} . --label branch=${branch} --label jobName=${jobName} --label commitSha=${commitSha} --label timestamp=${timestamp}"
          }
					sh "docker build -f ./Dockerfile.nginx -t address-book:nginx-${commitSha} --add-host=app:127.0.0.1 ."

          // Tag the built images
					sh "docker tag address-book:app-${commitSha} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:app-${commitSha}"
					sh "docker tag address-book:nginx-${commitSha} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-${commitSha}"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:app-${commitSha}"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-${commitSha}"
				}
			}

			stage('Deploy address-book') {
				sh "wget -q http://dex-file-server.auth.svc.cluster.local:8080/bin/linux/dex-client"
        sh "chmod +x dex-client"

				withEnv(["KUBECONFIG=kubeconfig"]) {
					container('hyperaurora') {
						sh "helm init --client-only"

            deployToEnvironment('a', branch, jobName, commitSha, timestamp)

            deployToEnvironment('b', branch, jobName, commitSha, timestamp)

            deployToEnvironment('c', branch, jobName, commitSha, timestamp)
					}
				}
			}
		}
	}

  notifyOnSlack("good", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🎉 Master was successfully built and deployed to <https://www-ppe.tesco.com/address-book/en-GB|nonprod>! 🎉")
	currentBuild.result = 'SUCCESS'
} catch (e) {
  notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🔥 Job failed! 🔥\n${e.getMessage()}")
	println('Failure' + e.getMessage())
	currentBuild.result = 'FAILURE'
}

def notifyOnSlack(toneColor, message) {
  slackSend channel: '#oneaccount',
            teamDomain: 'tescooneaccount',
            color: toneColor,
            message: message
}

def deployToEnvironment(zone, branch, jobName, commitSha, timestamp) {
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

  try {
    sh "./dex-client pod --cluster-name eu-west-1${zone}-nonprod"
  } catch (e) {
    notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 😱 Could not connect to cluster eu-west-1${zone}-nonprod! 😱\n${e.getMessage()}")
    return
  }

  // Prepare env-specific configuration
  sh "mkdir -p helm/address-book-nonprod-eu-west-1${zone}/; " +
    " cp helm/address-book/Chart.yaml helm/address-book-nonprod-eu-west-1${zone}/"

  // Decrypt secrets
  sh "render" +
    " --input helm/address-book/templates/deployment.yaml" +
    " --output helm/address-book-nonprod-eu-west-1${zone}/templates/deployment.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.nonprod.yaml" +
    " --var app.image.nginxtag=nginx-${commitSha}" +
    " --var app.image.apptag=app-${commitSha}"+
    " --var app.branch=${branch}" +
    " --var app.buildJob=${jobName}" +
    " --var app.buildTimestamp=${timestamp}" +
    " --var app.deployJob=${jobName}" +
    " --var app.deployTimestamp=${timestamp}" +
    " --var app.sha=${commitSha}"

  sh "render" +
    " --input helm/address-book/templates/service.yaml" +
    " --output helm/address-book-nonprod-eu-west-1${zone}/templates/service.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.nonprod.yaml" +
    " --var app.image.nginxtag=nginx-${commitSha}" +
    " --var app.image.apptag=app-${commitSha}"

  sh "render" +
    " --input helm/address-book/templates/ingress.yaml" +
    " --output helm/address-book-nonprod-eu-west-1${zone}/templates/ingress.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.nonprod.yaml" +
    " --var app.image.nginxtag=nginx-${commitSha}" +
    " --var app.image.apptag=app-${commitSha}" +
    " --var app.dc=${dc}"

  // Perform the upgrade
  sh "helm upgrade address-book helm/address-book-nonprod-eu-west-1${zone}" +
    " --tiller-namespace oneaccount-management" +
    " --kube-context eu-west-1${zone}-nonprod" +
    " --namespace oneaccount-ppe" +
    " --install" +
    " --force" +
    " --tls" +
    " --tls-cert /tiller/tls.crt" +
    " --tls-key /tiller/tls.key" +
    " --tls-ca-cert /tiller/tls.key"
}
