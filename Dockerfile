FROM node:16-bullseye AS builder

WORKDIR /opt/zeroed-books-web

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build && ls dist


# The production image is a customized NGINX image that manipulates some
# variables in "index.html" before serving the files as normal.
FROM nginx:1.21 AS prod

# Make sure we override the default server.
COPY ./nginx/webapp.conf /etc/nginx/conf.d/default.conf
COPY ./entrypoint.sh /entrypoint.sh

COPY --from=builder /opt/zeroed-books-web/dist/ /usr/share/nginx/html
RUN ls /usr/share/nginx/html

ENTRYPOINT [ "/entrypoint.sh" ]
