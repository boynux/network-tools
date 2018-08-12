FROM node:8-slim

RUN apt-get -y update \
    && apt-get -y --no-install-recommends install iputils-ping host traceroute
# Enable AS path lookup
RUN echo whois    43/tcp  nicname >> /etc/services

ENV PORT 3000

COPY . /app
WORKDIR /app

RUN npm install

CMD ["npm", "start"]

