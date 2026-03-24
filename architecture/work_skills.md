# Formas de Trabajo (Skills y Metodología)

Como Arquitecto de Software y Desarrollador Backend, mi estilo de trabajo para diseñar, construir y desplegar esta aplicación SaaS B2B se basará en las siguientes habilidades y metodologías:

## Metodologías Ágiles (Scrum/Kanban adaptado)
* **Desarrollo Iterativo e Incremental:** El MVP se entregará priorizando los flujos core (Crear Evento -> Registrar Participante -> Realizar Abono).
* **Entregas Frecuentes (CI/CD):** Pruebas y despliegues automáticos al integrar una nueva funcionalidad a la rama principal.
* **Refinamiento Continuo:** Priorizar la claridad de las reglas de negocio sobre la implementación técnica inicial, documentando asunciones y clarificando requerimientos antes del código (ej. el Motor de Patrocinios).

## Patrones de Diseño y Arquitectura (Backend)
* **Separación de Responsabilidades (SoC):** Cada ruta REST será delegada a un Controlador (Validación de Input), y luego a un Servicio (Lógica de Negocio Pura), que se comunica con el Repositorio (Acceso a Datos / Prisma).
* **Domain-Driven Design (DDD):** El modelo de datos y el código reflejarán el "Lenguaje Ubicuo" del negocio. Por ejemplo: `SponsorshipWallet`, `Transaction`, `Enrollment`, `Tariff`.
* **Manejo de Transacciones (ACID):** Toda operación financiera (como asignar dinero de la bolsa de un evento a un participante deudor) se ejecutará dentro de una transacción en base de datos. Si una falla, el dinero donado se revierte a la bolsa.
* **Control de Concurrencia:** Asegurar que dos administradores no asignen el mismo fondo o llenen el mismo cupo de cabaña en milisegundos de diferencia.
* **Validación de Datos (Data Integrity):** Uso de librerías como Joi o Zod en el API Gateway o Controladores para validar inputs (ej. evitar montos negativos en donaciones, validar formatos de monedas).
* **Autenticación/Autorización (RBAC/ABAC):** Control de acceso basado en roles por Organización (Admin Global, Admin Financiero, Organizador de Evento) implementado vía JWT y middlewares (Passport.js).

## Multi-Tenancy (Multi-Inquilino Logico)
* **Aislamiento a Nivel de Fila:** Todos los modelos (Tablas) en Prisma que correspondan a datos de clientes tendrán un `organizationId` indexado para acelerar consultas y prevenir filtraciones.
* **Middleware de Inquilino (Tenant Middleware):** Inyectará automáticamente el ID de la organización extraído del JWT en todas las consultas al Repositorio de Datos.

## Documentación y Colaboración
* **Swagger/OpenAPI:** Documentación automatizada de todas las rutas REST del Backend para el consumo del Frontend.
* **Diagramas Relacionales:** Uso de Prisma Studio y DBML/Mermaid para visualización del esquema de datos durante el desarrollo.
* **Pull Requests Formales:** Todo código nuevo requerirá validación estática (ESLint, Prettier) y pruebas unitarias (Jest) para la lógica contable y de roles.
