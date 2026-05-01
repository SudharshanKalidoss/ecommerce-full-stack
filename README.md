# 🛍️ E-commerce Full Stack CRUD Application

A full-stack e-commerce application built as part of a technical assessment.
It supports **Admin** and **User (Consumer)** roles and demonstrates real-world practices like API design, authentication, validation, and deployment.

---

## 🚀 Live Demo

* 🌐 **Frontend (Vercel):** https://ecommerce-full-stack-woad.vercel.app
* 🔧 **Backend (Render):** https://ecommerce-full-stack-s04n.onrender.com/api

---

## 📌 Features

### 👤 User (Consumer)

* View product listings
* Add products to cart
* Remove products from cart
* View cart items
* Responsive UI (mobile-first)
* 🌙 Dark mode support

---

### 🧑‍💼 Admin

* Create products
* Update products
* Delete products
* View all products
* View registered users

---

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Shadcn/UI
* Axios

### Backend

* Node.js
* Express.js
* Sequelize ORM
* MySQL

### Authentication

* JWT (JSON Web Tokens)

### Deployment

* Frontend → Vercel
* Backend → Render
* Database → Railway (MySQL)

---

## 🔐 Authentication & Security

* JWT-based authentication
* Protected routes for admin operations
* Input validation and error handling middleware
* Role-based access control

---

## 🌙 Dark Mode

* Implemented dark mode for better user experience
* Toggle between light and dark themes
* Mobile-first responsive design

---

## 🧠 Architecture

### Backend Structure

```id="a1b2c3"
node/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── models/
 ├── middlewares/
```

### Frontend Structure

```id="d4e5f6"
react/
 ├── components/
 ├── pages/
 ├── api/
 ├── context/
```

---

## 📡 API Endpoints (Sample)

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Products

* GET `/api/products`
* POST `/api/products`
* PUT `/api/products/:id`
* DELETE `/api/products/:id`

### Cart

* GET `/api/cart`
* POST `/api/cart`
* DELETE `/api/cart/:id`

---

## 🤖 AI Tools Used

AI tools were actively used during development to improve productivity, debugging, and code quality.

### Tools Used

* Cursor (AI-powered code editor)
* ChatGPT (OpenAI)
* Claude (Anthropic)

### How They Were Used

* Converting UI layouts into React + Tailwind components
* Assisting with API integration and debugging issues
* Improving code structure and optimization
* Generating reusable components and boilerplate code
* Troubleshooting deployment and environment issues

### Outcome

AI tools helped accelerate development while maintaining clean architecture and best practices.

---

## ⚠️ Notes / Limitations

* File uploads are stored locally (non-persistent in cloud environment)
* In production, cloud storage like AWS S3 or Cloudinary would be used

---

## 🧪 Setup Instructions

### 1. Clone the repository

git clone https://github.com/your-username/ecommerce-full-stack.git
cd ecommerce-full-stack


---

### 2. Backend setup

cd node
npm install


Create `.env`:


DATABASE_URL=your_mysql_connection_string
JWT_ACCESS_TOKEN_SECRET=your_secret
JWT_REFRESH_TOKEN_SECRET=your_secret


Run backend:


npm run dev


---

### 3. Frontend setup

```bash id="s1t2u3"
cd react
npm install
```


Run frontend:

npm run dev


---

## 🎯 Project Highlights

* Full CRUD functionality
* Role-based access control
* Clean architecture and modular code
* Fully deployed full-stack application
* Dark mode implementation
* Effective use of AI tools in development

---

## 📬 Conclusion

This project demonstrates the ability to build, structure, and deploy a complete full-stack application with real-world considerations including authentication, validation, and scalability.

---
