# Plan de Módulo 4: Cuentas por Pagar (Egresos y Proveedores) (Fase 2)

Este módulo controla los compromisos financieros de la organización o evento con proveedores externos (ej. transporte, alimentación).

## Micro-Tareas

1.  **Directorio de Proveedores:**
    *   Definir DTO para registrar un proveedor a nivel de Organización.
    *   Implementar controlador y servicio `POST /providers`.
    *   Listar todos los proveedores `GET /providers`.

2.  **Registro de Compromisos (Cuentas por Pagar):**
    *   Implementar endpoint `POST /events/:eventId/payable-accounts` para registrar una factura o compromiso asociado a un evento y un proveedor.
    *   Definir el concepto (`concept`), monto total (`totalAmount`), monto pagado (`paidAmount`), y estado de la cuenta (`PENDING`, `PARTIAL`, `PAID`).
    *   Asociar el ID del evento y el ID del proveedor (Relaciones Prisma).

3.  **Abonos a Proveedores:**
    *   Implementar endpoint `POST /payable-accounts/:accountId/payments` para registrar un abono a la cuenta del proveedor.
    *   Restar del compromiso total el monto pagado (previa conversión de moneda, si aplica).
    *   Actualizar `paidAmount` y estado a `PARTIAL` o `PAID` (Transacción ACID).

4.  **Reportes y Resúmenes:**
    *   Implementar un endpoint `GET /events/:eventId/payable-accounts` para mostrar un resumen de la deuda total del evento, lo que se ha pagado, y a quién se le debe.

5.  **Pruebas (Testing):**
    *   Verificar que no se puede abonar más del monto total comprometido.
    *   Pruebas de cambio de divisa (si el pago es multidivisa) para el pago a proveedores.
