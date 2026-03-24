# Plan de Módulo 2: Cuentas por Cobrar (Ingresos y Abonos)

Este módulo gestiona la recaudación de fondos, los pagos fraccionados, los métodos de pago y el Motor de Patrocinios ("Bolsa de Dinero").

## Micro-Tareas

1.  **Catálogo Global de Métodos de Pago (Panel Administrador Global):**
    *   Definir DTO y rutas CRUD (`/api/admin/payment-methods`) para gestionar los métodos de pago globales disponibles en el sistema (ZELLE, Pago Móvil, etc.).
    *   Gestionar nombre de la institución, moneda (USD, VES, etc.) y estado (Activo/Inactivo).

2.  **Configuración de Métodos de Pago por Organización (Panel Organización):**
    *   Implementar endpoints (`/api/organizations/:id/payment-methods`) para que cada organización pueda agregar y configurar sus métodos de pago basados en el catálogo global.
    *   Definir un DTO que permita recibir la relación con el método global (`paymentMethodId`) y un objeto JSON `details` dinámico (ej. correo de Zelle, datos de Pago Móvil, cuenta bancaria).
    *   Permitir listar los métodos activos configurados por la organización para mostrarlos a los usuarios al registrar un pago.

3.  **Pagos Directos (Transacciones de Inscritos):**
    *   Definir DTO para registrar un abono (`amountOriginal`, `currencyOriginal`, `exchangeRate`, `organizationPaymentMethodId`).
    *   Implementar controlador y servicio `POST /enrollments/:enrollmentId/transactions`.
    *   Calcular `amountBase` = `amountOriginal` * `exchangeRate`.
    *   Actualizar `totalPaid` del `Enrollment` y cambiar el `status` a `PARTIAL` o `SOLVENT` (usando transacciones ACID de Prisma).
    *   Generar un `receiptNumber` único.

4.  **Estado de Cuenta (Reportes):**
    *   Implementar endpoint `GET /enrollments/:enrollmentId` para mostrar el resumen del estado de cuenta de un inscrito.
    *   Incluir el desglose de su estructura de costos y todo el historial de pagos asociados.

5.  **Motor de Patrocinios - Recepción de Fondos (Bolsa):**
    *   Implementar endpoint `POST /sponsorships` para recibir donaciones generales o por evento.
    *   Crear una transacción tipo `DONATION` que apunte al `SponsorshipWallet` correspondiente.
    *   Sumar el equivalente en moneda base al `totalReceived` de la bolsa.

6.  **Motor de Patrocinios - Asignación de Fondos (Subsidios):**
    *   Implementar endpoint `POST /sponsorships/:walletId/allocate`.
    *   Validar saldo disponible en la bolsa antes de asignar (`totalReceived` - `totalAllocated`).
    *   Crear transacción interna `SPONSORSHIP_ALLOCATION`.
    *   Actualizar `totalAllocated` en la bolsa.
    *   Actualizar `totalPaid` y el `status` del `Enrollment` beneficiado en una única transacción de base de datos.

7.  **Pruebas (Testing):**
    *   Escribir pruebas exhaustivas para asegurar que una transacción fallida no debite fondos de la bolsa (Rollback).
    *   Escribir pruebas de concurrencia: simular dos asignaciones simultáneas y verificar que no sobregiren el saldo de la bolsa.
    *   Pruebas de cambio de divisa (precisión decimal de PostgreSQL).
