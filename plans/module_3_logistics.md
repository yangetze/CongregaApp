# Plan de Módulo 3: Logística y Registro del Participante (Fase 2)

Este módulo gestiona la asignación física de los asistentes y su información médica y logística durante el evento.

## Micro-Tareas

1.  **Fichas Médicas:**
    *   Definir DTO para registrar un perfil médico de un usuario.
    *   Implementar controlador y servicio `POST /users/:userId/medical-record`.
    *   Soportar actualizaciones parciales `PATCH /users/:userId/medical-record` y recuperar la información con un `GET`.

2.  **Grupos Logísticos (Cabañas/Habitaciones/Equipos):**
    *   Crear endpoints para la creación de grupos: `POST /events/:eventId/logistic-groups`.
    *   Definir capacidades máximas por grupo (`capacity`), tipo de grupo (`type`), y reglas de género (`genderRules`).
    *   Asignar `Enrollments` a un `LogisticGroup`, asegurando validación de género (si corresponde) y de cupos libres (`capacity` - asignados actuales).
    *   Listar ocupación actual de los grupos de un evento `GET /events/:eventId/logistic-groups`.

3.  **Control de Acceso (Check-in/Check-out):**
    *   Implementar endpoint para registrar la entrada del participante `POST /events/:eventId/access/check-in` y la salida `POST /events/:eventId/access/check-out`.
    *   Registrar datos de quién entregó/recibió al menor y la fecha/hora exacta.

4.  **Pruebas (Testing):**
    *   Validaciones de capacidad y de género en la asignación a un grupo.
    *   Manejo de estados (Un inscrito no puede hacer Check-out sin Check-in previo, etc.).
