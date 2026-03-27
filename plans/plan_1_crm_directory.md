# Plan 1: Módulo de Directorio CRM (Personas y Relaciones)

## Contexto de Negocio
Para que cualquier organización pueda gestionar asistentes a sus eventos, primero necesita una base de datos centralizada de su comunidad.
En CongregaApp, esta entidad se denomina `Person` (diferenciada de `User`, que es el administrador del sistema). A nivel de interfaz, este directorio se presenta como "Personas" (ruta `/org/:orgId/people`), distinguiéndose del término "Participante" el cual se reserva estrictamente para las personas ya inscritas en un evento (`Enrollment`).
El módulo CRM permite a las organizaciones gestionar de forma segura los datos personales (Nombres, Cédula/Documento de Identidad, Teléfono, Correo y Fecha de Nacimiento) e incluso establecer relaciones familiares (ej. Padre a Hijo) que servirán para futuros procesos logísticos.

Este módulo debe operar bajo el modelo Multi-Tenancy asegurando siempre el filtro por `organizationId`.

## Tareas Funcionales a Desarrollar

### Tarea 1.1: Registro de Nuevas Personas (`POST /api/persons`)
- **Descripción:** Desarrollar el endpoint para la creación de una nueva persona en el directorio general.
- **Validaciones:**
  - El sistema **no debe permitir la creación de personas duplicadas**. Si se envía un `documentId` (cédula) que ya está registrado para esa misma organización (`organizationId`), el sistema no debe fallar con un error, sino que debe retornar el ID de la persona existente de forma silenciosa para continuar el flujo de inscripción.
  - La edad se calculará de forma dinámica a partir de la fecha de nacimiento ingresada y de cara al futuro. No se debe guardar como un entero fijo en base de datos.
- **Tests Requeridos:**
  - `[Test]` Prueba unitaria/integración validando que se crea una nueva persona si el documento no existe en la organización.
  - `[Test]` Prueba validando que, si el documento ya existe, el sistema retorna los datos o el ID del registro anterior sin arrojar una excepción.

### Tarea 1.2: Búsqueda y Filtrado del Directorio (`GET /api/persons`)
- **Descripción:** Desarrollar un endpoint de autocompletado y listado. La interfaz UI no usará listados completos inicialmente, sino entradas basadas en búsqueda para mejor escalabilidad y UX.
- **Filtros Soportados:** Búsqueda combinada por Cédula (`documentId`), Nombre, Apellido, o Correo electrónico (`email`).
- **Tests Requeridos:**
  - `[Test]` Validar que se retornan únicamente los resultados de la organización autenticada y que coinciden con los parámetros de búsqueda.
  - `[Test]` Retornar una lista vacía si no existen coincidencias.

### Tarea 1.3: Establecimiento de Relaciones Familiares (`POST /api/persons/:personId/relationships`)
- **Descripción:** Permitir conectar dos perfiles de `Person` diferentes.
- **Lógica de Relaciones:** El backend debe interpretar o asegurar la lógica de la relación (ej: Si `Person A` se registra como `PARENT` de `Person B`, automáticamente `Person B` es `CHILD` de `Person A`).
- **Tests Requeridos:**
  - `[Test]` Validar la creación bidireccional y correcta en la base de datos tras llamar a este endpoint.
  - `[Test]` Retornar un error si se intenta establecer una relación de la persona consigo misma.
