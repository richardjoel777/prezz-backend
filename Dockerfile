FROM node:18.12.1
RUN mkdir /app/
COPY . /app/
WORKDIR /app/
# RUN npm install
RUN npm ci --only=production
RUN npx prisma generate
EXPOSE 6969
CMD ["npm","start"]
