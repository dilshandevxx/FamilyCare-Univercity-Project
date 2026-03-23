# 🏥 FamilyCare

A full-stack web application that helps Sri Lankan children abroad manage the care of their elderly parents.

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, React Router  |
| Backend   | Node.js, Express.js           |
| Database  | MySQL                         |
| Auth      | JWT (JSON Web Tokens)         |

## Team Members

| Member | Area of Responsibility |
|--------|----------------------|
| Member 1 | Backend – API, Database, Auth |
| Member 2 | Frontend – UI Components, Pages |
| Member 3 | Frontend – State, Services, Integration |

## Project Structure

```
01-familyCare/
├── backend/          # Express + Node.js + MySQL API
│   ├── src/
│   │   ├── config/       # DB connection config
│   │   ├── controllers/  # Route handler logic
│   │   ├── middleware/   # Auth & error middleware
│   │   ├── models/       # MySQL data model helpers
│   │   ├── routes/       # API route definitions
│   │   └── database/     # SQL schema & seed files
│   ├── .env.example
│   └── package.json
├── frontend/         # React + Vite app
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── pages/        # Page-level components
│   │   ├── context/      # Global state (AuthContext etc.)
│   │   ├── services/     # Axios API call helpers
│   │   └── utils/        # Helpers & constants
│   ├── .env.example
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MySQL >= 8.0

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your DB credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Database Setup
```bash
mysql -u root -p < backend/src/database/schema.sql
```

## API Overview

| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| POST   | /api/auth/register           | Register a new user      |
| POST   | /api/auth/login              | Login & receive JWT      |
| GET    | /api/users/profile           | Get logged-in user info  |
| GET    | /api/caregivers              | List all caregivers      |
| GET    | /api/caregivers/:id          | Get caregiver details    |
| GET    | /api/health                  | Health logs for a parent |
| POST   | /api/health                  | Add a new health log     |
| GET    | /api/appointments            | List appointments        |
| POST   | /api/appointments            | Book an appointment      |
