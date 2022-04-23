FROM node:16-slim

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install ca-certificates -y 

WORKDIR /usr/local/share/ca-certificates
COPY zscaler.pem zscaler.crt
RUN update-ca-certificates

RUN npm config set cafile /etc/ssl/certs/ca-certificates.crt

WORKDIR /home/appuser

# # Install dependencies.
RUN npm install -g npm@latest && \
    npm install -g serve

# Install Javascript dependencies and build.
COPY ./ /home/appuser/
RUN npm install --production

COPY . /home/appuser/
RUN npm run build

RUN useradd --create-home appuser && \
    chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 8000

CMD serve -l 8000 -s build