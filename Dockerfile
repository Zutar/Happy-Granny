FROM node:14
# создание директории приложения
WORKDIR /var/www/html/app
COPY ./app/ ./
RUN npm install
#RUN node app.js
#EXPOSE 80
CMD [ "node", "app.js" ]