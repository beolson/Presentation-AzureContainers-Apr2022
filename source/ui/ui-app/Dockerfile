FROM node:16-slim

WORKDIR /home/appuser

# # Install dependencies.
RUN npm install -g npm@latest && \
    npm install -g serve

# Install Javascript dependencies and build.
COPY ./ /home/appuser/
RUN npm install --production

COPY . /home/appuser/
RUN npm run build

# RUN useradd --create-home appuser && \
#     chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 8000

CMD serve -l 8000 -s build