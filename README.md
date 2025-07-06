# Ecommerce Platform

## Introduction
A full-stack ecommerce web application with a modern React frontend and a robust Spring Boot backend. It supports user authentication, product catalog, shopping cart, order management, Stripe payments, and an admin dashboard.

## Tech Stack
- **Backend:**
  - Java 17
  - Spring Boot
  - Spring Security (JWT)
  - Spring Data JPA (PostgreSQL)
  - Stripe Java SDK
  - Liquibase (DB migrations)
  - Docker
- **Frontend:**
  - React 18
  - Vite
  - Tailwind CSS
  - Redux Toolkit
  - Framer Motion
  - Stripe.js & React Stripe.js
  - Axios
  - Docker
- **Database:**
  - PostgreSQL

## Features

### User Features
- Register and log in with secure JWT authentication
- Reset password via email
- Update profile information, change password, and upload avatar
- Browse product catalog with category filtering, search, and price range filters
- View detailed product pages with images and descriptions
- Add products to shopping cart, update quantities, or remove items
- View and manage shopping cart
- Checkout and pay securely using Stripe
- View order history and track order status (pending, processing, shipped, delivered, cancelled)
- Mark products as favourites/wishlist

### Admin Features
- Access admin dashboard with secure login
- View, add, edit, and delete products
- Manage all users: view, update, change roles, reset passwords
- View and manage all orders: update status, cancel, trigger order automation
- View sales and user statistics

## How to Run

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Ecommerce
   ```
2. **Create and edit the `.env` file:**
   - Copy `.env.example` to `.env` (or create `.env` in the root directory).
   - Fill in your database, Stripe, and email credentials. Example:
     ```env
     POSTGRES_DB=ecommerce
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=yourpassword
     POSTGRES_PORT=5432
     SERVER_PORT=8080
     APP_URL=http://localhost:8080
     FRONTEND_HOST=localhost
     FRONTEND_PORT=80
     CORS_ADDITIONAL_ORIGINS=http://localhost:80
     SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
     SPRING_DATASOURCE_USERNAME=postgres
     SPRING_DATASOURCE_PASSWORD=yourpassword
     STRIPE_SECRET_KEY=sk_test_...
     SPRING_MAIL_USERNAME=your-email@gmail.com
     SPRING_MAIL_PASSWORD=your-app-password
     ```
3. **Run with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   - Frontend: http://localhost (port 80)
   - Backend: http://localhost:8080
   - PostgreSQL: localhost:5432

## Admin Account
- Default admin credentials:
  - **Email:** `admin@example.com`
  - **Password:** `admin123`
- Change the admin password after first login for security. 