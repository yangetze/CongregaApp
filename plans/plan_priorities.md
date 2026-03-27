# Prioridades de Ejecución de Planes (MVP Fase 1)

Este documento establece el orden lógico y funcional en el que deben ejecutarse los planes de desarrollo para alcanzar el Producto Mínimo Viable (MVP) de CongregaApp.
Cada plan representa un **Sprint** enfocado en una funcionalidad crítica del sistema.

## Orden de Ejecución

1. **Sprint 1: Módulo de Directorio CRM (`plan_1_crm_directory.md`)**
   - *Por qué es primero:* Es la base de datos de los clientes/asistentes. No podemos tener inscripciones ni eventos funcionales si no tenemos a las personas (`Person`) registradas en el sistema.

2. **Sprint 2: Configuración de Eventos y Presupuestos (`plan_2_events_budgets.md`)**
   - *Por qué es segundo:* Una vez que podemos registrar personas, necesitamos crear los eventos con sus reglas, presupuestos y estructuras de costos. Los eventos son la entidad principal del negocio.

3. **Sprint 3: Inscripciones a Eventos (`plan_3_event_enrollments.md`)**
   - *Por qué es tercero:* Une los Sprints 1 y 2. Permite tomar a las personas del CRM y asignarlas a los eventos (creando las `Enrollment`), generando así la base sobre la que operarán las finanzas (la deuda inicial o `totalCost`).

4. **Sprint 4: Cuentas por Cobrar y Pagos Directos (`plan_4_receivables_payments.md`)**
   - *Por qué es cuarto:* Ahora que las personas están inscritas en eventos y tienen un saldo pendiente, necesitamos la funcionalidad para que registren sus pagos directos, permitiéndoles saldar su deuda.

5. **Sprint 5: Motor de Patrocinios (`plan_5_sponsorship_engine.md`)**
   - *Por qué es quinto:* Es el módulo financiero más avanzado del MVP. Requiere que ya existan eventos, deudas y un sistema de pagos establecido para poder recibir donaciones en una "Bolsa" y fraccionarlas hacia las deudas de participantes específicos.

---
*Nota: Estas funcionalidades son pre-requisito para futuras fases como la de Logística o Cuentas por Pagar.*
