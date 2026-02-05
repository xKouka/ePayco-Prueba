
# 💳 Simulación de Billetera Digital (Prueba ePayco)

Esta es una aplicación robusta de billetera digital con un frontend agnóstico que puede conectarse a dos implementaciones diferentes de backend: **NestJS** y **Laravel**. Ambos servidores comparten la **misma base de datos MySQL**, lo que permite una integración fluida entre tecnologías.

---

## 🚀 Requisitos Previos
- **Node.js**: v14 o superior.
- **XAMPP / Laragon**: Para el servidor **MySQL** y **Apache**.
- **PHP/Composer**: (Para el servidor Laravel).
- **Navegador**: Chrome, Firefox o Edge.

---

## 🛠️ Instalación y Configuración

### 1. Preparar la Base de Datos (MySQL)
1. Abre el **XAMPP Control Panel** e inicia **MySQL**.
2. Entra a `http://localhost/phpmyadmin` y crea una base de datos llamada `epayco_wallet`.

---

### 2. Configurar el Frontend (React)
Puedes alternar entre backends editando `client/src/config.js`.

```bash
cd client
npm install
npm run dev
```

---

### 3. Ejecutar Backend: Opción A (NestJS)
Ubicado en `/server`. Ahora usa **MySQL** (TypeORM).
```bash
cd server
npm install
npm run start:dev
```

---

### 4. Ejecutar Backend: Opción B (Laravel)
Ubicado en `/server-laravel`. Usa **MySQL** (Eloquent).
```bash
cd server-laravel
composer install
php artisan migrate
php artisan serve
```

---

## 🏗️ Puntos Técnicos

### 🗄️ Gestión de Datos Unificada
- **Base de Datos**: Ambos backends escriben y leen de la misma base de datos `epayco_wallet` en MySQL.
- **NestJS**: Implementado con **TypeORM** y el driver `mysql2`.
- **Laravel**: Implementado con **Eloquent** (ORM nativo).

### 🌐 Respuesta Estandarizada
Ambas APIs devuelven el mismo formato JSON, permitiendo que el cliente cambie de servidor en cualquier momento sin afectar la UI.
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
