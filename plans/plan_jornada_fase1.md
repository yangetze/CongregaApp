# FASE 1: Integración con Eventos, CRM y Bases de Datos (Backend)

**Objetivo:** Establecer la estructura de datos relacional extendiendo el ecosistema existente de CongregaApp. Se utilizarán las entidades `Event` y `Person` como base, incorporando tablas específicas (`EventServiceArea` y `ServiceAssignment`) para gestionar la logística de servicios y asignaciones.

## Micro-tareas de Base de Datos (Prisma)

- [x] **Extensión del Modelo `Event`:**
  - Agregar un mecanismo para identificar si un evento es una "Jornada" (Ej: un campo `eventType: EventType` o `isJornada: Boolean`). Esto permitirá a la interfaz de usuario habilitar los módulos de servicios.
- [x] **Extensión del Modelo `Enrollment`:**
  - Agregar el campo `ticketNumber` (String, opcional) para la logística física (pulseras, tickets).
- [ ] **Crear Modelo `EventServiceArea` (Áreas de Servicio de la Jornada):**
  - Campos:
    - `id` (UUID).
    - `eventId` (FK a Event).
    - `name` (String, Ej: Odontología, Ropero).
    - `type` (Enum: 'QUEUE' [Cola], 'FLOW' [Flujo]).
    - `maxCapacity` (Int, Nullable).
- [ ] **Crear Modelo `ServiceAssignment` (Asignaciones de Servicio):**
  - Campos:
    - `id` (UUID).
    - `enrollmentId` (FK a Enrollment). *Vincula al participante y su número de ticket/cédula al servicio.*
    - `serviceAreaId` (FK a EventServiceArea).
    - `status` (Enum: 'ASSIGNED', 'WAITING', 'ATTENDED', 'CANCELLED').
    - `createdAt` y `updatedAt`.

## Micro-tareas de Autenticación y Roles

*Nota: Se usará el sistema de seguridad global existente basado en el modelo `User` con rol `ORGANIZATION_MEMBER`. No es necesario crear nuevos endpoints de login ni emitir tokens especiales para la Jornada.*

- [ ] **Revisión de Políticas de Acceso (Middlewares actuales):**
  - Asegurar que los miembros de la organización (`ORGANIZATION_MEMBER`) tengan permisos adecuados para acceder a las rutas de gestión de colas dentro del evento, mientras que la configuración administrativa del evento requiera los permisos convencionales de gestión de eventos.

## Micro-tareas de Pruebas y Calidad (Testing)

- [ ] **Tests de Migración (Prisma):** Verificar que la creación de las tablas `EventServiceArea` y `ServiceAssignment` se ejecuta sin errores.
- [ ] **Tests de Modelos:** Validar que un `Enrollment` puede guardar un `ticketNumber` de forma opcional.
- [ ] **Tests de Relación:** Asegurar que eliminar un `Event` elimina (en cascada o restringe) sus `EventServiceArea` correspondientes, y que lo mismo ocurre con los `ServiceAssignment` si se elimina un `Enrollment`.
- [ ] **Verificación de Compilación:** Asegurar que el backend compila sin errores tras actualizar el esquema de Prisma y generar los tipos correspondientes.
