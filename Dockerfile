# ---------- Build Stage ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install all dependencies (including dev) for building the frontend
COPY package.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Vite/React frontend (outputs to ../dist which resolves to /app/dist)
RUN npm run build

# ---------- Production Runtime ----------
FROM node:18-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Copy only production‑ready files
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Expose the port the Express server listens on
EXPOSE 3000

# Start the Express backend (which serves the built frontend)
CMD ["npm", "start"]