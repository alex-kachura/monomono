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

			stage('Run integration tests') {
				container('docker') {
				  withCredentials([string(credentialsId: 'nexus-npm-token', variable: 'NPM_AUTH_TOKEN'),]) {
            sh "docker build -f ./Dockerfile.test -t address-book:test-${commitSha} --build-arg NPM_AUTH_TOKEN=${env.NPM_AUTH_TOKEN} ."
          }
				}
			}
		}
	}

  notifyOnSlack("good", "[<$BUILD_URL|$JOB_NAME #$BUILD_NUMBER>]: 🎉 Integration tests passed! 🎉")
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
