#!/usr/bin/env groovy

def label = "address-book-builder-${UUID.randomUUID().toString()}"

try {
	podTemplate(label: label, serviceAccount: 'jenkins',
  	containers: [
			containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave:alpine', resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi', envVars: [envVar(key: 'JAVA_OPTS', value: '-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -XshowSettings:vm')]),
      containerTemplate(name: 'hyperaurora', image:  '914904879356.dkr.ecr.eu-west-1.amazonaws.com/hyperaurora:latest', command: 'cat', alwaysPullImage: true, ttyEnabled: true,resourceRequestCpu: '500m', resourceLimitCpu: '500m', resourceRequestMemory: '300Mi', resourceLimitMemory: '300Mi')
    ],
		volumes: [
			secretVolume(secretName: 'tiller-secret', mountPath: '/tiller')
		],
		annotations: [
			podAnnotation(key: "iam.amazonaws.com/role", value: "jenkins-slave-oneaccount")
		]
  ) {
    node(label) {
			stage('Checkout the repository') {
        checkout(scm)
			}

      stage('Remove label if exists') {
        sh("curl -H \"Content-Type: application/json\" -X DELETE -d '[\"ready for manual review\"]' https://github.dev.global.tesco.org/api/v3/repos/oneaccount/address-book/issues/${env.GITHUB_PR_NUMBER}/labels/ready%20for manual%20review?access_token=${env.GITHUB_TOKEN} || true")
      }

			stage('Purge address book deploy of closed pr') {
				sh "wget -q http://dex-file-server.auth.svc.cluster.local:8080/bin/linux/dex-client"
        sh "chmod +x dex-client"
        sh "./dex-client pod --cluster-name eu-west-1a-nonprod"

				withEnv(["KUBECONFIG=kubeconfig"]) {
					container('hyperaurora') {
						sh "helm init --client-only"

						sh "helm delete --purge address-book-${GITHUB_PR_NUMBER}" +
							" --tiller-namespace oneaccount-management" +
							" --kube-context eu-west-1a-nonprod" +
							" --tls" +
							" --tls-cert /tiller/tls.crt" +
							" --tls-key /tiller/tls.key" +
							" --tls-ca-cert /tiller/tls.key"
          }
        }
      }
    }

  }
  currentBuild.result = 'SUCCESS'
} catch (e) {
  notifyOnSlack("danger", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🔥 Job failed! blame ${author}! 🔥\n${e.getMessage()}")
	println('Failure' + e.getMessage())
	currentBuild.result = 'FAILURE'
} finally {
	println("finally")
}

def notifyOnSlack(toneColor, message) {
  slackSend channel: '#oneaccount',
            teamDomain: 'tescooneaccount',
            color: toneColor,
            message: message
}
