# Multi-stage build for the Photato Go backend.
#
# The binary is fully static (CGO disabled; modernc.org/sqlite is pure Go), so it
# runs on a distroless "static" base with no libc. CA certificates come with the
# base image, which the app needs to call Auth0 /userinfo over HTTPS.
#
# The container runs as uid 1000 (set in infra/docker-compose.yml) so it can write
# the SQLite DB + WAL into the bind-mounted, david-owned data volume.

FROM golang:1.26.4-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/server /server
EXPOSE 9003
ENTRYPOINT ["/server"]
