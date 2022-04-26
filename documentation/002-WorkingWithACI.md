## Setup CLI, and Login
- install azure cli 
    - [Download](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
- login in to azure 
    - `az login --tenant KiewitBrianOlson.onmicrosoft.com`
- log docker in to auzre
    - `docker login azure`

## Create a resource Group
- `az group create --name AppDevSandbox --location southcentralus`
    - this was the easiest step.  It is all up hill from here :/

## Create Azure Container Registry
- [Source](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)
- create the container registry
    - `az acr create --resource-group AppDevSandbox --name appdevsandboxacr --sku Basic`
- add admin account (not recomended, but easiest)
    - `az acr update -n appdevsandboxacr --admin-enabled true`
    - once admin account is enabled, you can get the password in the azure portal under "Access Keys"

## Publish Images To Azure Container Registry
[Source](https://docs.microsoft.com/en-us/azure/container-instances/tutorial-docker-compose)
- make sure we are using the default docker context
    - `docker context use default`
- login to acr
    - `az acr login --name appdevsandboxacr`
- get the login server name of our acr
    - az acr list --resource-group AppDevSandbox --query "[].{acrLoginServer:loginServer}" --output table
    - our images *must* be tagged with this (`appdevsandboxacr.azurecr.io/thing-service:latest`)
    - [source](https://koukia.ca/push-docker-images-to-azure-container-registry-ed21facefd0c)
- build our images
    - `docker compose -f infrastructure/DockerCompose-localdev.yml build`
- push our images
    - `docker compose -f infrastructure/DockerCompose-localdev.yml build`

## Create Azure Container Instance
- [source](https://docs.microsoft.com/en-us/azure/container-instances/tutorial-docker-compose)
- Create our ACI context in azure 
    - `docker context create aci appdevcontext`
    - this will ask you what resource group to use
- list our contexts 
    - `docker context ls`

## Use Docker Compose to Deploy to Azure Container Instance from Azure Container Registry
- [source](https://docs.microsoft.com/en-us/azure/container-instances/tutorial-docker-compose)
- tell docker to use our ACI context
    - `docker context use appdevcontext`
- kick start it 
    - `docker compose -f infrastructure\DockerCompose-localdev.yml -up`

## Use Github Actions to push to ACR, and then Deploy to ACI






- point docker to azure aci - `docker context create aci myaci`
    - it will ask you what resource gorup to use
- list stuff in that context - `docker context ls`
- set the docker context to our new ACI context - `docker context use myaci`
    - !!! docker commands will now go to this ACI instead of local docker !!!!
- `docker compose up -f .\infrastructure\DockerCompose-localdev.yml`

https://docs.microsoft.com/en-us/azure/container-instances/using-azure-container-registry-mi

- create id for container registry `az identity create --resource-group AppDevSandbox --name myarcid`
- get the createxed userID - `az identity show --resource-group AppDevSandbox --name myarcid --query id --output tsv`
- get the created SPID = `az identity show --resource-group AppDevSandbox --name myarcid --query principalId --output tsv`
- assign roll to acr - `az role assignment create --assignee <spid> --scope <registry-id> --role acrpull`



