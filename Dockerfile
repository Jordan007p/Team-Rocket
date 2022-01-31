FROM node:12
WORKDIR /Domasna4
COPY package*.json ./
RUN apt-get update || : && apt-get install python3 -y
RUN npm install
RUN apt-get install sqlite3 libsqlite3-dev -y
RUN npm install sqlite3
RUN apt-get update && apt-get install -y \
    python3-pip
RUN pip3 install folium
RUN pip3 install shapely
RUN pip3 install pysqlite3
RUN pip3 install openrouteservice
COPY . .
ENV PORT=80
EXPOSE 80
CMD ["node", "." ]