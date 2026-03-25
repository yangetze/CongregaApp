# Plan de Módulo 2: Cuentas por Cobrar (Ingresos y Abonos)

Este módulo es vital para mantener la salud financiera de la organización. Gestiona la recaudación de fondos de manera estructurada y centralizada, abarcando abonos, pagos fraccionados, configuración de métodos de pago y el potente Motor de Patrocinios.

## Arquitectura de Pagos (Dos Niveles)

Para garantizar consistencia global y flexibilidad local, CongregaApp implementa una arquitectura de pago en dos niveles:

1.  **Catálogo Global de Métodos de Pago:** El Administrador Global, mediante la pantalla unificada `AdminMaintenancePage` (que sincroniza pestañas con rutas como `/admin/payment-methods`), define la institución y moneda (ej. "Zelle USD", "Pago Móvil VES").
2.  **Configuración de Métodos por Organización:** Cada Organización selecciona métodos de este catálogo global y les añade sus propios datos bancarios dinámicos mediante un campo JSON (ej. `email`, `teléfono`, o `cuenta bancaria`), representados en el modelo `OrganizationPaymentMethod`.

## Micro-Tareas

1.  **Mantenimiento Global (Panel Administrador Global):**
    *   Mantener el catálogo de Métodos de Pago, Divisas, Variables y Estados de Evento.
    *   Asegurar que `AdminMaintenancePage` maneje las rutas correctamente.

2.  **Configuración de Métodos de Pago por Organización:**
    *   Implementar endpoints para agregar los detalles JSON al `OrganizationPaymentMethod`.
    *   Listar métodos activos a los participantes durante el proceso de pago de sus `Enrollments`.

3.  **Registro de Transacciones y Estados:**
    *   Definir DTO para registrar abonos.
    *   Manejar los estados de la transacción para mantener claridad contable: "pendiente/por conciliar", "conciliado", y "rechazado".
    *   Actualizar automáticamente el saldo en el modelo `Enrollment` (status de SOLVENT o PARTIAL) de manera ACID, una vez la transacción sea "conciliada".

4.  **Estado de Cuenta:**
    *   Endpoints para consultar el saldo y todo el historial de transacciones (conciliadas o pendientes) asociados a un inscrito en el evento.

5.  **Motor de Patrocinios:**
    *   Implementar la recepción y asignación de fondos a través de las bolsas (`SponsorshipWallet`).
    *   Asegurar que una transacción de tipo `SPONSORSHIP_ALLOCATION` afecte simultáneamente la bolsa donada y el saldo pendiente de un asistente.

6.  **Pruebas de Transacciones:**
    *   Validar los estados (por conciliar vs conciliado) y cómo impactan el estado de cuenta.
    *   Asegurar que los datos JSON de `OrganizationPaymentMethod` no se corrompan al ser creados o actualizados.
