FROM golang:1.17.6 AS s3-copy

RUN GOPRIVATE='github.com/Zeroed-Books/*' CGO_ENABLED=0 go install github.com/Zeroed-Books/s3-copy@v0.1.0

FROM node:16-bullseye AS builder

WORKDIR /opt/zeroed-books-web

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build


# The production image is a customized NGINX image that manipulates some
# variables in "index.html" before serving the files as normal.
FROM nginx:1.21 AS prod

COPY --from=s3-copy /go/bin/s3-copy /usr/local/bin/s3-copy

# Make sure we override the default server.
COPY ./nginx/webapp.conf /etc/nginx/conf.d/default.conf
COPY ./entrypoint.sh /entrypoint.sh

COPY --from=builder /opt/zeroed-books-web/dist/ /usr/share/nginx/html

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "serve" ]
