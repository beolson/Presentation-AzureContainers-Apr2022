# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS bff-build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY ./bff-service/bff-service.csproj .
RUN dotnet restore

# copy everything else and build app
COPY ./bff-service .
RUN dotnet publish -c release -o /app 

FROM node:16-slim as ui-build

WORKDIR /home/appuser

# # Install dependencies.
RUN npm install -g npm@latest && \
    npm install -g serve

# Install Javascript dependencies and build.
COPY ./ui-app/package.json /home/appuser/
RUN npm install --production

COPY ./ui-app/ /home/appuser/
RUN npm run build


# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=bff-build /app ./
COPY --from=ui-build /home/appuser/build ./wwwroot
ENTRYPOINT ["dotnet", "bff-service.dll"]