# Endpoints de la API (REST) - Fase 1 (MVP)

A continuación, se define la estructura de las rutas necesarias para que el Frontend consuma los módulos de Eventos y Cuentas por Cobrar. Todas las rutas asumirán que existe un middleware de autenticación que inyecta el `organizationId` a partir del token del usuario (ej. JWT).

## Módulo 1: Eventos y Presupuestos

### 1. Crear un Evento
* **Ruta:** `POST /api/events`
* **Descripción:** Crea un evento con metas de recaudación, capacidad y estructura de costos inicial.
* **Payload (Body):**
  ```json
  {
    "name": "Campamento de Verano 2024",
    "startDate": "2024-07-15T00:00:00Z",
    "endDate": "2024-07-20T00:00:00Z",
    "totalCapacity": 150,
    "fundraisingGoal": 5000.00,
    "costStructures": [
      { "name": "Costo Base", "amount": 100.00, "isRequired": true },
      { "name": "Transporte", "amount": 25.00, "isRequired": true }
    ]
  }
  ```
* **Respuesta (201 Created):**
  ```json
  {
    "id": "event-uuid",
    "name": "Campamento de Verano 2024",
    "totalCapacity": 150,
    "fundraisingGoal": 5000.00,
    "costStructures": [...]
  }
  ```

### 2. Obtener Lista de Eventos
* **Ruta:** `GET /api/events`
* **Respuesta (200 OK):** Arreglo de eventos de la organización.

### 3. Inscribir Participante en Evento
* **Ruta:** `POST /api/events/:eventId/enrollments`
* **Descripción:** Asocia un usuario a un evento definiendo su rol y esquema de pago.
* **Payload (Body):**
  ```json
  {
    "userId": "user-uuid",
    "role": "ATTENDEE", // o "STAFF"
    "tariffType": "FULL_PAYMENT" // o "HALF_SCHOLARSHIP", "FULLY_SPONSORED"
  }
  ```
* **Respuesta (201 Created):**
  ```json
  {
    "id": "enrollment-uuid",
    "eventId": "event-uuid",
    "userId": "user-uuid",
    "role": "ATTENDEE",
    "tariffType": "FULL_PAYMENT",
    "totalCost": 125.00,
    "totalPaid": 0.00,
    "status": "PENDING"
  }
  ```

### 4. Obtener Estado de Cuenta del Participante
* **Ruta:** `GET /api/enrollments/:enrollmentId`
* **Respuesta (200 OK):**
  ```json
  {
    "enrollment": { ... },
    "transactions": [ ... ] // Historial de pagos
  }
  ```

## Módulo 2: Cuentas por Cobrar (Ingresos y Abonos)

### 5. Registrar un Abono Directo (Pago de un Inscrito)
* **Ruta:** `POST /api/enrollments/:enrollmentId/transactions`
* **Descripción:** Registra un pago hecho por un usuario inscrito.
* **Payload (Body):**
  ```json
  {
    "amountOriginal": 50.00,
    "currencyOriginal": "EUR",
    "exchangeRate": 1.08, // Tasa usada ese día para convertir a USD (ejemplo moneda base)
    "paymentMethod": "Transferencia",
    "date": "2024-05-10T10:00:00Z"
  }
  ```
* **Respuesta (201 Created):**
  ```json
  {
    "transactionId": "tx-uuid",
    "receiptNumber": "receipt-uuid",
    "amountBase": 54.00, // 50 * 1.08
    "enrollmentStatusUpdated": "PARTIAL"
  }
  ```

### 6. Recibir Donación (Ingreso a la Bolsa de Patrocinios)
* **Ruta:** `POST /api/sponsorships`
* **Descripción:** Ingresa dinero no asignado a la "Bolsa". Puede ser para un evento o global.
* **Payload (Body):**
  ```json
  {
    "eventId": "event-uuid", // Null si es global
    "donorName": "Donante Anónimo",
    "amountOriginal": 1000.00,
    "currencyOriginal": "USD",
    "exchangeRate": 1.0,
    "paymentMethod": "Efectivo"
  }
  ```
* **Respuesta (201 Created):** Datos de la transacción tipo "DONATION" y actualización del `SponsorshipWallet`.

### 7. Asignar Dinero de la Bolsa a un Deudor (Motor de Patrocinios)
* **Ruta:** `POST /api/sponsorships/:walletId/allocate`
* **Descripción:** El administrador fracciona la bolsa para pagar parte de la deuda de un inscrito.
* **Payload (Body):**
  ```json
  {
    "enrollmentId": "enrollment-uuid", // A quién se le paga
    "amountBase": 62.50 // Cuánto se le asigna de la bolsa (en moneda base)
  }
  ```
* **Respuesta (201 Created):**
  ```json
  {
    "transactionId": "tx-uuid",
    "type": "SPONSORSHIP_ALLOCATION",
    "walletBalanceRemaining": 937.50,
    "enrollmentStatusUpdated": "SOLVENT" // Si cubrió el total
  }
  ```
