
# Digital Wallet Simulation (ePayco Test)

This is a full-stack application simulating a digital wallet, built with **NestJS** (Backend) and **React** (Frontend).

## Prerequisites
- Node.js (v14+)
- MongoDB (Running on `mongodb://127.0.0.1:27017`)
- Git

## Installation

1. **Clone the repository** (if not already):
   ```bash
   git clone <repo-url>
   cd ePayco
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

## Database Configuration
The application uses **MongoDB**. Ensure you have a MongoDB instance running locally on the default port `27017`.
The connection string is hardcoded in `server/src/app.module.ts`: `mongodb://127.0.0.1:27017/epayco_wallet`.

## Running the Application

### backend (API)
From the `server` directory:
```bash
npm run start:dev
```
The API will run on `http://localhost:3000`.

### frontend (Client)
From the `client` directory:
```bash
npm run dev
```
The application will run on `http://localhost:5173` (or similar).

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
