
# Building Docker Files
All build commands issued from the root of the repository


`docker build --pull --rm -f "infrastructure/DockerFile.bff-service" -t demo-bff:latest "source/bff-service" `
`docker build --pull --rm -f "infrastructure/DockerFile.count-service" -t demo-count-service:latest "source/count-service"`
`docker build --pull --rm -f "infrastructure/DockerFile.sql-service" -t dev-sql-service:latest "source/dev-sql"`


- `--no-cache`		Do not use cache when building the image
- `--rm`	Remove intermediate containers after a successful build
- `--pull`		Always attempt to pull a newer version of the image
- `-t`		Name and optionally a tag in the 'name:tag' format

# Running a container that has been built

`docker run --rm -it -p 5000:80  demo-bff:latest`
`docker run --rm -it dev-sql-service:latest`
`docker run --rm -it -p 1433:1433 dev-sql-service:latest`

- `--rm` Automatically remove the container when it exits
- `-it` allocate a pseudo-TTY connected to the container’s stdin
- `-p` Publish a container's port(s) to the host (forward port 5000 to 80 in the container)




# Run local Dev using docker-compose

`docker-compose.exe -f ./infrastructure/DockerCompose-localdev.yml up`


`
docker system prune -a
docker builder prune 
docker compose -f ./infrastructure/DockerCompose-localdev.yml build --no-cache
docker compose -f ./infrastructure/DockerCompose-localdev.yml up --remove-orphans
`