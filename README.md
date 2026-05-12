# PG Management System (PGMS) Backend

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

A robust and scalable backend for the Pay-and-Guest Management System (PGMS). This application provides a RESTful API to manage PG accommodations, room allocations, guest details, and administrative authentication.

---

## 🚀 Features

-   **Authentication**: Secure JWT-based authentication with access and refresh tokens.
-   **PG Management**: Full CRUD operations for managing multiple PG properties.
-   **Room Management**: Track room types, pricing, and availability.
-   **Media Handling**: Integrated with Cloudinary for seamless image uploads.
-   **Type Safety**: Built with TypeScript for enhanced developer experience and stability.
-   **Seeding**: Built-in scripts for initializing administrative accounts.

## 🛠️ Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js (v5.x)
-   **Language**: TypeScript
-   **Database**: MongoDB with Mongoose ODM
-   **Auth**: JSON Web Tokens (JWT) & BcryptJS
-   **Storage**: Cloudinary (via Multer)
-   **Development**: `tsx` for execution and `nodemon` for watching changes.

---

## 📁 Project Structure

```text
pg-backend/
├── config/             # Database connection and Cloudinary setup
├── controllers/        # Request handlers and business logic
├── middleware/         # Auth guards and validation middleware
├── models/             # Mongoose schemas and TypeScript types
├── routes/             # API endpoint definitions
├── scripts/            # Database seeding and utility scripts
├── types/              # Global TypeScript declarations
├── index.ts            # Entry point
└── tsconfig.json       # TypeScript configuration
```

---

## 🚦 Getting Started

### Prerequisites

-   Node.js (v18+)
-   MongoDB (Local instance or Atlas URI)
-   Cloudinary Account (for image management)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd pg-backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Copy the example environment file and fill in your credentials:
    ```bash
    cp .env.example .env
    ```

### Running the Application

-   **Development Mode** (with hot reload):
    ```bash
    npm run dev
    ```

-   **Build for Production**:
    ```bash
    npm run build
    ```

-   **Start Production Server**:
    ```bash
    npm start
    ```

-   **Seed Admin User**:
    ```bash
    npm run seed:admin
    ```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Administrative login |
| `GET` | `/api/pgs` | Get all PG properties |
| `POST` | `/api/pgs` | Create a new PG property (Auth Required) |
| `GET` | `/api/rooms` | Get room details |

> Detailed documentation for all endpoints is available in the `routes/` directory.

---

## 🛡️ Security

-   Password hashing using `bcryptjs`.
-   Protected routes via `authMiddleware`.
-   CORS enabled for secure cross-origin requests.
-   Environment variables for sensitive configuration.

---

## 📄 License

This project is licensed under the **ISC License**.
