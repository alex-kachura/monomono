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
  setGitHubPullRequestStatus state: 'PENDING', context: 'address-book_pull_request_builder', message: "Job #${env.BUILD_NUMBER} started"
	podTemplate(label: label, serviceAccount: 'jenkins',
  	containers: [
			containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave:alpine', resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi', envVars: [envVar(key: 'JAVA_OPTS', value: '-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -XshowSettings:vm')]),
			containerTemplate(name: 'docker', image: 'docker:18.02', command: 'cat', ttyEnabled: true,
                        resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi'),
      containerTemplate(name: 'awscli', image: 'quay.io/coreos/awscli:master', command: 'cat', ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi'),
      containerTemplate(name: 'hyperaurora', image:  '914904879356.dkr.ecr.eu-west-1.amazonaws.com/hyperaurora:latest', command: 'cat', alwaysPullImage: true, ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi')
    ],
		volumes: [
			hostPathVolume(hostPath: '/var/run/secure/jenkins-docker.sock', mountPath: '/var/run/docker.sock'),
			secretVolume(secretName: 'tiller-secret', mountPath: '/tiller')
		],
		annotations: [
			podAnnotation(key: "iam.amazonaws.com/role", value: "jenkins-slave-oneaccount")
		]
  ) {
    node(label) {
      def appTag = null
      def nginxTag = null
      stage('Checkout the repository') {
        def gitData = checkout(scm)
				commitSha = gitData.GIT_COMMIT.trim()
        branch = env.GITHUB_PR_SOURCE_BRANCH
        nginxTag = "nginx-" + commitSha
        appTag = env.GITHUB_PR_NUMBER
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

      stage('Tag and push PR image to ECR') {
        container('docker') {
          // Build the new images
          withCredentials([string(credentialsId: 'nexus-npm-token', variable: 'NPM_AUTH_TOKEN'),]) {
            sh "docker build -f ./Dockerfile.prod -t address-book:${appTag} --build-arg NPM_AUTH_TOKEN=${env.NPM_AUTH_TOKEN} ."
            sh "docker build -f ./Dockerfile.test -t address-book:test-${commitSha} --build-arg NPM_AUTH_TOKEN=${env.NPM_AUTH_TOKEN} ."
          }
					sh "docker build -f ./Dockerfile.nginx -t address-book:${nginxTag} --add-host=app:127.0.0.1 ."

          // Tag the built images
					// sh "docker tag address-book:${appTag} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:${appTag}"
					// sh "docker tag address-book:${nginxTag} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:${nginxTag}"
					// sh "docker tag address-book:test-${commitSha} 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:test-${commitSha}"

					// sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:${appTag}"
					// sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:nginx-${commitSha}"
					// sh "docker push 914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:test-${commitSha}"
        }
      }

			stage('Deploy address book review app') {
				// sh "wget -q http://dex-file-server.auth.svc.cluster.local:8080/bin/linux/dex-client"
        // sh "chmod +x dex-client"
        // sh "./dex-client pod" +
				// 	" --cluster-name eu-west-1a-nonprod" +
				// 	" --cluster-name eu-west-1b-nonprod" +
				// 	" --cluster-name eu-west-1c-nonprod"

				// withEnv(["KUBECONFIG=kubeconfig"]) {
				// 	container('hyperaurora') {
				// 		sh "helm init --client-only"

				// 		deployToEnvironment('a', branch, jobName, commitSha, timestamp)

        //     // Disabled until the Aurora team fixes a problem that locks DNS updates
        //     sh "kubectl --namespace oneaccount-dev --context eu-west-1a-nonprod run --rm --attach=true --restart=Never --env=\"BASE_URL=https://address-book-oneaccount-" + env.GITHUB_PR_NUMBER + ".eu-west-1a.nonprod.aurora.tescocloud.com\" address-book-tests-${UUID.randomUUID().toString()} --image=914904879356.dkr.ecr.eu-west-1.amazonaws.com/oneaccount/address-book:test-${commitSha}"
        //   }
        // }

        // sh("curl -H \"Content-Type: application/json\" -X POST -d '[\"ready for manual review\"]' https://github.dev.global.tesco.org/api/v3/repos/oneaccount/address-book/issues/${env.GITHUB_PR_NUMBER}/labels?access_token=${env.GITHUB_TOKEN}")
      }
    }
  }

  notifyOnSlack("good", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🎉 PR <$GITHUB_PR_URL|$GITHUB_PR_NUMBER $GITHUB_PR_TITLE> was successfully built and deployed! 🎉")
	currentBuild.result = 'SUCCESS'
} catch (e) {
  notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🔥 PR <$GITHUB_PR_URL|$GITHUB_PR_NUMBER $GITHUB_PR_TITLE> failed! 🔥\n${e.getMessage()}")
	println('Failure' + e.getMessage())
	currentBuild.result = 'FAILURE'
} finally {
  setGitHubPullRequestStatus state: currentBuild.result, context: 'address-book_deploy_review_app', message: "Job #${env.BUILD_NUMBER} finished: ${currentBuild.result}"
}

def notifyOnSlack(toneColor, message) {
  slackSend channel: '#oneaccount',
            teamDomain: 'tescooneaccount',
            color: toneColor,
            message: message
}

def deployToEnvironment(zone, branch, jobName, commitSha, timestamp) {
  def appName = "address-book-" + env.GITHUB_PR_NUMBER
  def dnsName = "address-book-oneaccount-" + env.GITHUB_PR_NUMBER + ".eu-west-1${zone}.nonprod.aurora.tescocloud.com"
  def chart = "helm/address-book-nonprod-eu-west-1" + zone + "-" + env.GITHUB_PR_NUMBER

  // Prepare env-specific configuration
  sh "mkdir -p ${chart}/; " +
    " cp helm/address-book/Chart.yaml ${chart}/"

  // Decrypt secrets
  sh "render " +
    " --input helm/address-book/templates/deployment.yaml" +
    " --output ${chart}/templates/deployment.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.dev.yaml" +
    " --var app.name=${appName}" +
    " --var app.image.apptag=${env.GITHUB_PR_NUMBER}" +
    " --var app.image.nginxtag=nginx-${commitSha}" +
    " --var app.branch=${branch}"

  sh "render " +
    " --input helm/address-book/templates/service.yaml" +
    " --output ${chart}/templates/service.yaml" +
    " --config helm/address-book/values.yaml" +
    " --config helm/address-book/values.dev.yaml" +
    " --var app.name=${appName}"

  sh "render " +
    " --input helm/data-portability/templates/ingress.yaml" +
    " --output ${chart}/templates/ingress.yaml" +
    " --config helm/data-portability/values.yaml" +
    " --config helm/data-portability/values.dev.yaml" +
    " --var app.name=${appName}" +
    " --var app.dc=AWS1"

  sh "helm delete --purge address-book-${GITHUB_PR_NUMBER}" +
    " --tiller-namespace oneaccount-management" +
    " --kube-context eu-west-1${zone}-nonprod" +
    " --tls" +
    " --tls-cert /tiller/tls.crt" +
    " --tls-key /tiller/tls.key" +
    " --tls-ca-cert /tiller/tls.key" +
    " || true"

  // Perform the upgrade
  sh "helm upgrade ${appName} ${chart}" +
    " --tiller-namespace oneaccount-management" +
    " --kube-context eu-west-1${zone}-nonprod" +
    " --namespace oneaccount-dev" +
    " --install" +
    // " --wait" +
    " --tls" +
    " --tls-cert /tiller/tls.crt" +
    " --tls-key /tiller/tls.key" +
    " --tls-ca-cert /tiller/tls.key"
}
