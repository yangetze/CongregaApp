# Plan 4: Módulo de Cuentas por Cobrar (Pagos Directos)

## Contexto de Negocio
Este módulo permite registrar pagos (o abonos) realizados por un participante (`Person`) ya inscrito en un evento (`Enrollment`).
El sistema utiliza una arquitectura de pagos de dos niveles: existe un catálogo global de `PaymentMethod` (gestionado por el Administrador Global) y una `OrganizationPaymentMethod` donde cada organización vincula el método a sus propias cuentas bancarias.
Además, los abonos admiten ser registrados en una divisa diferente, mediante un tipo de cambio (`exchangeRate`), registrándose el monto base y el monto original de la divisa (Multidivisa).

Los estados de las transacciones (ej: "Por Conciliar", "Conciliado", "Rechazado") se manejan a través de una tabla dedicada `TransactionStatus` en lugar de enums, y el registro de estos pagos debe afectar directamente el balance o "Estado de Cuenta" de la inscripción (`totalPaid`).

## Tareas Funcionales a Desarrollar

### Tarea 4.1: Registrar un Abono Directo (`POST /api/enrollments/:enrollmentId/transactions`)
- **Descripción:** Endpoint que permite registrar un abono para amortizar la deuda (`totalCost`) de un participante.
- **Lógica Financiera Multidivisa:**
  - El administrador de la organización introduce un `amountOriginal` y una `currencyOriginal` junto con la tasa de cambio (`exchangeRate`). El sistema calculará automáticamente y persistirá el `amountBase`.
  - Debe referenciar a un `OrganizationPaymentMethod` válido (y por consiguiente, su cuenta bancaria de la organización).
  - La transacción nace, por defecto, con el ID del estado ("Por Conciliar") obtenido de la tabla global `TransactionStatus`.
  - Una transacción exitosa suma el `amountBase` al campo `totalPaid` del `Enrollment` siempre que el pago sea válido.
- **Tests Requeridos:**
  - `[Test]` Validar que se crea el registro de pago y se calcula correctamente el `amountBase` multiplicando el `amountOriginal` por el `exchangeRate`.
  - `[Test]` Validar que la inscripción actualiza el `totalPaid` y, si la deuda está saldada, cambia su propio estado de inscripción correspondientemente.

### Tarea 4.2: Cambio de Estado de Transacción (`PUT /api/transactions/:transactionId/status`)
- **Descripción:** El administrador puede cambiar el estado de un abono (por ejemplo, pasar de "Por Conciliar" a "Conciliado", o a "Rechazado" si el cheque/transferencia rebotó).
- **Lógica Contable:** Si una transacción pasa de "Por Conciliar" a "Rechazado", el `amountBase` debe ser revertido (restado) del `totalPaid` del `Enrollment` asociado.
- **Tests Requeridos:**
  - `[Test]` Validar que el paso a "Conciliado" se guarda sin alterar la deuda (pues ya se asume pagada provisionalmente al momento de la creación).
  - `[Test]` Validar rigurosamente que el paso a "Rechazado" revierte el `totalPaid` y recalculando la deuda, devolviendo el estado de cuenta a su estado anterior.
