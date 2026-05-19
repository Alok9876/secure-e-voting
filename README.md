# 🗳️ Secure E-Voting System — Backend API

A RESTful API built with **Node.js + Express + MongoDB** powering the Secure E-Voting System.

---

## ⚙️ Tech Stack

| Technology          | Purpose                              |
|---------------------|--------------------------------------|
| Node.js v18+        | JavaScript runtime                   |
| Express.js v4       | REST API framework                   |
| MongoDB + Mongoose  | Database + ODM                       |
| bcryptjs            | Password & OTP hashing               |
| jsonwebtoken (JWT)  | Stateless authentication             |
| nodemailer          | Email OTP delivery                   |
| express-rate-limit  | Brute-force protection               |
| dotenv              | Environment configuration            |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# → Edit .env with your MongoDB URI, JWT secret, email credentials

# 3. Seed the database (creates admin + sample data)
npm run seed

# 4. Start the server
npm run dev        # development (auto-restart)
npm start          # production
```

Server runs at: **http://localhost:5000**

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection + admin auto-seed
├── controllers/
│   ├── authController.js      # register, login, OTP send/verify
│   ├── electionController.js  # list & view elections (voter)
│   ├── voteController.js      # cast vote, verify receipt, history
│   ├── adminController.js     # admin CRUD for elections/candidates/voters
│   └── resultController.js    # public election results
├── middleware/
│   ├── auth.js                # JWT protect + requireApproved
│   └── admin.js               # adminOnly guard
├── models/
│   ├── Voter.js               # User schema (voter + admin)
│   ├── Election.js            # Election schema
│   ├── Candidate.js           # Candidate schema
│   └── Vote.js                # Vote schema (encrypted, receipt)
├── routes/
│   ├── auth.js
│   ├── elections.js
│   ├── votes.js
│   ├── admin.js
│   └── results.js
├── seed.js                    # Database seeder
├── server.js                  # App entry point
├── .env.example               # Environment template
├── DATABASE.md                # Full DB documentation
└── package.json
```

---

## 🔑 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/secure_evoting
JWT_SECRET=your_long_random_secret
PORT=5000
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@evoting.com
ADMIN_PASSWORD=Admin@123
```

---

## 📡 Complete API Reference

### Base URL: `http://localhost:5000/api`

---

### 🔐 Auth Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new voter.

**Request body:**
```json
{
  "name":        "Rahul Kumar",
  "email":       "rahul@example.com",
  "password":    "Voter@123",
  "aadhaarNo":   "1234-5678-9000",
  "dateOfBirth": "2000-03-12",
  "phone":       "9811000001",
  "constituency":"North Delhi"
}
```
**Response:**
```json
{ "success": true, "message": "Registration successful!", "voterId": "64abc..." }
```

---

#### POST `/api/auth/send-otp`
Send OTP to voter's email for verification.

**Request body:**
```json
{ "email": "rahul@example.com" }
```

---

#### POST `/api/auth/verify-otp`
Verify the OTP received by email.

**Request body:**
```json
{ "email": "rahul@example.com", "otp": "482910" }
```

---

#### POST `/api/auth/login`
Login and receive JWT token.

**Request body:**
```json
{ "email": "rahul@example.com", "password": "Voter@123" }
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "voter": { "_id": "...", "name": "Rahul Kumar", "role": "voter", ... }
}
```

---

#### GET `/api/auth/me`
Get current logged-in user profile.  
**Auth:** `Bearer <token>`

---

### 🗳️ Election Routes (`/api/elections`)
All require `Bearer <token>` + approved voter.

#### GET `/api/elections`
List all active & upcoming elections (with `hasVoted` flag per election).

#### GET `/api/elections/:id`
Get full details of a single election including candidates.

---

### ✅ Vote Routes (`/api/votes`)
All require `Bearer <token>` + approved voter.

#### POST `/api/votes/cast`
Cast a vote.

