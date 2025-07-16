HRMS built from refactored MVP
# HRMS-02
Human Resource Management System (MERN Stack)

## Project Structure

```
HRMS-02/
├── client/   # React (Vite) frontend
├── server/   # Node.js/Express backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB

### Setup

#### 1. Clone the repository
```sh
git clone <repo-url>
cd HRMS-02
```

#### 2. Setup Server
```sh
cd server
cp .env.example .env # Edit with your MongoDB URI and JWT secret
npm install
npm run dev
```

#### 3. Setup Client
```sh
cd client
cp .env.example .env # Edit if needed
npm install
npm run dev
```

### Scripts

- `client`: `npm run dev`, `npm run build`, `npm start`
- `server`: `npm run dev`, `npm start`

## Features
- User registration & login (JWT auth)
- MongoDB integration
- Basic project structure for HRMS features

---
Feel free to extend this project for your HRMS needs!
