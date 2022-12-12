FROM node:16.15.1
WORKDIR /backend
COPY package*.json /backend
RUN npm install
COPY . /backend

EXPOSE 3001
CMD ["npm", "run", "start"]