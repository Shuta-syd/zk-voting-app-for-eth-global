FROM node:18-bullseye

WORKDIR /app

RUN apt update
RUN apt install vim -y

RUN git config --global user.email "you@example.com"
RUN git config --global user.name "Your Name"

RUN npm install -g zkapp-cli

RUN npm install --save-dev typescript --prefix /app/contracts
# RUN npm run build --prefix /app/contracts

# RUN npm run build --prefix /app/ui

# RUN zk project zkapp
# RUN zk deploy berkeley

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
# CMD ["npm", "run", "build"]

