# Plan de Módulo 4: Cuentas por Pagar (Egresos y Proveedores) (Fase 2)

Un evento no se hace solo; requiere proveedores, transporte, alimentos, y servicios técnicos. Este módulo permite tener un control impecable sobre los egresos de la Organización, asegurando que todos los compromisos financieros con terceros se manejen con profesionalismo.

## Micro-Tareas

1.  **Directorio de Proveedores:**
    *   Definir DTO para centralizar la base de proveedores en la `Organization`.
    *   Implementar controlador y servicio `POST /providers`.
    *   Facilitar una lista de proveedores activos `GET /providers` para asociar gastos a eventos.

2.  **Registro de Cuentas por Pagar (Compromisos):**
    *   Implementar endpoint `POST /events/:eventId/payable-accounts` para registrar las facturas o compromisos.
    *   Capturar el concepto de la cuenta (`concept`), monto total (`totalAmount`), monto abonado (`paidAmount`), y su estado (`PENDING`, `PARTIAL`, `PAID`).
    *   Mantener una relación clara en la base de datos entre el evento y su respectivo proveedor (Prisma Relations).

3.  **Abonos a Proveedores:**
    *   Registrar un abono hacia la cuenta del proveedor mediante `POST /payable-accounts/:accountId/payments`.
    *   Validar la conversión de monedas, si el pago a un tercero requiere una divisa diferente.
    *   Garantizar transacciones ACID al actualizar el `paidAmount` y el estado del compromiso.

4.  **Reportes y Resúmenes Claros:**
    *   Ofrecer un resumen a los Administradores de la Organización `GET /events/:eventId/payable-accounts`, mostrando de forma simple qué falta por pagar, cuánto se ha cubierto y las fechas límite.

5.  **Pruebas (Testing):**
    *   Evitar abonos superiores a la deuda del proveedor.
    *   Verificar el correcto funcionamiento del cambio de divisas al realizar pagos internacionales o con tasas de cambio flotantes.
