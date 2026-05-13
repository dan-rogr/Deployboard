COMPOSE_DEV=docker compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: dev up down logs restart clean ps jenkins jenkins-logs jenkins-down

dev:
	$(COMPOSE_DEV) up --build

up:
	$(COMPOSE_DEV) up -d --build

down:
	$(COMPOSE_DEV) down

logs:
	$(COMPOSE_DEV) logs -f

restart:
	$(COMPOSE_DEV) down
	$(COMPOSE_DEV) up -d --build

clean:
	$(COMPOSE_DEV) down -v

ps:
	$(COMPOSE_DEV) ps

jenkins:
	docker compose -f docker-compose.yml -f docker-compose.jenkins.yml up -d jenkins

jenkins-logs:
	docker logs -f deployboard-jenkins

jenkins-down:
	docker compose -f docker-compose.yml -f docker-compose.jenkins.yml down
