# Step 1: Use an official nginx image as a parent image
FROM nginx:latest

# Step 2: Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 3: Copy website files to the nginx html directory
COPY . /usr/share/nginx/html

# Step 4: Expose port 80 to the outside world
EXPOSE 80

# Step 5: Start nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
