### 🏔️ SportGear
### Role-Based Outdoor Adventure E-Commerce Platform

SportGear is a full-stack role-based e-commerce platform built for outdoor enthusiasts.
It features a secure authentication system, strict role-based authorization, modular frontend architecture, and a scalable backend powered by RESTful APIs.

The project is designed to mirror real-world production workflows, not a tutorial-style demo.

--------------------------------------------------------------

### 🌄 Project Summary

SportGear enables customers to explore and purchase outdoor gear while providing administrators with controlled access to inventory and order management.

The system is built with a clear separation between frontend and backend and follows industry-level security practices.

This project demonstrates practical experience with:
--- Full-stack application architecture
--- RESTful API design
--- JWT authentication
--- Role-Based Access Control (RBAC)
--- Modular frontend styling
--- MongoDB data modeling

--------------------------------------------------------------

### 📸 Application Preview
### 🏠 Home Page

<img width="1920" height="1200" alt="Screenshot (718)" src="https://github.com/user-attachments/assets/f5bd75c6-aab1-4791-8b74-f31bc1970fd4" />

<img width="1920" height="1200" alt="Screenshot (719)" src="https://github.com/user-attachments/assets/5cd9ef53-73c8-4d0f-9bc4-8ca62d42eafa" />

--------------------------------------------------------------

### 🛍️ Products Listing

<img width="1920" height="1200" alt="Screenshot (720)" src="https://github.com/user-attachments/assets/870ee897-105f-4a94-b6c8-2f78e3dde323" />

<img width="1920" height="1200" alt="Screenshot (721)" src="https://github.com/user-attachments/assets/8f44c8cd-9223-48e9-a120-952940855656" />

--------------------------------------------------------------

### 🛒 Shopping Cart
---1: Add to Cart
<img width="1920" height="1200" alt="Screenshot (722)" src="https://github.com/user-attachments/assets/2deeffc5-3fe4-4b49-bbab-fff3468490e0" />

--- 2: Checkout (Cart Section)
<img width="1920" height="1200" alt="Screenshot (723)" src="https://github.com/user-attachments/assets/bc497119-a65b-4514-b058-f4e3a3f26c21" />

--------------------------------------------------------------

### 🔐 Authentication
--- 1: Login
<img width="1920" height="1200" alt="Screenshot (724)" src="https://github.com/user-attachments/assets/30169aa9-8b29-4b57-8418-c7e3ad3d5375" />

--- 2: Registration
<img width="1920" height="1200" alt="Screenshot (725)" src="https://github.com/user-attachments/assets/1fbf617c-698e-4226-9e43-5fdc3188e64e" />

--------------------------------------------------------------

### 🛠️ Admin – Inventory Management
--- 1: Add Gear
<img width="1920" height="1200" alt="Screenshot (728)" src="https://github.com/user-attachments/assets/ea0c92bb-f768-45f4-87e5-01bd03048d92" />

