# 🛒 Ecommerce Platform

## ✨ Introduction

Welcome to the **Ecommerce Platform** – a modern, full-stack web application designed for seamless online shopping. Enjoy a beautiful React frontend, a robust Spring Boot backend, secure payments, and a powerful admin dashboard.

---

## 🛠️ Tech Stack

**Backend:**
- ☕ Java 17
- 🚀 Spring Boot & Spring Security (JWT)
- 🗄️ Spring Data JPA (PostgreSQL)
- 💳 Stripe Java SDK
- 🐘 Liquibase (DB migrations)
- 🐳 Docker

**Frontend:**
- ⚛️ React 18 + Vite
- 🎨 Tailwind CSS
- 🛠️ Redux Toolkit
- 🎞️ Framer Motion
- 💳 Stripe.js & React Stripe.js
- 🔗 Axios
- 🐳 Docker

**Database:**
- 🐘 PostgreSQL

---

## 🌟 Features

### 👤 User Features
- 🔐 Secure registration & JWT login
- ✉️ Password reset via email
- 📝 Profile management (update info, change password, upload avatar)
- 🛍️ Browse & search product catalog with filters
- 📦 Detailed product pages with images & descriptions
- ➕ Add/update/remove products in cart
- 🛒 View & manage shopping cart
- 💳 Secure Stripe checkout
- 📜 Order history & status tracking (pending, processing, shipped, delivered, cancelled)
- ❤️ Favourites/wishlist support

### 🛡️ Admin Features
- 🖥️ Secure admin dashboard
- 🛠️ Full product CRUD
- 👥 User management (view, update, change roles, reset passwords)
- 📦 Order management (update status, cancel, automation)
- 📊 Sales & user statistics

---

## ⚙️ Environment & Configuration

### 1️⃣ Environment Variables

Create a `.env` file in your project root with the following content:

```env
# Database Configuration
POSTGRES_DB=ecommerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432

# Backend Configuration
BACKEND_PORT=8080
APP_URL=http://localhost

# Frontend Configuration
FRONTEND_HOST=http://localhost
FRONTEND_PORT=80

# CORS Configuration (auto-generated from FRONTEND_HOST:FRONTEND_PORT)
# Add additional origins if needed, separated by commas
CORS_ADDITIONAL_ORIGINS=

# Spring Boot Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=root
SERVER_PORT=8080
```

---

### 2️⃣ Backend Settings

Open `backend/ecommerce/src/main/resources/application.properties` to configure:
- 📧 Email settings
- 📁 File upload settings
- 🔑 **Stripe Secret Key**: Set `stripe.secret.key` here

---

### 3️⃣ Stripe Integration

You need **two Stripe keys**:

- 🔑 **Stripe Secret Key**:  
  Set in `application.properties` as `stripe.secret.key`
- 🪙 **Stripe Publishable Key**:  
  Set in the frontend, in `frontend/src/pages/PaymentPage.jsx` (replace the value in `loadStripe('pk_test_...')`)

**How to get your Stripe keys:**
1. Create or log in to your Stripe account
2. Visit [Stripe Dashboard API Keys](https://dashboard.stripe.com/test/apikeys)
3. Copy the **Secret Key** for backend and the **Publishable Key** for frontend

> ⚠️ **Never commit your secret keys to version control!**

---

## 👑 Admin Account

- **Default admin credentials:**
  - 📧 Email: `admin@example.com`
  - 🔑 Password: `admin123`
- **Security Tip:** Change the admin password after your first login.

---

## 🙋 Need Help?

If you run into any issues, have questions, or want to contribute:

- 📚 **Check the Docs:** Review this README and comments in the code for guidance.
- 🐞 **Report Bugs:** Found a bug or security issue? Please open an issue on the [GitHub Issues page](https://github.com/hfakeeeeee/Ecommerce/issues).
- 💬 **Ask for Help:** Feel free to start a discussion, open an issue, or email: **huynguyenquoc.work@gmail.com**
- 🤝 **Contribute:** Pull requests are welcome! Please fork the repo and submit your improvements.

Your feedback and contributions help make this project better for everyone. Thank you for being a part of the community! 🚀 