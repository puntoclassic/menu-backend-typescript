FROM "node"
WORKDIR /var/www/backend
COPY ./ ./
RUN ["yarn","install"]
CMD ["yarn","prod"]