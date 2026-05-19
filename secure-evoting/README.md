# 🗳️ Secure E-Voting System

A full-stack secure electronic voting web application built with **React.js**, **Node.js**, **Express**, and **MongoDB**.

## 📌 Features

- 🔐 Voter Registration with Aadhaar & Email verification
- 🔑 JWT-based Authentication with OTP login
- 🗳️ Secure Vote Casting (one vote per election per voter)
- 📊 Real-time Election Results with Charts
- 🛡️ Admin Dashboard (create elections, add candidates, manage voters)
- 🔒 Vote Encryption using SHA-256
- 📜 Full Audit Trail

## 🧰 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Axios, Chart.js, Bootstrap 5 |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (Mongoose ODM)            |
| Auth       | JWT (JSON Web Tokens), bcrypt     |
| OTP        | Nodemailer (Email OTP)            |
| Encryption | crypto (SHA-256, AES-256)         |

## 📁 Project Structure

```
secure-evoting/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & Admin guards
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── .env.example     # Environment variables template
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       ├── utils/       # Axios config
│       ├── App.js
│       └── index.js
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/secure-evoting.git
cd secure-evoting
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (MongoDB URI, JWT Secret, Email credentials)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔑 Default Admin Credentials
```
Email:    admin@evoting.com
Password: Admin@123
```
*(Change immediately after first login)*

## 📡 API Endpoints

| Method | Endpoint                        | Description              | Auth      |
|--------|---------------------------------|--------------------------|-----------|
| POST   | /api/auth/register              | Register new voter       | No        |
| POST   | /api/auth/login                 | Login + get JWT          | No        |
| POST   | /api/auth/send-otp              | Send OTP to email        | No        |
| POST   | /api/auth/verify-otp            | Verify OTP               | No        |
| GET    | /api/elections                  | List active elections    | JWT       |
| GET    | /api/elections/:id              | Election details         | JWT       |
| POST   | /api/votes/cast                 | Cast a vote              | JWT       |
| GET    | /api/votes/verify/:id           | Verify vote receipt      | JWT       |
| GET    | /api/results/:electionId        | Get election results     | No        |
| POST   | /api/admin/elections            | Create election          | Admin JWT |
| POST   | /api/admin/candidates           | Add candidate            | Admin JWT |
| GET    | /api/admin/voters               | List all voters          | Admin JWT |
| PUT    | /api/admin/elections/:id/status | Open/close election      | Admin JWT |

## 🛡️ Security Features

- Passwords hashed with **bcrypt** (salt rounds: 12)
- JWT tokens expire in **24 hours**
- OTP expires in **10 minutes**
- One vote per voter per election (enforced in DB + backend)
- Input validation on all endpoints
- CORS configured for frontend origin only
- Rate limiting on auth endpoints (100 req/15min)
- Vote receipts with SHA-256 hash for audit

## 📸 Screenshots
> Add screenshots of: Home Page, Registration, Login, Dashboard, Voting Page, Results

## 👩‍💻 Developed By
- Rahul Kumar Verma  — 21CSXXXXX01
- Priya Sharma       — 21CSXXXXX02
- Ankit Singh        — 21CSXXXXX03
- Neha Gupta         — 21CSXXXXX04

**Supervisor:** Dr./Prof. _______________  
**Department:** Computer Science & Engineering  
**Session:** 2024–2025

## 📄 License
This project is developed for academic purposes.
