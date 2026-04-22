# Plan de Trabajo Maestro: Módulo de Jornadas (Eventos Masivos)

Este documento es el **índice principal** del desarrollo del Módulo de Jornadas. Una "Jornada" en esta aplicación se implementa arquitectónicamente como un tipo especial del modelo global de **Evento** (`Event`), diseñado específicamente para operaciones masivas de un solo día (ej. jornadas médicas, entregas sociales) que requieren un registro ágil de participantes, gestión de colas, y validación táctil desde dispositivos móviles para los servidores del evento.

El proyecto está dividido en 4 fases accionables diseñadas para acoplarse orgánicamente a la arquitectura **PERN** (PostgreSQL, Express, React, Node.js), respetando el esquema multi-tenant (`Organization`), el patrón CQRS y el modelo de seguridad global (usuarios y roles).

A continuación se listan los enlaces a los planes detallados por fase (micro-tareas):

- [FASE 1: Integración con Eventos, CRM y Bases de Datos](./plan_jornada_fase1.md)
  *Extensión de los modelos `Event` y `Enrollment`, y creación de `EventServiceArea` y `ServiceAssignment`.*
- [FASE 2: Configuración del Evento (Tipo Jornada) y Servicios](./plan_jornada_fase2.md)
  *Gestión dinámica de servicios (Cola/Flujo) acoplados al evento por parte del Administrador.*
- [FASE 3: Rampa de Registro y Asignación de Participantes](./plan_jornada_fase3.md)
  *Registro ultra-rápido en el CRM (`Person`) y asignación (`Enrollment`) con generación de `ticketNumber` opcional.*
- [FASE 4: Dashboard de Servidor (Gestión de Colas Móvil)](./plan_jornada_fase4.md)
  *Interfaz 100% táctil para control de asistencia por área ('Asignado', 'En Espera', 'Atendido', 'Cancelado').*

---

## Consideraciones Globales
- **Integración Arquitectónica:** No se crearán modelos aislados para autenticación o gestión básica. Todo se basará en las tablas de `Organization`, `User` (rol `ORGANIZATION_MEMBER`), `Event`, y `Person`.
- **Flexibilidad de Registro:** Los participantes (personas en el CRM) pueden ser registrados inicialmente sin requerir la cédula obligatoriamente. Si carecen de cédula o la dinámica lo requiere, se usará un campo temporal `ticketNumber` en su inscripción al evento (Ej: número de pulsera) para identificación rápida en sitio.
- **Botones Táctiles:** El estándar para interacciones de acción rápida en móvil será el uso de botones grandes optimizados para *tap* (clase `min-h-[60px]`).
- **Calidad y Testing (Obligatorio):** En cada fase se deben implementar tests automatizados. Como mínimo, se debe probar el "Happy Path" (flujo básico exitoso) de cada endpoint y componente crítico, seguido de flujos alternos (Ej: fallos de validación).
- **Verificación de Compilación:** Antes de dar por finalizada cualquier fase, se debe ejecutar un proceso de validación para asegurar que el proyecto compila íntegramente (`build` del frontend y backend) sin errores de sintaxis, tipos o referencias perdidas.
