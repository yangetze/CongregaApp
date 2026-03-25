# Plan de Módulo 1: Configuración de Eventos y Presupuestos (MVP)

¡La creación de eventos es el corazón de CongregaApp! Aquí diseñamos y configuramos todo lo necesario para que tu retiro o convención sea un éxito desde el inicio. Este módulo permite estructurar fechas, capacidades, roles, y los costos asociados de manera sencilla e intuitiva.

## Micro-Tareas

1.  **Diseño de Endpoints y Validaciones (Controladores):**
    *   Definir DTOs con Zod/Joi para validar la creación de eventos.
    *   Validar la lógica de fechas: Para eventos de un solo día, la fecha de fin se iguala automáticamente a la de inicio en el frontend. Eventos de múltiples días requieren una fecha final explícita mediante un checkbox.
    *   Asegurar que la capacidad total del evento (`totalCapacity`) sea calculada dinámicamente a partir de la sumatoria de las capacidades de todos los `TicketStructure`. Si no se proveen tickets, se debe crear uno por defecto (ej. "General", monto 0, cantidad 10).
    *   Implementar un identificador secuencial amigable para cada organización (`sequentialId`, ej. "Evento #1"), distinto a su nombre personalizable.
    *   Manejar los estados del evento: "Borrador" (por defecto), "Activo", "Realizado", y "Cancelado".

2.  **Lógica de Negocio (Servicios y Reglas Dinámicas):**
    *   Crear servicio que guarde el evento, su `OrganizationId`, y sus estructuras financieras (`hasCost`, `CostStructure` y `TicketStructure`).
    *   Guardar las reglas de inscripción en el campo dinámico `requirements` (formato JSON), lo que brinda total flexibilidad para requisitos futuros sin alterar el esquema relacional.
    *   *Regla Especial:* Durante la creación, los organizadores y participantes asignados desde el CRM de `Personas` se inscriben automáticamente. A los organizadores se les asigna el rol `STAFF`, y a los asistentes el rol `PARTICIPANT`.

3.  **Inscripciones (Enrollment) y Roles:**
    *   Implementar controlador y servicio para registrar a una `Person` en un `Event` (Enrollment).
    *   Manejar roles básicos para cada evento (`STAFF` o `PARTICIPANT`), que determinarán los privilegios y costos aplicables.
    *   Evitar duplicados usando la combinación de `documentId` (cédula) y el `organizationId`. Si la persona existe, reutilizamos su ID.

4.  **Pruebas y Verificación (Testing):**
    *   Asegurar que las pruebas unitarias cubran el comportamiento dinámico del `TicketStructure` (límite de capacidades y precios base).
    *   Verificar que la transición de estados (Borrador -> Activo) funcione y se refleje en el Dashboard de la Organización.
