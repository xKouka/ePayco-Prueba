
# 💳 Simulación de Billetera Digital (Prueba ePayco)

Esta es una aplicación robusta de billetera digital con un frontend agnóstico que puede conectarse a dos implementaciones diferentes de backend: **NestJS** y **Laravel**. Cada servidor es independiente y puede ser utilizado según la preferencia del desarrollador.

---

## 🚀 Requisitos Previos
- **Node.js**: v14 o superior.
- **MongoDB**: (Para NestJS) corriendo en `mongodb://127.0.0.1:27017`.
- **PHP/Composer**: (Para Laravel) junto con MySQL o SQLite.
- **Navegador**: Chrome, Firefox o Edge.

---

## 🛠️ Instalación y Configuración

### 1. Preparar el Proyecto
```bash
git clone https://github.com/xKouka/ePayco-Prueba
cd ePayco
```

### 2. Configurar el Frontend (React)
El frontend puede conectarse a cualquiera de los dos servidores editando el archivo `client/src/config.js`.

```bash
cd client
npm install
npm run dev
```

### 3. Ejecutar Backend: Opción A (NestJS)
Ubicado en `/server`. Usa MongoDB.
```bash
cd server
npm install
npm run start:dev
```

### 4. Ejecutar Backend: Opción B (Laravel)
Ubicado en `/server-laravel`. Usa SQL.
```bash
cd server-laravel
# Configura tu .env (DB_DATABASE, etc)
composer install
php artisan migrate
php artisan serve
```

---

## 🏗️ Puntos Técnicos

### 🗄️ Gestión de Datos
- **NestJS**: Backend moderno usando TypeORM/Mongoose con MongoDB.
- **Laravel**: Backend clásico y potente usando Eloquent con MySQL/SQLite.

### 🌐 Respuesta Estandarizada
Ambos servidores devuelven el mismo formato de JSON, lo que permite al frontend cambiar de uno a otro sin tocar ni una línea de código de los componentes:
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
