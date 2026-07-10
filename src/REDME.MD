# Pay-Nest Backend

A RESTful API backend for **Pay-Nest**, a digital wallet / payment application. It handles user authentication, wallet management, peer-to-peer money transfers, bill payments, and transaction history.

Built with **Node.js**, **Express 5**, **MongoDB (Mongoose)**, and **JWT** based authentication.

---

## Features

- **User authentication** — Signup and login with hashed passwords (bcryptjs) and JWT tokens.
- **Auto-generated UPI ID** — Each user gets a `name@paynest` style UPI ID on signup.
- **MPIN security** — Users set a 4-digit MPIN used to authorize wallet actions.
- **Wallet operations** — Add money to wallet and pay bills.
- **P2P transfers** — Send money to another user by phone number (protected by MPIN).
- **Transaction history** — View all incoming and outgoing transactions.
- **API documentation** — Interactive Swagger UI at `/api-docs`.

---

## Tech Stack

| Category      | Technology                          |
| ------------- | ----------------------------------- |
| Runtime       | Node.js (ES Modules)                |
| Framework     | Express 5                           |
| Database      | MongoDB + Mongoose 9               |
| Auth          | JSON Web Token (jsonwebtoken)       |
| Password Hash | bcryptjs                            |
| Docs          | swagger-ui-express, swagger-autogen |
| Env Config    | dotenv                              |
| CORS          | cors                               |

---

## Project Structure

```
Pay-Nest Backend/
├── server.js                  # App entry point, middleware, routes, Swagger
├── swagger.json               # Generated Swagger spec
├── package.json
└── src/
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── middleware/
    │   └── authMiddleware.js  # JWT protect middleware
    ├── model/
    │   ├── user.model.js      # User schema
    │   └── transation.model.js# Transaction schema
    ├── controllers/
    │   ├── user.controller.js
    │   ├── wallet.controller.js
    │   └── transaction.controller.js
    └── routes/
        ├── user.route.js
        ├── wallet.route.js
        └── transaction.route.js
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or MongoDB Atlas)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/paynest
JWT_SECRET=your_super_secret_jwt_key
```

> Replace `MONGO_URI` with your own MongoDB connection string and set a strong `JWT_SECRET`.

3. Start the server:

```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

The server will start on `http://localhost:5000` (or the configured `PORT`).

### API Documentation

Interactive Swagger docs are available at:

```
http://localhost:5000/api-docs
```

---

## Environment Variables

| Variable    | Description                                  |
| ----------- | -------------------------------------------- |
| `PORT`      | Port the server listens on (default `5000`)  |
| `MONGO_URI` | MongoDB connection string                    |
| `JWT_SECRET`| Secret key used to sign JWT tokens           |

---

## API Reference

All protected routes require the header:

```
Authorization: Bearer <token>
```

### Auth (`/api/auth`)

| Method | Endpoint       | Auth | Body                              | Description                  |
| ------ | -------------- | ---- | --------------------------------- | ---------------------------- |
| POST   | `/signup`      | No   | `name, email, password, phone`    | Register a new user          |
| POST   | `/login`       | No   | `email, password`                 | Login and receive JWT        |
| POST   | `/set-mpin`    | Yes  | `mpin` (4-digit)                  | Set / update user MPIN       |
| GET    | `/profile`     | Yes  | —                                 | Get current user profile     |

### Wallet (`/api/wallet`)

| Method | Endpoint      | Auth | Body                          | Description              |
| ------ | ------------- | ---- | ----------------------------- | ------------------------ |
| POST   | `/add-money`  | Yes  | `amount, mpin`                | Add money to wallet      |
| POST   | `/pay-bills`  | Yes  | `billerName, amount, mpin`    | Pay a bill               |

### Transactions (`/api/transaction`)

| Method | Endpoint    | Auth | Body                          | Description                       |
| ------ | ----------- | ---- | ----------------------------- | --------------------------------- |
| POST   | `/send`     | Yes  | `phone, amount, mpin`         | Send money to another user        |
| GET    | `/history`  | Yes  | —                             | Get sender & receiver transactions|

---

## Data Models

### User

| Field    | Type     | Notes                                  |
| -------- | -------- | -------------------------------------- |
| name     | String   | Required                               |
| email    | String   | Required, unique, validated            |
| phone    | String   | Required, unique                       |
| password | String   | Hashed (bcrypt)                        |
| upiId    | String   | Auto-generated, unique                 |
| balance  | Number   | Default `0`                           |
| mpin     | String   | Hashed 4-digit MPIN                    |

### Transaction

| Field      | Type     | Notes                                          |
| ---------- | -------- | ---------------------------------------------- |
| senderId   | ObjectId | Ref `User`, required                           |
| receiverId | ObjectId | Ref `User`                                     |
| amount     | Number   | Required                                       |
| billerName | String   | Required                                       |
| types      | String   | `TRANSFER` \| `ADD_MONEY` \| `BILL_PAYMENT` \| `WITHDRAW` |
| status     | String   | `PENDING` \| `SUCCESS` \| `FAILED` (default `PENDING`)     |

---

## Authentication Flow

1. Call `POST /api/auth/signup` to create an account (a UPI ID is auto-generated).
2. Call `POST /api/auth/login` to receive a JWT token.
3. Call `POST /api/auth/set-mpin` to set a 4-digit MPIN for securing wallet actions.
4. Include the token in the `Authorization` header for all protected routes.
5. Use the MPIN to authorize wallet operations (`add-money`, `pay-bills`, `send`).

---

## Available Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm start`     | Run the server (`node index.js`)     |
| `npm run dev`   | Run with nodemon (`nodemon index.js`)|

---

## License

ISC — Author: Sahil Khola
