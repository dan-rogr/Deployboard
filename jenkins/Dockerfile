FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    lsb-release \
    git \
    nodejs \
    npm \
    docker.io \
    docker-compose \
    && apt-get clean

USER jenkins