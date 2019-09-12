#!/usr/bin/env groovy

def dateFormat = new SimpleDateFormat("yyyyMMddHHmm")
def deployTimestamp = dateFormat.format(new Date())
def label = "address-book-builder-${UUID.randomUUID().toString()}"
def branch
def deployJob = "${env.JOB_NAME}-${env.BUILD_NUMBER}"
def commitSha
def buildJob
def buildTimestamp

try {
  notifyOnSlack("warning", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🚨  Starting rollback of production! Man your stations! 🚨")

	podTemplate(
		label: label,
		serviceAccount: 'jenkins',
		containers: [
			containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave:alpine', resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi', envVars: [envVar(key: 'JAVA_OPTS', value: '-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -XshowSettings:vm')]),
			containerTemplate(name: 'docker', image: 'docker:1.11.2', command: 'cat', ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi'),
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
        checkout(scm)
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

			stage('Discard current latest and replace it with previous') {
				container('docker') {
          // Get previous deployment
          sh "docker pull 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:previous"

          // Retag previous as latest
					sh "docker tag 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:previous 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest"
					sh "docker tag 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-previous 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-latest"

          // Push new tags to ECR
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:latest"
					sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-latest"

          // Get image labels
          branch = sh(returnStdout: true, script: "docker inspect address-book:latest -f \"{{ .Config.Labels.branch }}\"").trim()
          buildJob = sh(returnStdout: true, script: "docker inspect address-book:latest -f \"{{ .Config.Labels.jobName }}\"").trim()
          commitSha = sh(returnStdout: true, script: "docker inspect address-book:latest -f \"{{ .Config.Labels.commitSha }}\"").trim()
          buildTimestamp = sh(returnStdout: true, script: "docker inspect address-book:latest -f \"{{ .Config.Labels.timestamp }}\"").trim()
				}
			}

			stage('Deploy address book') {
				sh "wget -q http://dex-file-server.auth.svc.cluster.local:8080/bin/linux/dex-client"
        sh "chmod +x dex-client"

				withEnv(["KUBECONFIG=kubeconfig"]) {
					container('hyperaurora') {
						sh "helm init --client-only"
            sh "echo ${branch} ${buildJob} ${buildTimestamp} ${deployJob} ${deployTimestamp} ${commitSha}"

            deployToEnvironment('a', branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha)

            deployToEnvironment('b', branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha)

            deployToEnvironment('c', branch, buildJob, buildTimestamp, deployJob, deployTimestamp, commitSha)
					}
				}
			}
		}
	}

  notifyOnSlack("good", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🎉  <https://www.tesco.com/address-book/en-GB|production> was rolled back successfully! 🎉")
	currentBuild.result = 'SUCCESS'
} catch (e) {
  notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🔥 Rollback failed! Everybody panic! 🔥\n${e.getMessage()}")
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

  try {
    sh "./dex-client pod --cluster-name eu-west-1${zone}-prod"
  } catch (e) {
    notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 😱 Could not connect to cluster eu-west-1${zone}-prod! 😱\n${e.getMessage()}")
    return
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
