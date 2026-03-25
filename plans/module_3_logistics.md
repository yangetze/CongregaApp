# Plan de Módulo 3: Logística y Registro del Participante (Fase 2)

¡Porque no todo son números! Este módulo está diseñado para que la logística de tu evento fluya con la misma facilidad que tus finanzas. Administramos la asignación física de los asistentes, su información vital, y el control de accesos durante el evento para asegurar su bienestar.

## Micro-Tareas

1.  **Fichas Médicas de Participantes:**
    *   Definir DTO para registrar un perfil médico actualizado.
    *   Implementar controlador y servicio `POST /persons/:personId/medical-record`.
    *   Mantener el historial médico globalmente en el CRM o pedir validaciones específicas por evento. Soportar actualizaciones con `PATCH`.

2.  **Grupos Logísticos (Cabañas, Habitaciones, Equipos):**
    *   Crear endpoints intuitivos para configurar grupos: `POST /events/:eventId/logistic-groups`.
    *   Definir parámetros como capacidad máxima (`capacity`), tipo de grupo (`type`), y reglas (`genderRules`).
    *   Facilitar la asignación visual en el Frontend, validando el género (si aplica) y la capacidad disponible.
    *   Listar ocupación actual de los grupos de un evento `GET /events/:eventId/logistic-groups` en el Dashboard de la Organización.

3.  **Control de Acceso Seguro (Check-in/Check-out):**
    *   Crear un endpoint rápido y confiable para registrar entradas y salidas `POST /events/:eventId/access/check-in`.
    *   Registrar información de la persona que entrega o recibe a los menores, junto con estampas de tiempo exactas.

4.  **Pruebas (Testing):**
    *   Validar reglas estrictas de género y capacidad.
    *   Verificar que un participante no pueda hacer Check-out sin un Check-in previo, manteniendo la seguridad de los eventos.
