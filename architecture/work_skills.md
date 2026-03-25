# Formas de Trabajo (Skills y Metodología)

El enfoque principal para desarrollar y evolucionar CongregaApp se basa en entregar una arquitectura escalable, un código limpio, y una experiencia amigable y confiable tanto para los desarrolladores como para los clientes (iglesias, campamentos).

## Metodologías Ágiles (MVP)
* **Iterativo e Incremental:** Nuestra prioridad es afianzar los módulos críticos: Directorio (Person), Configuración de Eventos, e Ingresos.
* **Refinamiento Funcional:** Aseguramos la claridad de negocio antes de codificar. Ejemplos de esto son la correcta separación del `User` (Administrador de los dashboards) y `Person` (Asistente del CRM).
* **Entregas Frecuentes:** Construimos características completas y estables para la rama principal.

## Patrones de Diseño Backend (Stack PERN + Prisma)
* **Separación de Responsabilidades (SoC):** La arquitectura backend descansa sobre Controladores (validan entradas con Zod/Joi), Servicios (aplican reglas de negocio) y Repositorios (ejecutan consultas con Prisma ORM sobre PostgreSQL).
* **Modelo de Negocio (DDD Simplificado):** Las clases e interfaces hablan el idioma del cliente: `SponsorshipWallet` (Bolsa de Dinero), `CostStructure`, `TicketStructure` y `Enrollment`.
* **Seguridad Financiera y Concurrencia (ACID):** Todas las asignaciones y donaciones del Motor de Patrocinios emplean transacciones de base de datos (`$transaction` en Prisma) para prevenir la corrupción de la contabilidad general de ingresos.
* **Seguridad por Inquilino (RBAC/ABAC):** La seguridad y el multi-tenancy a nivel lógico descansan en el `organizationId` indexado, previniendo que una organización acceda al evento `sequentialId` o transacciones de otra.

## Multi-Tenancy Arquitectónico
* **Dos Dashboards:** Una entrada para el *Global Admin* (que gestiona `PaymentMethod` globales y `EventStatusType` en `AdminMaintenancePage`) y otra para los *Organization Members* (que operan `Person`, `Event` y `OrganizationPaymentMethod`).
* **Segregación:** Toda la lógica de backend inyectará este `organizationId` para aislar el flujo de datos.

## Excelencia Frontend (React + Vite + Tailwind)
* **Accesible y Moderno (2025):** Creación de interfaces responsivas y agradables, que no solo "funcionen" sino que deleiten (usando la paleta Contemporánea y Espiritual).
* **Manejo de Estado Centralizado:** Empleo de enrutadores declarativos (react-router-dom) y sincronización del estado de la URL con la navegación, facilitando enlaces directos (`/admin/payment-methods`).

## Prácticas de Código y Colaboración
* **Revisión Continua (Pull Requests):** Prettier, ESLint, TypeScript estricto, y pruebas unitarias/integración (Jest/Vitest). Todo cambio contable requiere máxima cobertura.
* **Documentación Viva:** Mantener estos archivos (Arquitectura y Planes) siempre alineados con la base de datos real y el stack en uso.
