# Plan de Módulo 1: Configuración de Eventos y Presupuestos (MVP)

Este módulo es el núcleo del sistema de gestión de eventos. Permite crear, configurar y estructurar los costos de los eventos.

## Micro-Tareas

1.  **Diseño de Endpoints y Validaciones (Controladores):**
    *   Definir DTOs (Data Transfer Objects) con Zod o Joi para validar la creación de eventos (fechas válidas, capacidad positiva, etc.).
    *   Implementar controlador `POST /events` y `GET /events`.
    *   Implementar validaciones de los costos (`CostStructure`).

2.  **Lógica de Negocio (Servicios):**
    *   Crear servicio de eventos que interactúe con el repositorio de Prisma para guardar el evento y sus estructuras de costos en una sola transacción (`prisma.$transaction`).
    *   Asegurar que el `organizationId` se extraiga correctamente del contexto de la petición (Multi-tenant).

3.  **Inscripciones (Enrollment) y Roles:**
    *   Implementar controlador y servicio `POST /events/:eventId/enrollments`.
    *   Calcular dinámicamente el `totalCost` basado en la suma de los costos obligatorios de la `CostStructure` del evento para ese rol (`TariffType`).
    *   Validar que no se exceda el `totalCapacity` del evento al inscribirse.
    *   Validar inscripciones duplicadas (un usuario solo puede tener un registro activo por evento).

4.  **Pruebas (Testing):**
    *   Escribir pruebas unitarias para el cálculo del costo total.
    *   Escribir pruebas de integración para la creación de eventos y el control de cupos máximos.