--- 2: Update Gear (If don't want to update name, leave as it is)
<img width="1920" height="1200" alt="Screenshot (729)" src="https://github.com/user-attachments/assets/77a94a8f-984c-428c-b320-7c5f2ca573f1" />

        --- Updated Gear (The Gear that I added and updated)
        <img width="1920" height="1200" alt="Screenshot (730)" src="https://github.com/user-attachments/assets/b7f56ba1-a662-4314-911b-45334e6f66cb" />

--- 3: Delete Gear
<img width="1920" height="1200" alt="Screenshot (733)" src="https://github.com/user-attachments/assets/ab1f6be8-76d9-43d6-8f61-44af51c7478b" />

--------------------------------------------------------------

### 📦 Admin – Orders Management
--- 1: Order Marked as Shipped
<img width="1920" height="1200" alt="Screenshot (737)" src="https://github.com/user-attachments/assets/76a940d7-5938-4f7c-9e80-6fa448d806ad" />

--- 2: Order Marked as Delieverd
<img width="1920" height="1200" alt="Screenshot (738)" src="https://github.com/user-attachments/assets/e68e4043-32e1-4d4b-a70b-46107d6e8789" />

--- 3: After Delievered (How it looks)
<img width="1920" height="1200" alt="Screenshot (741)" src="https://github.com/user-attachments/assets/e3eb305e-997a-4172-8523-ea25b0c60b22" />

--------------------------------------------------------------

### 🔐 Role-Based Access Control (RBAC)
SportGear implements secure role-based authorization with two system roles:

### 👤 User (Default)
--- Assigned automatically during registration
--- Cannot choose role manually
--- Can browse products
--- Manage shopping cart
--- Place orders
--- Submit contact requests

### 🛠️ Admin
--- Role granted manually through MongoDB
--- Required to access administrative features

    🔒 Users cannot select the Admin role during registration.
    All accounts are created with role = "user" by default.

This design prevents privilege escalation and reflects industry-standard security practices used in production systems.

--------------------------------------------------------------

### 🚀 Core Features
### User Functionality
--- Secure registration and login
--- JWT-based authentication
--- Product browsing and filtering
--- Dynamic shopping cart
--- Order placement
--- Contact form with automated email notifications
--- Fully responsive interface

### Admin Functionality
--- Admin-only route protection
--- Product management (CRUD)
--- Inventory control
--- View and manage customer orders

--------------------------------------------------------------

### 🧰 Technology Stack
### Frontend
--- HTML5
--- CSS3 (modular architecture)
--- JavaScript (ES6+)

### Backend
--- Node.js
--- Express.js

### Database
--- MongoDB
--- Mongoose ODM

### Security
--- JSON Web Tokens (JWT)
--- Bcrypt password hashing
--- Role-Based Access Control (RBAC)

### Email Service
--- Nodemailer

--------------------------------------------------------------

### 🎨 Frontend Architecture
SportGear follows a scalable and modular CSS structure.

All styles are managed through a single global entry file:
--- frontend/css/style.css

This file imports:
--- Base styles (reset, layout, utilities)
--- Reusable UI components
--- Layout elements (navbar, footer)
--- Page-specific styles

### Benefits
--- Clean separation of concerns
--- Single CSS import per page
--- Easier maintenance
--- Production-style organization

This approach reflects modern frontend best practices.

--------------------------------------------------------------

### 🗂️ Project Structure
SportGear/
│
├── frontend/
│   ├── assets/
│   │   └── images/
│   │
│   ├── css/
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   ├── layout.css
│   │   │   ├── responsive.css
│   │   │   └── utilities.css
│   │   │
│   │   ├── components/
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── cards.css
│   │   │   └── badges.css
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.css
│   │   │   └── footer.css
│   │   │
│   │   ├── pages/
│   │   │   ├── about.css
│   │   │   ├── cart.css
│   │   │   ├── contact.css
│   │   │   ├── inventory.css
│   │   │   ├── orders.css
│   │   │   └── profile.css
│   │   │
│   │   └── style.css   ← Global CSS entry point
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── pages/
│       ├── index.html
│       ├── products.html
│       ├── cart.html
│       ├── login.html
│       ├── register.html
│       ├── inventory.html
│       ├── admin-orders.html
│       └── contact.html
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── mailer.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── gearController.js
│   │   ├── orderController.js
│   │   └── contactController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Gear.js
│   │   ├── Order.js
│   │   └── Contact.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── gearRoutes.js
│   │   ├── orderRoutes.js
│   │   └── contactRoutes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md

--------------------------------------------------------------

### ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
         git clone https://github.com/AayushAcharya189/SportGear.git
         cd SportGear

### 2️⃣ Install Dependencies
         npm install

### 3️⃣ Environment Variables
--- Create a .env file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

⚠️ Never commit environment files to version control.

### 4️⃣ Run the Application
         npm start

--- Server runs at:
         http://localhost:3000

--------------------------------------------------------------

### 👑 Creating an Admin Account
--- Register a user normally
--- Open MongoDB Compass or Atlas
--- Locate the user document
--- Update the role field:

         {
           "role": "admin"
         }

--- Log in again to access admin features

This manual process ensures controlled administrative access.

--------------------------------------------------------------

### 🔒 Security Highlights
--- No role selection during registration
--- Password hashing with bcrypt
--- JWT verification middleware
--- Role-based route protection
--- Secure admin-only endpoints

--------------------------------------------------------------

### 📱 Responsive Design
--- Mobile-first approach

--- Optimized for:
         Desktop
         Tablet
         Mobile

--------------------------------------------------------------

### 🚧 Future Enhancements
--- Online payment integration (Stripe / PayPal)
--- User order history
--- Product reviews and ratings
--- Image upload service
--- Deployment to cloud platforms
--- Super-admin role support

--------------------------------------------------------------

### 👨‍💻 Author
--- Aayush Acharya
    Full-Stack Developer (in progress) 🇨🇦
    GitHub: https://github.com/AayushAcharya189

--------------------------------------------------------------

### ⭐ Final Notes
SportGear was built to reflect real-world engineering principles, including secure authentication, role-based authorization, and maintainable frontend architecture.

This project represents practical learning beyond tutorials and focuses on production-oriented development practices.

--------------------------------------------------------------

### 📜 License

This project is licensed under the MIT License.
