# Plan de Módulo 5: Arquitectura Financiera Centralizada (Registro y Asignación)

¡Bienvenido al rediseño del corazón financiero de CongregaApp! Hemos optimizado la manera en la que el sistema maneja el dinero para brindar la máxima flexibilidad y transparencia a las organizaciones.

El modelo anterior asumía que un pago era directamente un abono a una inscripción. El **nuevo modelo** separa este proceso en dos etapas distintas: **Registrar** el ingreso de dinero y luego **Asignarlo** (a una persona, a un evento, o simplemente mantenerlo a favor). Esto nos permite soportar escenarios complejos, como donaciones generales, aportes para un evento específico, o un padre pagando las entradas de sus dos hijos con una sola transferencia.

---

## 1. La Billetera Centralizada (`Wallet`)

El concepto de "Bolsa de Patrocinios" (`SponsorshipWallet`) ha evolucionado hacia una **Billetera Centralizada** o **Wallet** genérica. Toda transacción de ingreso de dinero (transferencias, Zelle, efectivo) aterriza primero aquí.

*   **Identificador de Origen:** La Wallet y/o las transacciones entrantes deben tener una forma de identificar el origen de los fondos (ej. `DONATION` para donaciones externas, `PAYMENT` para pagos regulares de inscripciones, `MEMBER_CONTRIBUTION` para aportes de miembros).
*   **Fondos sin Asignar:** Si recibimos un pago de $100 y solo asignamos $80 a actividades, los $20 restantes quedan en la Wallet como "saldo a favor" pendiente por asignar.

## 2. Flujo de Dos Pasos: Registro y Asignación

### Paso 1: Registro del Pago (Ingreso a la Wallet)
Cuando entra dinero, se registra una **Transacción de Ingreso** apuntando a una Wallet.
*   **Tabla de Estados (No Enum):** El estado de esta transacción **no** será un Enum estático. Existirá una tabla de base de datos dedicada a los estados de transacción (`TransactionStatus`), que contendrá registros como:
    *   `Por Conciliar`: El pago fue reportado por el usuario pero no verificado en banco.
    *   `Conciliado`: El dinero es efectivo y validado.
    *   `Rechazado`: El pago no procedió o es inválido.
*   Hasta que este ingreso no esté en estado `Conciliado`, el dinero no se considera efectivo ni afecta los saldos reales de la organización.

### Paso 2: Asignación (Allocation)
Una vez que el dinero está en la Wallet (y preferiblemente conciliado), se pueden generar **Transacciones de Asignación** (Allocations). El dinero sale de la Wallet y se asigna a distintos objetos del sistema:
*   **Asignado a Nada:** El dinero se queda en la Wallet (ej. una donación a fondo perdido).
*   **Asignado a una Actividad (Evento):** El dinero va directo al presupuesto del evento (ej. la iglesia dona $50 específicamente para el "Retiro de Jóvenes"). Es un abono a favor del evento, no de una persona.
*   **Asignado a una Persona (Inscripción/Enrollment):** El dinero va a pagar el cupo de un asistente. Si un padre transfiere $70, se hace un registro de pago de $70 a su Wallet, y luego se hacen dos asignaciones: $35 a la inscripción del Hijo A y $35 a la inscripción del Hijo B.

---

## 3. Dinámica de Tickets e Inscripciones (`Enrollment`)

Ahora, el modelo `Enrollment` (Inscripción) está íntimamente ligado al tipo de entrada que elige la persona.

*   **Relación Directa:** La inscripción (`Enrollment`) tiene una relación directa con el ticket seleccionado (`TicketStructure`).
*   **Deuda Inicial (`totalCost`):** Al elegir un ticket (ej. "Entrada General" de $20), la deuda de esa inscripción es exactamente $20.
*   **Abonos:** Cuando se le asigna dinero de una Wallet a esta inscripción, el saldo deudor disminuye. Si se le asignan los $20, la inscripción queda "Pagada/Solvente".
*   **Cambios de Ticket (Upgrades):** Si la persona decide cambiar su entrada "General" ($20) por una "VIP" ($50), simplemente actualizamos la relación en su inscripción para que apunte al nuevo `TicketStructure`. Su `totalCost` sube a $50. Como los abonos ($20) ya estaban registrados y asignados a su inscripción, el sistema calcula automáticamente que la nueva deuda pendiente es de $30.

## 4. Estados Sincronizados (Pendiente de Conciliación)

Debido a que un pago puede estar "Por Conciliar", las inscripciones y los fondos de los eventos deben reflejar esto de manera amigable.
*   Si una persona inscribe a su hijo y reporta un pago, la inscripción (`Enrollment`) no pasa a estar "Pagada/Aprobada" de inmediato. Entra en un estado de **En Espera** o **Pendiente de Conciliación**.
*   Solo cuando el departamento de finanzas cambia el registro de pago (Transacción de Ingreso) al estado `Conciliado`, la asignación se hace efectiva, y la inscripción pasa automáticamente a estado `Pagado/Aprobado`.

---

## Resumen de Tareas para el Desarrollo

1.  **Refactorizar el Esquema de BD:**
    *   Crear la tabla `TransactionStatus` e insertar los estados (`Por Conciliar`, `Conciliado`, `Rechazado`).
    *   Renombrar `SponsorshipWallet` a `Wallet` genérico.
    *   Añadir el campo `ticketId` en `Enrollment` referenciando a `TicketStructure`.
    *   Ajustar `Transaction` para manejar el registro a la Wallet y la asignación (`Allocation`) hacia un `Event` o un `Enrollment`.
2.  **Actualizar la Lógica de Negocio:**
    *   Crear endpoints separados para: a) Registrar un pago (Ingreso). b) Asignar dinero de una Wallet a Eventos o Inscripciones.
    *   Automatizar el cálculo de deudas y saldos pendientes en la vista del usuario en base a la sumatoria de las asignaciones versus el precio del `TicketStructure`.
3.  **UI/UX (Frontend):**
    *   Crear una interfaz para que el usuario pueda reportar pagos a su Wallet y luego seleccionar a quién o a qué evento asignarlos.
    *   Mostrar claramente qué pagos están "Por Conciliar" y cuáles han sido "Conciliados" exitosamente.
