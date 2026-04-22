# FASE 4: Dashboard de Servidor (Gestión de Colas Móvil)

**Objetivo:** Proveer una interfaz táctil ultra-responsiva para que el personal de la Organización gestione el flujo de las personas asignadas a su área de servicio desde su celular, bajo condiciones de alta demanda.

## Micro-tareas de Backend (Endpoints)

- [ ] **Endpoint GET `/api/org/:orgId/events/:eventId/service-areas/:areaId/assignments`:**
  - Retorna la lista de inscripciones (`Enrollment`) con asignaciones activas para un área de servicio (`EventServiceArea`) específica.
  - La respuesta debe filtrar por estado ('ASSIGNED', 'WAITING') e incluir los datos cruciales en la respuesta JSON: `ticketNumber` de la inscripción, y el `firstName`, `lastName` y `documentId` de la entidad `Person` relacionada.
- [ ] **Endpoint PATCH `/api/org/:orgId/events/:eventId/service-assignments/:assignmentId/status`:**
  - Actualiza el estado de una `ServiceAssignment` específica. Recibe el nuevo `status` en el body.

## Micro-tareas de Frontend (Dashboard Mobile-First)

- [ ] **Selección de Área Inicial (Vista de Servidor):**
  - Al acceder al "Dashboard de Jornada" (ej. `/org/:id/events/:eventId/dashboard`), mostrar una lista de las áreas de servicio. Al elegir una, el servidor entra en la "Cola" de esa área.
- [ ] **Buscador Local del Servicio:**
  - Input de búsqueda que filtre *exclusivamente* a las personas en la vista actual (cargadas en memoria) por Nombre, Cédula o número de Ticket/Brazalete (`ticketNumber`).
- [ ] **Listado de Cola Virtual (Tarjetas Táctiles):**
  - Crear tarjetas grandes por cada persona en la cola del servicio.
  - Mostrar contadores estáticos en la parte superior: Total "En Espera" (`WAITING`) y Total "Asignados" (`ASSIGNED`).
- [ ] **Diseño de Botones de Acción Táctiles:**
  - Implementar botones utilizando Tailwind con la clase `min-h-[60px] w-full text-lg font-bold rounded-xl` para cambiar estados sin fallar el *tap*:
    - 🟨 **AMARILLO (`bg-yellow-500`):** 'En Espera' (Indica que la persona se presentó físicamente en el toldo/área).
    - 🟩 **VERDE (`bg-green-600`):** 'Atendido' (Finalizó el proceso con éxito, desaparece de la vista activa).
    - 🟥 **ROJO (`bg-red-500`):** 'Cancelar/Desasignar' (La persona se retiró o fue asignada por error).
- [ ] **Feedback Inmediato de UX:**
  - Al presionar un botón de estado, deshabilitarlo de inmediato y mostrar un *spinner* de carga (o usar `toast` de Sonner) localmente para evitar que el servidor haga múltiples *taps* accidentales si el internet es inestable.

## Micro-tareas de Pruebas y Calidad (Testing)

- [ ] **Test Obtener Asignaciones:** Validar que el endpoint GET retorna correctamente la lista de personas ('WAITING' o 'ASSIGNED') incluyendo los datos anidados del CRM (`Person`).
- [ ] **Test Cambio de Estado (PATCH):** Validar que el comando actualiza la base de datos de manera correcta y maneja transiciones inválidas si las hubiera.
- [ ] **Test de UI/UX Frontend:** Validar que los botones de acción táctil usan la nomenclatura correcta de estados y se bloquean preventivamente tras el clic.
- [ ] **Verificación de Compilación Final:** Ejecutar el flujo de compilación para producción (`npm run build`) en el frontend y la validación de tests (`npm run test`) del backend.
