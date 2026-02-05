
# 💳 Simulación de Billetera Digital (Prueba ePayco)

Esta es una aplicación robusta de billetera digital diseñada con un frontend agnóstico que puede conectarse tanto a un servidor **NestJS** como a uno **Laravel**, siempre que implementen la misma interfaz de API REST.

---

## 🚀 Requisitos Previos
- **Node.js**: v14 o superior.
- **MongoDB**: (Requerido para el servidor NestJS) corriendo en `mongodb://127.0.0.1:27017`.
- **Navegador**: Chrome, Firefox o Edge (últimas versiones).

---

## 🛠️ Instalación y Configuración

### 1. Clonar y Preparar
```bash
git clone https://github.com/xKouka/ePayco-Prueba
cd ePayco
```

### 2. Frontend (React + Vite)
El frontend está configurado para conectar por defecto con NestJS (Puerto 3000). Para cambiar a Laravel (Puerto 8000), edita `client/src/config.js`.

```bash
cd client
npm install
npm run dev
```

### 3. Backend (Opción: NestJS)
Si decides usar el servidor de NestJS:
```bash
cd server
npm install
npm run start:dev
```

---

## 🏗️ Puntos Técnicos Clave

### 🗄️ Acceso a Datos
- **Arquitectura Standalone**: Tanto NestJS como Laravel operan como backends independientes.
- **NestJS**: Utiliza **Mongoose** para interactuar con MongoDB.
- **Laravel**: Utilizaría Eloquent con la base de datos de tu elección (MySQL/SQLite).

### 🌐 Respuesta Uniforme (API Standards)
Todas las respuestas siguen el formato:
```json
{
  "status": 200,          
  "message": "...", 
  "data": { ... },        
  "error": null           
}
```

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/registroCliente` | Registra un nuevo cliente. |
| `POST` | `/recargarBilletera` | Recarga saldo. |
| `POST` | `/solicitarPago` | Genera token de pago. |
| `POST` | `/confirmarPago` | Confirma el pago con token. |
| `GET` | `/consultarSaldo` | Obtiene el saldo (query params: `document`, `phone`). |

*Nota: En el servidor NestJS los endpoints están bajo el prefijo `/wallet/`.*

---

## 🧪 Pruebas con Postman
Importa `ePayco_Wallet.postman_collection.json` y ajusta la variable `base_url` según el servidor que estés usando.

---
*Entregable para la prueba técnica de ePayco.*
