# Plan 3: Módulo de Inscripciones a Eventos

## Contexto de Negocio
Una vez que el directorio (CRM) y el evento existen, el puente lógico y contable entre ambos es el módulo de Inscripciones.
A través de la entidad `Enrollment`, una persona (`Person`) asume un rol dentro de un evento (e.g., `STAFF`, `PARTICIPANT`).
Este módulo es crítico para las finanzas, ya que cada inscripción, mediante la selección de un tipo de boleto (`ticketId`), genera una deuda (`totalCost`) inicial de $0.00 o más, sobre la cual luego se restarán los pagos efectuados (`totalPaid`).

## Tareas Funcionales a Desarrollar

### Tarea 3.1: Inscribir Participante en Evento (`POST /api/events/:eventId/enrollments`)
- **Descripción:** Desarrollar el endpoint para la creación de la inscripción de una persona en un evento.
- **Lógica de Negocio y Validación:**
  - Debe recibir obligatoriamente `personId` (asociado a la organización) y `role` (`STAFF` o `PARTICIPANT`).
  - Debe recibir un `ticketId` asociado al evento.
  - El sistema deberá validar dinámicamente el JSON `requirements` del evento (ej: si el evento exige `targetGender` == "FEMALE", rechazar a hombres; si tiene un `minAge`, calcular la edad del participante y rechazar menores). Esto retornará un warning o un error (Bad Request) según se defina, para que la UI informe al administrador.
  - Al inscribirse, el sistema asume la creación de la inscripción calculando la deuda (Ej. `totalCost = 150.00`, `totalPaid = 0.00`, estado inicial pendiente/borrador).
  - El límite (`totalCapacity`) del evento y la cantidad específica del ticket no deben excederse.
- **Tests Requeridos:**
  - `[Test]` Validar inscripción exitosa, creando una deuda de `totalCost` equivalente al ticket seleccionado.
  - `[Test]` Validar que se rechaza la inscripción si la persona no cumple con las reglas de género o edad (`requirements`).
  - `[Test]` Validar que se devuelve un error si se intenta sobrepasar la cantidad máxima del ticket o la capacidad total (`totalCapacity`) del evento.

### Tarea 3.2: Obtener Estado de Cuenta del Participante (`GET /api/enrollments/:enrollmentId`)
- **Descripción:** Endpoint para visualizar los detalles financieros y el historial de pagos de un participante.
- **Lógica:** Este endpoint retornará los datos de la persona inscrita, la cantidad pendiente de pago y el desglose en caso de haber transacciones ya registradas (aunque el registro en sí se aborda en el Sprint 4).
- **Tests Requeridos:**
  - `[Test]` Validar que se devuelve la información de la inscripción, asegurando siempre que la petición pertenezca al `organizationId`.

### Tarea 3.3: Asignación Automática de Roles de Organizador a Staff
- **Descripción:** La UI selecciona organizadores y asistentes mediante inputs de búsqueda.
- **Lógica:** Durante la creación del evento o inscripción directa, los usuarios designados como "organizadores" (`organizerIds`) en la payload, o participantes, deben ser automáticamente convertidos a `Enrollment` con los roles `STAFF` y `PARTICIPANT` correspondientemente.
- **Tests Requeridos:**
  - `[Test]` Validar que la asignación en bloque de organizadores cree correctamente las inscripciones con rol `STAFF` y el ticket por defecto (generalmente $0 o configurado para organizadores).
