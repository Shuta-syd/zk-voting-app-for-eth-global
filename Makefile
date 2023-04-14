DOCKER_IMAGE_NAME = zk-voting-app
DOCKER_VOLUME_FLAGS = -v "$(PWD)/contracts:/app/contracts" -v "$(PWD)/ui:/app/ui"

.PHONY: all clean logs ps

all: $(DOCKER_IMAGE_NAME)

$(DOCKER_IMAGE_NAME):
	@printf "zk-voting-app Project Started!!!\n"
	docker compose up -d

run:
	docker exec -it zk-voting-app bash

clean:
	docker compose down

logs:
	docker logs $(DOCKER_IMAGE_NAME)

ps:
	docker ps -f "ancestor=$(DOCKER_IMAGE_NAME)"
