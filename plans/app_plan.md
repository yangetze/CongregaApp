# Plan General de la Aplicación

¡Hola! Bienvenido a la visión de CongregaApp. 🚀

## Visión del Producto
CongregaApp es un SaaS B2B moderno (pensado con una estética 2025) enfocado en la gestión financiera, administrativa y logística de eventos para organizaciones como iglesias, campamentos, retiros y convenciones.
Queremos resolver los problemas más críticos de nuestros clientes con un tono comercial pero con cercanía, facilitándoles la vida: control de cupos (tickets), estructuración de presupuestos por tipo de asistente (Staff o Participante) y la gestión de cuentas por cobrar (abonos fraccionados, donaciones y asignación de fondos). En el futuro, cubriremos también la logística del evento y el control de cuentas por pagar a proveedores.

## Arquitectura del Sistema
El sistema sigue una arquitectura robusta Cliente-Servidor (Backend API y Frontend SPA).

* **Frontend:** React, Vite, Tailwind CSS, react-router-dom, y lucide-react. Diseñado para ser altamente accesible y con una interfaz "Contemporánea y Espiritual".
* **Backend:** Node.js (Express) y Prisma (nuestro ORM de confianza por su tipado fuerte y facilidad de migraciones). Stack PERN.
* **Base de Datos:** PostgreSQL. Ideal para mantener la integridad relacional de datos contables y nuestra arquitectura multi-tenant.
* **Patrón Arquitectónico:** RESTful API orientada a recursos.

## Multi-Tenancy y Dashboards
El sistema utiliza un enfoque Multi-tenant basado en la entidad `Organization`. La aplicación cuenta con una arquitectura de interfaz de usuario de doble entrada:
1. **Dashboard de Administrador Global:** Para gestionar organizaciones y métricas globales (ej. total de usuarios activos globales), y mantener los catálogos globales como Métodos de Pago y Estados de Evento.
2. **Dashboard de Organización:** Específico para cada inquilino, donde gestionan sus eventos, estadísticas (total recaudado, total inscrito, capacidad), y su base de datos particular.

Es crucial entender la separación de roles en la base de datos:
* **`User`:** Administradores del sistema que acceden a los dashboards (Globales o de Organización).
* **`Person`:** Los asistentes y personal (el directorio CRM), identificados por su `documentId` (cédula) para evitar duplicados en las inscripciones a eventos.

## Estructura de Módulos (Roadmap)

### Fase 1: MVP
* **Módulo 1: Módulo de Personas (Directorio / CRM).** Gestión centralizada de la base de datos de asistentes (Person). Registro de datos como cédula, nombre, correo, teléfono y cálculo dinámico de la edad a partir de la fecha de nacimiento.
* **Módulo 2: Configuración de Eventos y Presupuestos.** Creación de eventos (con su `sequentialId` único, ej. "Evento #1") y estados (Borrador, Activo, Realizado, Cancelado). Configuración de reglas de inscripción dinámicas (JSON `requirements`), estructuración de costos (`hasCost`, `CostStructure`), y manejo de tickets (`TicketStructure`). Asignación automática de organizadores como `STAFF` y asistentes como `PARTICIPANT`.
* **Módulo 3: Cuentas por Cobrar (Ingresos y Abonos).** Arquitectura de pagos en dos niveles (Catálogo global y configuración por organización en JSON). Registro de transacciones con estados ('pendiente/por conciliar', 'conciliado', 'rechazado'). Motor de Patrocinios para el manejo amigable y transparente de donaciones y subsidios.

### Fase 2: Visión a Futuro
* **Módulo 4: Logística y Registro del Participante.** Ficha médica global y por evento, asignación a grupos logísticos, y control de Check-in/Check-out.
* **Módulo 5: Cuentas por Pagar (Egresos y Proveedores).** Gestión de proveedores del evento y registro de compromisos.
