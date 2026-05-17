# Secure E-Voting

Monorepo containing the backend and frontend for the Secure E-Voting project.

Structure
- `backend/` — Express + Mongoose API
- `secure-evoting/` — full-stack example (backend + frontend)

Quick start (backend)

1. Copy `.env` values into `backend/.env` (or use `secure-evoting/backend/.env.example`).
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server:

```bash
npm start
```

Quick start (frontend)

1. Install dependencies:

```bash
cd secure-evoting/frontend
npm install
```

2. Start the frontend:

```bash
npm start
```

Notes
- `backend/.env` may contain sensitive values — do NOT commit secrets.
- If you run into MongoDB SRV resolution issues, see `backend/server.js` where DNS override was added as a workaround.
