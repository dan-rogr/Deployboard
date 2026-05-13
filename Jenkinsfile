pipeline {
    agent any

    environment {
        APP_NAME = 'deployboard-backend'
        IMAGE_NAME = 'deployboard-backend'
        COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_DEV_FILE = 'docker-compose.dev.yml'
        HEALTHCHECK_URL = 'http://host.docker.internal/health'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Obteniendo codigo fuente...'
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run tests / validation') {
            steps {
                dir('backend') {
                    sh 'npm run test --if-present'
                    sh 'npm run lint --if-present'
                }
            }
        }

        stage('Build Docker image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ./backend'
                sh 'docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh 'docker-compose -f ${COMPOSE_FILE} -f ${COMPOSE_DEV_FILE} config'
            }
        }

        stage('Start stack') {
            steps {
                sh '''
                    docker-compose -f ${COMPOSE_FILE} -f ${COMPOSE_DEV_FILE} down -v --remove-orphans || true

                    docker rm -f deployboard-postgres \
                        deployboard-backend \
                        deployboard-prometheus \
                        deployboard-grafana \
                        deployboard-nginx || true

                    docker-compose -f ${COMPOSE_FILE} -f ${COMPOSE_DEV_FILE} up -d --build
                '''
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    echo "Esperando servicios..."
                    sleep 30

                    curl --retry 10 \
                        --retry-delay 5 \
                        --retry-connrefused \
                        -f ${HEALTHCHECK_URL}
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente.'
        }

        failure {
            echo 'El pipeline fallo. Revisar logs de Jenkins.'
            sh 'docker-compose -f ${COMPOSE_FILE} -f ${COMPOSE_DEV_FILE} logs --tail=100 || true'
        }

        always {
            echo 'Estado final de contenedores:'
            sh 'docker-compose -f ${COMPOSE_FILE} -f ${COMPOSE_DEV_FILE} ps || true'
        }
    }
}
