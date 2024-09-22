# Stage 1 - Build frontend
FROM node:14 as frontend-build
WORKDIR /fullstack/frontend

# Step 1 - Download all package dependencies first.
# We will redownload dependencies only when packages change.
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install

# Step 2 - Copy all source and run build
COPY . ./
RUN npm run build

# Stage 2 - Build a minimal image with the deployable package
FROM nginx:1.12-alpine
COPY --from=frontend-build /fullstack/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]