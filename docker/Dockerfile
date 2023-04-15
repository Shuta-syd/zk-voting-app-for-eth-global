FROM node:18-bullseye

WORKDIR /app

RUN apt update
RUN apt install vim -y

RUN git config --global user.email "you@example.com"
RUN git config --global user.name "Your Name"

RUN npm install -g zkapp-cli
# RUN zk project zkapp
# RUN zk deploy berkeley

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