**Request body:**
```json
{ "electionId": "64abc...", "candidateId": "64def..." }
```
**Response:**
```json
{
  "success": true,
  "message": "Vote cast successfully!",
  "receipt": {
    "receiptHash": "a3f8c2...",
    "electionTitle": "Student Council Election",
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

---

#### GET `/api/votes/verify/:receiptHash`
Verify a vote receipt (public audit). Does NOT reveal voter identity or candidate choice.

#### GET `/api/votes/my-history`
Get current voter's voting history.

---

### 📊 Results Routes (`/api/results`)
Public — no auth required.

#### GET `/api/results`
List all closed elections.

#### GET `/api/results/:electionId`
Get detailed results for a closed election.

**Response:**
```json
{
  "success": true,
  "election": { "title": "...", "totalVotesCast": 400 },
  "winner": { "name": "Arjun Mehta", "party": "...", "votes": 145, "percentage": "36.25" },
  "results": [
    { "name": "Arjun Mehta", "votes": 145, "percentage": "36.25" },
    { "name": "Divya Nair",  "votes": 112, "percentage": "28.00" }
  ]
}
```

---

### ⚙️ Admin Routes (`/api/admin`)
All require `Bearer <admin_token>`.

#### GET `/api/admin/stats`
Dashboard statistics.

#### GET `/api/admin/elections`
All elections with full candidate lists.

#### POST `/api/admin/elections`
Create a new election.
```json
{
  "title":        "Department Election 2025",
  "description":  "Annual department rep election",
  "constituency": "CSE Department",
  "startDate":    "2025-02-01T09:00:00",
  "endDate":      "2025-02-01T17:00:00"
}
```

#### PUT `/api/admin/elections/:id/status`
Manually change election status.
```json
{ "status": "active" }
```

#### DELETE `/api/admin/elections/:id`
Delete a non-active election (also deletes its candidates and votes).

#### POST `/api/admin/candidates`
Add a candidate to an election.
```json
{
  "electionId": "64abc...",
  "name":       "Arjun Mehta",
  "party":      "Progressive Alliance",
  "symbol":     "⭐",
  "manifesto":  "Better hostel facilities and 24/7 library access."
}
```

#### DELETE `/api/admin/candidates/:id`
Remove a candidate from an election.

#### GET `/api/admin/voters`
List all registered voters with approval status.

#### PUT `/api/admin/voters/:id/approve`
Approve a voter account.

---

## 🛡️ Security Architecture

```
Request
  │
  ├── NGINX rate limiting (100 req/15 min per IP)
  │
  ├── CORS whitelist (frontend URL only)
  │
  ├── JWT middleware (RS256, 24h expiry)
  │
  ├── Role guard (voter / admin)
  │
  ├── Input validation (express-validator)
  │
  ├── Business logic (controller)
  │
  └── MongoDB (bcrypt passwords, hashed OTPs, encrypted vote data)
```

**Vote Security:**
- Passwords: `bcrypt` (12 rounds) — irreversible
- OTPs: `bcrypt` hashed before storage — cannot be read from DB
- Vote choice: `SHA-256(candidateId + voterId + salt)` — irreversible
- Double-vote prevention: Compound unique index in MongoDB

---

## 🌱 Database Seeding

```bash
npm run seed
```

Creates:
- 1 Admin account
- 7 sample voters (5 approved, 1 pending, 1 unverified)
- 3 elections (1 closed with 400 votes, 1 active, 1 upcoming)
- 9 candidates across all elections

**Test credentials:**
```
Admin  → admin@evoting.com  / Admin@123
Voter  → rahul@example.com  / Voter@123
Voter  → priya@example.com  / Voter@123
```

---

## 🧪 Testing the API (with curl)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test@123","aadhaarNo":"9999-8888-7777","dateOfBirth":"2000-01-01","phone":"9999999999"}'

# Login (after OTP verification + admin approval)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@example.com","password":"Voter@123"}'

# Cast vote (replace TOKEN and IDs)
curl -X POST http://localhost:5000/api/votes/cast \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"electionId":"ELECTION_ID","candidateId":"CANDIDATE_ID"}'

# Get results (public)
curl http://localhost:5000/api/results/ELECTION_ID
```

---

## 👨‍💻 Team

| Name              | Roll No.     |
|-------------------|--------------|
| Rahul Kumar Verma | 21CSXXXXX01  |
| Priya Sharma      | 21CSXXXXX02  |
| Ankit Singh       | 21CSXXXXX03  |
| Neha Gupta        | 21CSXXXXX04  |

**Supervisor:** Dr./Prof. _______________  
**Session:** 2024–2025
