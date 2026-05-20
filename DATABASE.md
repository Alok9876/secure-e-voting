# 🗄️ Database Documentation — Secure E-Voting System

## Overview

The system uses **MongoDB** (NoSQL) with **Mongoose** as the ODM (Object-Document Mapper).  
All sensitive vote data is cryptographically protected before storage.

---

## Collections

### 1. `voters` — Stores all registered users (voters + admin)

| Field           | Type      | Required | Description                                      |
|-----------------|-----------|----------|--------------------------------------------------|
| `_id`           | ObjectId  | Auto     | MongoDB auto-generated unique ID                 |
| `name`          | String    | ✅       | Full name of the voter                           |
| `email`         | String    | ✅       | Unique email address (used for login + OTP)      |
| `password`      | String    | ✅       | bcrypt-hashed password (12 salt rounds)          |
| `aadhaarNo`     | String    | ✅       | Unique Aadhaar number (masked in UI)             |
| `dateOfBirth`   | Date      | ✅       | Used for age verification                        |
| `phone`         | String    | ✅       | Mobile number for notifications                  |
| `constituency`  | String    | —        | Voter's constituency (default: "General")        |
| `role`          | String    | —        | `"voter"` or `"admin"` (default: "voter")        |
| `isVerified`    | Boolean   | —        | `true` after email OTP verification              |
| `isApproved`    | Boolean   | —        | `true` after admin approval                      |
| `otp`           | String    | —        | bcrypt-hashed current OTP (cleared after use)    |
| `otpExpiry`     | Date      | —        | OTP expiry timestamp (10 minutes from send)      |
| `votedElections`| [ObjectId]| —        | Array of Election IDs voter has voted in         |
| `createdAt`     | Date      | Auto     | Registration timestamp                           |
| `updatedAt`     | Date      | Auto     | Last update timestamp                            |

**Indexes:** `email` (unique), `aadhaarNo` (unique)

---

### 2. `elections` — Stores election configurations

| Field           | Type      | Required | Description                                      |
|-----------------|-----------|----------|--------------------------------------------------|
| `_id`           | ObjectId  | Auto     | Unique election ID                               |
| `title`         | String    | ✅       | Election title                                   |
| `description`   | String    | —        | Detailed description of the election             |
| `constituency`  | String    | —        | Target constituency (default: "General")         |
| `startDate`     | Date      | ✅       | Election start date/time                         |
| `endDate`       | Date      | ✅       | Election end date/time                           |
| `status`        | String    | —        | `"upcoming"` / `"active"` / `"closed"`           |
| `candidates`    | [ObjectId]| —        | Array of Candidate IDs in this election          |
| `totalVotesCast`| Number    | —        | Running count of votes (incremented on each vote)|
| `createdBy`     | ObjectId  | —        | Admin voter ID who created the election          |
| `createdAt`     | Date      | Auto     | Creation timestamp                               |

---

### 3. `candidates` — Stores candidates for elections

| Field       | Type     | Required | Description                                         |
|-------------|----------|----------|-----------------------------------------------------|
| `_id`       | ObjectId | Auto     | Unique candidate ID                                 |
| `name`      | String   | ✅       | Candidate's full name                               |
| `party`     | String   | ✅       | Political / student party name                      |
| `symbol`    | String   | —        | Election symbol emoji (e.g., ⭐, 🌹)               |
| `manifesto` | String   | —        | Candidate's manifesto or bio                        |
| `election`  | ObjectId | ✅       | Reference to parent Election                        |
| `voteCount` | Number   | —        | Vote count (only updated after election closes)     |
| `createdAt` | Date     | Auto     | Creation timestamp                                  |

---

### 4. `votes` — Stores cast votes (privacy-preserving)

| Field                | Type     | Required | Description                                      |
|----------------------|----------|----------|--------------------------------------------------|
| `_id`                | ObjectId | Auto     | Unique vote record ID                            |
| `voter`              | ObjectId | ✅       | Reference to the Voter who cast this vote        |
| `election`           | ObjectId | ✅       | Reference to the Election                        |
| `encryptedCandidate` | String   | ✅       | SHA-256 hash of `candidateId + voterId + salt`   |
| `receiptHash`        | String   | ✅       | Public SHA-256 receipt hash (unique, for audit)  |
| `timestamp`          | Date     | —        | Exact time vote was cast                         |
| `createdAt`          | Date     | Auto     | Creation timestamp                               |

