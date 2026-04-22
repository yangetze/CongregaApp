# FASE 2: Configuración del Evento (Tipo Jornada) y Servicios

**Objetivo:** Permitir a los organizadores configurar eventos tipo "Jornada" y definir qué áreas de servicio (`EventServiceArea`) estarán disponibles dinámicamente para los participantes durante la operación.

## Micro-tareas de Backend (Endpoints Multi-tenant)

*Nota: Todas estas rutas deben estar protegidas por el middleware de autenticación global y verificar el acceso a la Organización (`orgId`).*

- [ ] **Endpoint POST `/api/org/:orgId/events` (Ajuste):**
  - Asegurar que el endpoint existente soporte la creación de eventos con la configuración específica de Jornada (ej. `eventType: 'JORNADA'`).
- [ ] **Endpoint POST `/api/org/:orgId/events/:eventId/service-areas`:**
  - Crea una nueva área de servicio vinculada al evento. Recibe el `name` (ej: Medicina General, Ropero), el `type` (`QUEUE` o `FLOW`) y la `maxCapacity`.
- [ ] **Endpoint GET `/api/org/:orgId/events/:eventId/service-areas`:**
  - Retorna todas las áreas de servicio configuradas para un evento específico.
- [ ] **Endpoint PATCH `/api/org/:orgId/events/:eventId/status` (Uso de flujo existente):**
  - En lugar de un flag `is_activa`, utilizaremos el ciclo de vida natural del evento (`status: 'PUBLISHED'` u `ONGOING` si existe). La jornada actual del día será el evento publicado que transcurra en la fecha de hoy.

## Micro-tareas de Frontend (Panel de Organización - React + Tailwind/shadcn)

- [ ] **Vista 'Crear Evento' (Ajustes):**
  - Incorporar la selección del tipo de evento o template ("Jornada de Servicio").
- [ ] **Pestaña 'Áreas de Servicio' (Nueva Vista en Detalles del Evento):**
  - Interfaz dinámica (tipo tabla o tarjetas) exclusiva para eventos tipo Jornada.
  - Botón "Agregar Área de Servicio" con un modal/formulario para definir el nombre, capacidad y un selector para definir el flujo (`QUEUE` para colas convencionales o `FLOW` para zonas de tránsito rápido).
- [ ] **Botón 'Publicar Evento':**
  - Botón primario (`bg-brand-accent`) para activar el evento (`status = PUBLISHED`), haciéndolo visible para el registro y los dashboards móviles de los servidores el día de la operación.

## Micro-tareas de Pruebas y Calidad (Testing)

- [ ] **Test Creación de Áreas de Servicio (Happy Path):** Validar que un usuario autorizado puede agregar un `EventServiceArea` a su evento.
- [ ] **Test Autorización (Tenant-Isolation):** Verificar que un usuario no pueda agregar áreas de servicio a un evento de otra organización (`orgId`).
- [ ] **Test Obtención de Áreas:** Validar que el endpoint GET retorna correctamente la lista de servicios filtrados por `eventId`.
- [ ] **Test Frontend (Componentes):** Validar que el componente de creación de áreas renderiza correctamente el selector 'QUEUE/FLOW' y actualiza el estado.
- [ ] **Verificación de Compilación:** Correr el proceso de `build` del frontend y ejecutar los test suites del backend para garantizar la ausencia de errores.
