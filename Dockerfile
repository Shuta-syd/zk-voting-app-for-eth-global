FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && apt-get install -y git npm


CMD ["tail", "-f", "/dev/null"]
