# Plan de Módulo 2: Cuentas por Cobrar (Ingresos y Abonos)

Este módulo gestiona la recaudación de fondos, los pagos fraccionados y el Motor de Patrocinios ("Bolsa de Dinero").

## Micro-Tareas

1.  **Pagos Directos (Transacciones de Inscritos):**
    *   Definir DTO para registrar un abono (`amountOriginal`, `currencyOriginal`, `exchangeRate`, `paymentMethod`).
    *   Implementar controlador y servicio `POST /enrollments/:enrollmentId/transactions`.
    *   Calcular `amountBase` = `amountOriginal` * `exchangeRate`.
    *   Actualizar `totalPaid` del `Enrollment` y cambiar el `status` a `PARTIAL` o `SOLVENT` (usando transacciones ACID de Prisma).
    *   Generar un `receiptNumber` único.

2.  **Estado de Cuenta (Reportes):**
    *   Implementar endpoint `GET /enrollments/:enrollmentId` para mostrar el resumen del estado de cuenta de un inscrito.
    *   Incluir el desglose de su estructura de costos y todo el historial de pagos asociados.

3.  **Motor de Patrocinios - Recepción de Fondos (Bolsa):**
    *   Implementar endpoint `POST /sponsorships` para recibir donaciones generales o por evento.
    *   Crear una transacción tipo `DONATION` que apunte al `SponsorshipWallet` correspondiente.
    *   Sumar el equivalente en moneda base al `totalReceived` de la bolsa.

4.  **Motor de Patrocinios - Asignación de Fondos (Subsidios):**
    *   Implementar endpoint `POST /sponsorships/:walletId/allocate`.
    *   Validar saldo disponible en la bolsa antes de asignar (`totalReceived` - `totalAllocated`).
    *   Crear transacción interna `SPONSORSHIP_ALLOCATION`.
    *   Actualizar `totalAllocated` en la bolsa.
    *   Actualizar `totalPaid` y el `status` del `Enrollment` beneficiado en una única transacción de base de datos.

5.  **Pruebas (Testing):**
    *   Escribir pruebas exhaustivas para asegurar que una transacción fallida no debite fondos de la bolsa (Rollback).
    *   Escribir pruebas de concurrencia: simular dos asignaciones simultáneas y verificar que no sobregiren el saldo de la bolsa.
    *   Pruebas de cambio de divisa (precisión decimal de PostgreSQL).
