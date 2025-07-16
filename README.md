# 🛒 TECHVERSE - Modern Ecommerce Platform

## ✨ Introduction

Welcome to **TECHVERSE** – a cutting-edge, full-stack ecommerce platform designed for seamless online shopping experiences. Built with modern technologies, this platform offers a beautiful React frontend with advanced animations, a robust Spring Boot backend with comprehensive security, and an intelligent AI-powered chat support system.

---

## 🛠️ Tech Stack

**Backend:**
- ☕ Java 17
- 🚀 Spring Boot & Spring Security (JWT)
- 🗄️ Spring Data JPA (PostgreSQL)
- 💳 Stripe Java SDK
- 🐘 Liquibase (Database migrations)
- 📧 Spring Mail (Email notifications)
- ⏰ Spring Quartz (Order automation)
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
- 🐘 PostgreSQL (Alpine)

**Infrastructure:**
- 🐳 Docker Compose
- 🌐 Nginx (Frontend serving)
- 📁 File uploads with static resource serving

---

## 🌟 Features

### 👤 User Features
- 🔐 **Secure Authentication**: JWT-based login/register with password reset via email
- 👤 **Profile Management**: Update personal info, change password, upload avatar
- 🛍️ **Advanced Product Catalog**: 
  - Search with filters (price range, categories)
  - Pagination and sorting options
  - Detailed product pages with images
- 🛒 **Smart Shopping Cart**: Add/update/remove products with real-time updates
- 💳 **Secure Stripe Checkout**: Integrated payment processing with test cards
- 📦 **Order Management**: 
  - Complete order history
  - Real-time status tracking (pending → processing → shipped → delivered → cancelled)
  - Automated order status updates
- ❤️ **Favourites/Wishlist**: Save and manage favorite products
- 💬 **AI Chat Support**: Intelligent customer service chatbot with product recommendations
- 🎨 **Modern UI/UX**: 
  - Dark/Light theme support
  - Responsive design
  - Smooth animations and transitions
  - Interactive components

### 🛡️ Admin Features
- 🖥️ **Secure Admin Dashboard**: Role-based access control
- 🛠️ **Product Management**: Full CRUD operations with image uploads
- 👥 **User Management**: View, update, change roles, reset passwords
- 📦 **Order Management**: Update status, cancel orders, automation
- 📊 **Analytics Dashboard**: Sales statistics and user analytics
- 📈 **Monthly Order Reports**: Visual charts and data insights

### 🤖 AI Chat Support System
- 💬 **Intelligent Conversations**: Context-aware responses
- 🔍 **Product Search**: Natural language product discovery
- 📦 **Product Recommendations**: Smart suggestions with images and links
- 🚚 **Shipping Information**: Automated shipping policy responses
- 🔄 **Return Policy Support**: Instant return and refund information
- 🎯 **Conversation Memory**: Maintains context across chat sessions
- 🖼️ **Rich Media Support**: Product images and clickable links

### 🎯 Customer Service Pages
- 📦 **Shipping Information**: Detailed shipping policies and costs
- 🛡️ **Warranty Details**: Product warranty information
- 📚 **Setup Guides**: Product installation and setup instructions
- ❓ **FAQ Section**: Common questions and answers
- 📞 **Contact Information**: Multiple ways to reach support

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- Node.js (v18+) and npm (for local development)
- Java 17 (for local development)
- Maven or Gradle (for local development)

### 1️⃣ Clone and Setup

```bash
git clone https://github.com/hfakeeeeee/Ecommerce.git
cd Ecommerce
```

### 2️⃣ Environment Configuration

Edit a `.env` file in the project root:

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
VITE_BACKEND_URL=http://localhost:8080

# CORS Configuration
CORS_ADDITIONAL_ORIGINS=

# Spring Boot Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=root
SERVER_PORT=8080
```

Also edit a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:8080
```

### 3️⃣ Stripe Configuration

**Required Stripe Keys:**
- 🔑 **Secret Key**: Set in `backend/ecommerce/src/main/resources/application.properties`
- 🪙 **Publishable Key**: Set in `frontend/src/pages/PaymentPage.jsx`

**Get your Stripe keys:**
1. Create/Login to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy **Secret Key** for backend
3. Copy **Publishable Key** for frontend

> ⚠️ **Never commit your secret keys to version control!**

### 4️⃣ Running with Docker (Recommended for Production)

