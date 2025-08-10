#!/usr/bin/env bash
set -e

# Get the URL of a random Wikipedia page by following redirect location header
WIKI_URL=$(wget --server-response --max-redirect=0 -qO- https://en.wikipedia.org/wiki/Special:Random 2>&1 | grep -i Location | awk '{print $2}' | tr -d '\r')

echo "Random Wiki URL is: $WIKI_URL"

# You can simulate creating a todo here (for now just echo)
echo "Creating todo: Read $WIKI_URL"

# POST to your backend todo API using wget
wget --method=POST --header="Content-Type: application/json" \
    --body-data="{\"text\":\"Read $WIKI_URL\"}" \
    -qO- http://todo-backend-service:3002/todos