**Compound Unique Index:** `{ voter, election }` — enforces one vote per voter per election at the database level.

> ⚠️ **Privacy Note:** The `encryptedCandidate` field does NOT reveal who the voter voted for.  
> It is a salted hash that cannot be reverse-engineered to reveal the candidate choice.

---

## Entity Relationship Diagram (ERD)

```
VOTER (voters)
  │  _id, name, email, password(bcrypt), aadhaarNo
  │  isVerified, isApproved, role, votedElections[]
  │
  ├──[creates]──► ELECTION (elections)
  │                 _id, title, status, startDate, endDate
  │                 constituency, candidates[], totalVotesCast
  │
  ├──[casts]───► VOTE (votes)
  │                 _id, voter(→Voter), election(→Election)
  │                 encryptedCandidate, receiptHash
  │
  └──[runs in]─► CANDIDATE (candidates)
                    _id, name, party, symbol, manifesto
                    election(→Election), voteCount
```

---

## Security Design Decisions

### Why is the vote NOT stored as a candidate reference?
Storing `candidateId` directly would allow a database administrator to read who voted for whom.  
Instead, we store `SHA-256(candidateId + voterId + randomSalt)` — an irreversible hash.  
The actual tally is maintained via `Candidate.voteCount` which is incremented atomically.

### Why is `votedElections` on the Voter model?
This gives O(1) lookup to check if a voter has voted, without scanning the entire votes collection.

### How is double-voting prevented?
Three layers:
1. `Voter.votedElections` — checked before allowing vote
2. `Vote` model compound unique index `{ voter, election }` — MongoDB rejects duplicate
3. Controller checks `Vote.findOne({ voter, election })` before insert

### Why is `password` bcrypt-hashed with 12 rounds?
bcrypt with 12 salt rounds takes ~250ms per hash — fast enough for UX, too slow for brute-force at scale.

### Why is `otp` also bcrypt-hashed?
Even if the database is compromised, the attacker cannot read active OTPs to bypass 2FA.

---

## Setup Instructions

### Option A — Local MongoDB

```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod --dbpath /data/db

# Set in .env
MONGO_URI=mongodb://localhost:27017/secure_evoting
```

### Option B — MongoDB Atlas (Cloud, Recommended)

1. Go to https://cloud.mongodb.com → Create free cluster
2. Create a database user with read/write access
3. Whitelist your IP (or 0.0.0.0/0 for development)
4. Click "Connect" → "Connect your application" → copy the URI
5. Set in `.env`:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/secure_evoting?retryWrites=true&w=majority
```

### Seed the Database

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI in .env

node seed.js
```

**Expected output:**
```
✅ MongoDB Connected
✅ Admin created  → admin@evoting.com / Admin@123
✅ 7 voters seeded
✅ 3 elections created (1 closed, 1 active, 1 upcoming)
✅ 9 candidates added
✅ 400 sample votes recorded
```

---

## Useful MongoDB Queries (for reference/viva)

```javascript
// Count total votes per candidate in an election
db.candidates.find({ election: ObjectId("...") }, { name: 1, voteCount: 1 })

// Find all pending voters
db.voters.find({ role: "voter", isApproved: false })

// Check if a voter has voted in an election
db.votes.findOne({ voter: ObjectId("..."), election: ObjectId("...") })

// Get all active elections
db.elections.find({ status: "active" })

// Count total votes cast today
db.votes.countDocuments({
  timestamp: { $gte: new Date(new Date().setHours(0,0,0,0)) }
})

// Get top candidate in an election
db.candidates.find({ election: ObjectId("...") }).sort({ voteCount: -1 }).limit(1)
```

---

## Indexes Summary

| Collection   | Field(s)               | Type     | Purpose                              |
|--------------|------------------------|----------|--------------------------------------|
| voters       | email                  | Unique   | Prevent duplicate registration       |
| voters       | aadhaarNo              | Unique   | Prevent identity fraud               |
| votes        | { voter, election }    | Compound Unique | Prevent double voting         |
| votes        | receiptHash            | Unique   | Fast receipt lookup for audit        |
| elections    | status                 | Regular  | Fast filtering by status             |
| candidates   | election               | Regular  | Fast candidate lookup per election   |
