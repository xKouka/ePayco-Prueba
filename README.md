
# 💳 Proyecto Billetera Digital - ePayco

Esta es una solución integral de **Billetera Digital** desarrollada como prueba técnica. Destaca por su arquitectura **híbrida y agnóstica**, permitiendo funcionar indistintamente con un backend en **Node.js (NestJS)** o **PHP (Laravel 8)**, compartiendo una base de datos unificada en **MySQL**.

---

## 🌟 Características Principales

- **Frontend React Moderno**: Interfaz dinámica, responsive y validaciones estrictas.
- **Doble Backend Híbrido**: Implementaciones completas en NestJS y Laravel.
- **Auto-Detección de Servidor**: El frontend detecta automáticamente qué servidor está encendido y se conecta a él sin configuración manual.
- **Persistencia Unificada**: Ambos backends utilizan la misma base de datos MySQL (XAMPP).
- **Validaciones Senior**: Protección contra nombres con números, emails inválidos y documentos no numéricos.
- **Estandarización de API**: Respuestas uniformes `{ status, message, data, error }`.

---

## 🚀 Guía de Inicio Rápido

### 1. Configuración de Base de Datos (MySQL)
El proyecto utiliza **XAMPP** para la persistencia.
1. Inicia el módulo **MySQL** en tu XAMPP Control Panel.
2. Accede a `http://localhost/phpmyadmin/`.
3. Crea una nueva base de datos llamada: **`epayco_wallet`**.

---

### 2. Instalación y Ejecución

#### 💻 Frontend (React + Vite)
El cliente detectará automáticamente si prendes el servidor de Nest o el de Laravel.
```bash
cd client
npm install
npm run dev
```

#### 🛡️ Opción A: Backend NestJS (Recomendado)
```bash
cd server
npm install
npm run start:dev
```
*Las tablas se crearán automáticamente al iniciar.*

#### 🐘 Opción B: Backend Laravel
```bash
cd server-laravel
composer install
php artisan migrate
php artisan serve
```

---

## 📡 Endpoints de la API

Ambos backends implementan los mismos servicios:

| Método | Ruta NestJS | Ruta Laravel | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/wallet/registroCliente` | `/api/wallet/registroCliente` | Registro de nuevos clientes |
| `POST` | `/wallet/recargarBilletera` | `/api/wallet/recargarBilletera` | Recargas de saldo |
| `POST` | `/wallet/solicitarPago` | `/api/wallet/solicitarPago` | Genera token de 6 dígitos |
| `POST` | `/wallet/confirmarPago` | `/api/wallet/confirmarPago` | Valida token y procesa pago |
| `GET` | `/wallet/consultarSaldo` | `/api/wallet/consultarSaldo` | Consulta de saldo actual |

---

## 🧪 Pruebas y Colección de Postman

Se incluye el archivo `ePayco_Wallet.postman_collection.json` en la raíz del proyecto.
1. Abre Postman e **importa** la colección.
2. Elige el backend que desees probar (NestJS puerto 3000 o Laravel puerto 8000).
3. Los **tokens de pago** se pueden visualizar en la consola/terminal de cada servidor al momento de solicitar un pago.

---

## 📂 Estructura del Proyecto

- `/client`: Frontend en React, Vite y CSS moderno.
- `/server`: Backend robusto en NestJS con TypeORM.
- `/server-laravel`: Backend potente en Laravel 8 con Eloquent.

---
*Desarrollado con excelencia para la prueba técnica de ePayco.*
