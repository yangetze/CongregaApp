# Plan 2: Módulo de Eventos y Presupuestos

## Contexto de Negocio
Los eventos en CongregaApp son el núcleo de toda la operación, el equivalente al "Centro de Costos" de una contabilidad. Una organización crea un `Event` (con su identificador secuencial amigable para el usuario `Evento #1`), establece reglas opcionales de participación (ej. solo mujeres de 18 a 35 años), y configura cómo se cobrará la asistencia a través de `CostStructure` (costos base, transporte, materiales) y el manejo de entradas o boletos mediante `TicketStructure`.

Este módulo requiere alta rigurosidad financiera y de validación porque los eventos manejan fechas clave, metas de recaudación y capacidad máxima para evitar sobreventas.

## Tareas Funcionales a Desarrollar

### Tarea 2.1: Creación de Eventos y Su Estructura Financiera (`POST /api/events`)
- **Descripción:** Desarrollar el endpoint central para la creación de un nuevo `Event`.
- **Lógica Financiera y Logística:**
  - El sistema debe recibir parámetros obligatorios como `name`, `startDate` (las fechas se manejan como un solo día si `endDate` es nulo o idéntico).
  - El evento debe crearse por defecto en estado "Borrador" (Draft), y debe tener un identificador secuencial asignado (el contador de la organización, que no interfiere con otros tenants).
  - Si el campo `hasCost` es verdadero, debe persistirse un array de objetos de tipo `CostStructure` (Ej: Base + Materiales).
  - Configuración de Capacidad: Si se envían varios tipos de tickets (`TicketStructure`), la capacidad total (`totalCapacity`) del evento será dinámicamente la suma de las cantidades disponibles de todos los tickets ingresados. Si no se envía estructura, se asume un ticket 'General', cantidad 10, precio 0.
- **Tests Requeridos:**
  - `[Test]` Validar que se crea el evento con estado Borrador, su `sequentialId` y la suma correcta del `totalCapacity` basada en el `TicketStructure`.
  - `[Test]` Validar el comportamiento para eventos que duran un solo día (sin `endDate` explícito o igual a `startDate`).

### Tarea 2.2: Listado y Detalles del Evento (`GET /api/events`)
- **Descripción:** Listado de eventos de la organización que también devuelven el estado y el resumen de la meta financiera.
- **Lógica:** El listado no expone todos los datos complejos (como los JSON de rules o structures) de primer plano a menos que se pidan los detalles (`GET /api/events/:id`).
- **Tests Requeridos:**
  - `[Test]` Listar los eventos asegurando que están limitados por el `organizationId`.

### Tarea 2.3: Configuración Dinámica de Requisitos del Evento (`PUT /api/events/:id`)
- **Descripción:** Actualizar las reglas de un evento, como el campo JSON `requirements` que determina quién puede inscribirse (género o límites de edad).
- **Lógica:** Modificar las fechas (si de un día se vuelve a varios), o ajustar la meta de recaudación (`fundraisingGoal`).
- **Tests Requeridos:**
  - `[Test]` Actualizar exitosamente los `requirements` (JSON) y validar que los datos se persisten y se pueden consultar.
