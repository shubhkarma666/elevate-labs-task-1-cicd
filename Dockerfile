FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node app.js ./

USER node
EXPOSE 3000

CMD ["node", "app.js"]
