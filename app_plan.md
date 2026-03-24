# Plan General de la Aplicación

## Visión del Producto
El producto es un SaaS B2B enfocado en la gestión financiera, administrativa y logística de eventos para organizaciones (iglesias, campamentos, retiros, convenciones).
El desarrollo se enfocará en resolver inicialmente los problemas más críticos: control de cupos, estructuración de presupuestos por tipo de asistente (Staff o Inscrito) y la gestión de cuentas por cobrar (abonos fraccionados, donaciones y asignación de fondos). Posteriormente, se extenderá para cubrir la logística del evento y el control de cuentas por pagar a proveedores.

## Arquitectura del Sistema
El sistema seguirá una arquitectura Cliente-Servidor separada (Backend API y Frontend SPA).

* **Frontend:** React.js, Tailwind CSS, Zustand o Redux Toolkit (para manejo de estado complejo como la "bolsa" de donaciones). (Stack MERN/PERN adaptado)
* **Backend:** Node.js (Express o NestJS), Prisma (como ORM principal por su tipado fuerte y facilidad de migraciones).
* **Base de Datos:** PostgreSQL (Ideal para la integridad relacional de datos contables y multi-tenancy).
* **Patrón Arquitectónico:** RESTful API orientada a recursos, con separación por capas (Controladores, Servicios, Repositorios) o arquitectura Hexagonal/Clean Architecture para asegurar que la lógica crítica (como el Motor de Patrocinios) esté aislada de la infraestructura.

## Multi-Tenancy
El sistema utilizará un enfoque de múltiples inquilinos (Multi-tenant) a nivel lógico (Row-Level Multi-tenancy).
Se introducirá la entidad `Organization` (Iglesia/Campamento principal). Todas las tablas críticas (`Event`, `User`, `Transaction`, `SponsorshipWallet`) tendrán una clave foránea `organizationId` para garantizar el aislamiento de datos. La tasa de cambio oficial se configurará a nivel de Organización.

## Estructura de Módulos (Roadmap)

### Fase 1: MVP
* **Módulo 1: Configuración de Eventos y Presupuestos.** Creación de eventos, metas financieras, desglose de costos y configuración de roles vs tarifas ("Staff" y "Inscrito"). Los roles son específicos por evento, permitiendo a los usuarios rotar sus funciones entre distintas actividades.
* **Módulo 2: Cuentas por Cobrar (Ingresos y Abonos).** Registro de pagos multidivisa fraccionados, estados de cuenta de participantes (Pendiente, Solvente), Motor de Patrocinios (manejo de fondos dedicados y generales), y generación de recibos.

### Fase 2: Visión a Futuro
* **Módulo 3: Logística y Registro del Participante.** Ficha médica global y por evento, asignación a grupos logísticos (cabañas, habitaciones), y control de Check-in/Check-out.
* **Módulo 4: Cuentas por Pagar (Egresos y Proveedores).** Gestión de proveedores del evento, registro de facturas/compromisos y emisión de pagos/abonos a proveedores.
