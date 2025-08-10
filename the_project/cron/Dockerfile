FROM alpine:latest

RUN apk add --no-cache wget bash

WORKDIR /app

COPY cron.sh .

RUN chmod +x cron.sh

CMD ["./cron.sh"]
