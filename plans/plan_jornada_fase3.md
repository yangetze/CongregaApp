# FASE 3: Rampa de Registro y Asignación de Participantes

**Objetivo:** Permitir al equipo de registro de la Jornada anotar personas rápidamente en el CRM, inscribirlas en el evento (generando o capturando su número de ticket/pulsera si la logística lo requiere) y dirigirlas a las áreas de servicio que soliciten.

## Micro-tareas de Backend (Endpoints Multi-tenant)

- [ ] **Endpoint POST `/api/org/:orgId/events/:eventId/enrollments` (Flujo Rápido):**
  - Este endpoint encapsulará una operación compuesta (Command) para agilizar la rampa de entrada:
    1.  Recibe datos de la persona (`firstName`, `lastName`, `documentId` opcional) y datos de logística (`ticketNumber` opcional).
    2.  *Lógica CRM:* Si se provee `documentId` y ya existe en la Organización, retorna la persona existente. Si no, crea una nueva `Person`.
    3.  *Lógica Evento:* Crea la inscripción (`Enrollment`) de esta persona para el evento. Si el frontend no provee un `ticketNumber` pero la configuración del evento exige pulseras numeradas autogeneradas, el backend lo genera.
- [ ] **Endpoint PATCH `/api/org/:orgId/people/:personId` (Ajuste Flujo Existente):**
  - Asegurar que la actualización posterior de datos del CRM (por ejemplo, añadir la cédula si solo se registró el nombre en la rampa) funcione sin problemas, previniendo choques de unicidad.
- [ ] **Endpoint POST `/api/org/:orgId/events/:eventId/service-assignments`:**
  - Vincula un `Enrollment` con una `EventServiceArea`.
  - *Lógica de Negocio CQRS:* Al ejecutar el comando, si el área de servicio es tipo `FLOW` (Ej: Charlas de paso), el estado inicial de la asignación pasa automáticamente a `ATTENDED` u omite la vista de colas. Si es tipo `QUEUE`, el estado inicial es `ASSIGNED`.

## Micro-tareas de Frontend (UX Rampa de Registro)

- [ ] **Formulario Rápido y Flexible (Vista 'Rampa'):**
  - Inputs para Nombre y Apellido (Requeridos).
  - Input para Cédula (Opcional, para evitar embudos si la persona no la lleva).
  - Input para Número de Ticket/Brazalete (`ticketNumber`, opcional, dependiendo de la logística física).
- [ ] **Búsqueda Autocomplete Unificada:**
  - Buscador global en la vista de registro que permita ingresar la Cédula o buscar por Nombre. Si el CRM encuentra coincidencia, autocompleta el formulario para agilizar el proceso y permite editar.
- [ ] **Selector de Áreas de Servicio:**
  - Lista de botones (Grid responsivo) con los servicios de la jornada. Al seleccionar uno(s) y dar "Guardar", se emite la petición al backend para inscribir a la persona y generar sus asignaciones (`ServiceAssignment`).

## Micro-tareas de Pruebas y Calidad (Testing)

- [ ] **Test Registro Flexible (Happy Path):** Validar la creación del `Enrollment` (y la `Person` subyacente) omitiendo el `documentId`.
- [ ] **Test Integración CRM:** Validar que al intentar registrar a una persona con un `documentId` que ya existe en la organización, el sistema reutilice la `Person` correcta sin generar duplicados.
- [ ] **Test Asignación por Tipo de Flujo:** Validar que el comando de asignación a un servicio tipo `FLOW` establece el estado final directamente (ej. `ATTENDED`), mientras que un servicio `QUEUE` lo deja en `ASSIGNED`.
- [ ] **Verificación de Compilación:** Correr tests unitarios (Jest/Supertest) asegurando incluir los headers de Autenticación (`Bearer mock-token`) y el `orgId` en las URL.
