FROM node:21-alpine
WORKDIR /app/
COPY package.json package-lock.json /app/
RUN npm ci --omit=dev
COPY . /app/
EXPOSE 3000
CMD [ "npm", "start" ]
