DOCKER_IMAGE_NAME = zk-voting-app
DOCKER_VOLUME_FLAGS = -v "$(PWD)/contracts:/app/contracts" -v "$(PWD)/ui:/app/ui"

.PHONY: all clean logs ps build up down down-clean exec logs-compose restart start stop

all: $(DOCKER_IMAGE_NAME)

$(DOCKER_IMAGE_NAME):
	@printf "zk-voting-app Project Started!!!\n"
	docker compose up -d

run:
	docker exec -it $(DOCKER_IMAGE_NAME) bash

clean:
	docker compose down

logs:
	docker logs $(DOCKER_IMAGE_NAME)

ps:
	docker ps -f "ancestor=$(DOCKER_IMAGE_NAME)"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

down-clean:
	docker compose down --rmi all --volumes --remove-orphans

exec:
	docker exec -it $(DOCKER_IMAGE_NAME) bash

logs-compose:
	docker compose logs

restart:
	docker compose restart

start:
	docker compose start

stop:
	docker compose stop