```bash
# Build and start all services
docker-compose up --build

# To run in detached mode
docker-compose up -d --build

# To stop all services
docker-compose down
```

The application will be available at:
- 🌐 **Frontend**: http://localhost
- 🔧 **Backend API**: http://localhost:8080

### 5️⃣ Running Locally (Recommended for Development)

**Start PostgreSQL Database:**
```bash
# Start only the database service
docker-compose up postgres -d
```

**Start Backend:**
```bash
# Navigate to backend directory
cd backend/ecommerce

# Build the project
./gradlew build

# Run the application
./gradlew bootRun
```

**Start Frontend:**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The development servers will be available at:
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8080

### 6️⃣ Development Tips

- Use `npm run dev` for hot-reload frontend development
- Use `./gradlew bootRun` with dev tools for backend development
- Access Swagger UI at http://localhost:8080/swagger-ui.html
- PostgreSQL database can be accessed at localhost:5432

### 7️⃣ Troubleshooting Local Setup

1. **Port Conflicts**
   - Ensure ports 5432 (PostgreSQL), 8080 (Backend), and 5173/80 (Frontend) are available
   - Modify ports in `.env` if needed

2. **Database Connection**
   - For local development, update `SPRING_DATASOURCE_URL` to `jdbc:postgresql://localhost:5432/ecommerce`
   - Ensure PostgreSQL service is running: `docker ps`

3. **Frontend API Connection**
   - Verify `VITE_BACKEND_URL` matches your backend URL
   - Check CORS settings in backend if getting connection errors

4. **Build Issues**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Gradle cache: `./gradlew clean`
   - Check Java version: `java -version`

---

## 🧪 Testing

### Stripe Test Cards
Use these test card details for payment testing:

- **Card Number:** `4242 4242 4242 4242`
- **Expiration Date:** Any valid future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP Code:** Any 5-digit number (e.g., `12345`)

---

## 👑 Admin Account

- **Default admin credentials:**
  - 📧 Email: `admin@example.com`
  - 🔑 Password: `admin123`
- **Security Tip:** Change the admin password after your first login.
---

## 🏗️ Architecture

### Backend Structure
```
backend/ecommerce/
├── config/          # Security and web configuration
├── controller/      # REST API endpoints
├── dto/            # Data transfer objects
├── model/          # JPA entities
├── repository/     # Data access layer
├── security/       # JWT and security configuration
├── service/        # Business logic layer
└── resources/
    ├── db/         # Liquibase migrations
    └── data/       # Initial data (products.csv)
```

### Frontend Structure
```
frontend/src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── pages/          # Page components
├── config/         # Configuration files
└── assets/         # Static assets
```

### Key Features Implementation
- **JWT Authentication**: Secure token-based auth with refresh
- **File Uploads**: Avatar and product image management
- **Order Automation**: Scheduled status updates via Quartz
- **Email Notifications**: Password reset and order confirmations
- **Real-time Chat**: WebSocket-like chat with AI responses
- **Analytics**: Dashboard with charts and statistics

---

## 🔧 Configuration

### Email Settings
Configure SMTP in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Order Automation
Customize order status update intervals:
```properties
order.automation.pending-to-processing-seconds=30
order.automation.processing-to-shipped-seconds=60
order.automation.shipped-to-delivered-seconds=90
```

### File Upload
Configure upload limits and directory:
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=/app/uploads
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL container is running
   - Check database credentials in `.env`

2. **Stripe Payment Errors**
   - Verify Stripe keys are correctly configured
   - Use test card numbers for development

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits

4. **Chat Not Working**
   - Ensure user is authenticated
   - Check browser console for errors

### Development Commands

```bash
# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Access database
docker-compose exec postgres psql -U postgres -d ecommerce

# Clean rebuild
docker-compose down -v
docker-compose up --build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 🙋 Need Help?

If you run into any issues, have questions, or want to contribute:

- 📚 **Check the Docs:** Review this README and comments in the code for guidance.
- 🐞 **Report Bugs:** Found a bug or security issue? Please open an issue on the [GitHub Issues page](https://github.com/hfakeeeeee/Ecommerce/issues).
- 💬 **Ask for Help:** Feel free to start a discussion, open an issue, or email: **huynguyenquoc.work@gmail.com**
- 🤝 **Contribute:** Pull requests are welcome! Please fork the repo and submit your improvements.

Your feedback and contributions help make this project better for everyone. Thank you for being a part of the community! 🚀 