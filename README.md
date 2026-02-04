
# Digital Wallet Simulation (ePayco Test)

This is a full-stack application simulating a digital wallet, built with **NestJS** (Backend) and **React** (Frontend).

## Prerequisites
- Node.js (v14+)
- MongoDB (Running on `mongodb://127.0.0.1:27017`)
- Git


## Architecture: Microservices / Hybrid
This system demonstrates knowledge of both **NestJS** and **Laravel** by splitting responsibilities:

1.  **NestJS (Main API Gateway & Transaction Core)**:
    -   Handles all Client interaction.
    -   Manages the Wallet Ledger (MongoDB).
    -   Communicates with Laravel Service for User Registration and Notification.
    -   **Resilience**: If the Laravel service is offline (e.g., PHP not installed), NestJS falls back to local simulation so the app remains functional.

2.  **Laravel (User & Notification Service)**:
    -   Located in `microservice-laravel`.
    -   Manages User Records (MySQL/SQL).
    -   Simulates Email Sending (Token Dispatch).
    -   *Note: This service requires PHP and Composer to run. Code is provided in `microservice-laravel/`.*

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd ePayco
    ```

2.  **Install NestJS Server Dependencies**:
    ```bash
    cd server
    npm install
    ```

3.  **Install React Client Dependencies**:
    ```bash
    cd ../client
    npm install
    ```

4.  **(Optional) Install Laravel Service Dependencies**:
    *Requires PHP & Composer*
    ```bash
    cd ../microservice-laravel
    composer install
    php artisan migrate
    php artisan serve
    ```

## Database Configuration
- **MongoDB**: Used by NestJS (`mongodb://127.0.0.1:27017/epayco_wallet`).
- **MySQL/SQLite**: Used by Laravel (Configure in `.env` if running Laravel).

## Running the Application

### 1. Start the NestJS Server (Backend)
From the `server` directory:
```bash
npm run start:dev
```
*The server will attempt to contact Laravel. If unreachable, it will log a warning and use local fallback logic.*

### 2. Start the React Client (Frontend)
From the `client` directory:
```bash
npm run dev
```

### 3. (Optional) Start Laravel Service
From the `microservice-laravel` directory:
```bash
php artisan serve
```


## Usage Guide

1. **Register Client**: Go to the "Register Client" tab. Enter Document ID, Name, Email, and Phone.
2. **Recharge Wallet**: Go to "Recharge Wallet". Enter Document ID, Phone, and Amount to add funds.
3. **Make Payment**:
   - Go to "Make Payment".
   - **Step 1**: Enter details and amount. Click "Request Token".
   - **Step 2**: Check the **Server Console** (terminal where `npm run start:dev` is running) to see the generated 6-digit token.
   - **Step 3**: Enter the Token in the confirmation form.
4. **Check Balance**: Go to "Check Balance" to view current funds.

## API Endpoints (Postman)

- `POST /wallet/registerCliente`
- `POST /wallet/recargarBilletera`
- `POST /wallet/solicitarPago`
- `POST /wallet/confirmarPago`
- `GET /wallet/consultarSaldo` (Params: `document`, `phone`)

## Technologies Used
- **Frontend**: React, Vite, Vanilla CSS (Premium Design)
- **Backend**: NestJS, Mongoose, Class-Validator
- **Database**: MongoDB
