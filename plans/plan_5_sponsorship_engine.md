# Plan 5: Motor de Patrocinios y Bolsas de Dinero

## Contexto de Negocio
El "Motor de Patrocinios" es la herramienta financiera de CongregaApp que permite gestionar donaciones ("Bolsa de Dinero").
Con este módulo, un administrador de la organización puede registrar el ingreso de fondos de donantes anónimos, organizaciones aliadas, o aportes propios ("Recibir Donación"), y asignar o "fraccionar" dichos fondos a los participantes inscritos en un evento ("Asignar de la Bolsa").

Los fondos se depositan en un `Wallet` o Monedero de Patrocinio (a nivel de Organización o ligado a un Evento).
Este enfoque mantiene la contabilidad transparente: no descuadra el ingreso oficial de caja de la organización, permitiendo que las inscripciones marquen como "pagadas" ciertas deudas, sin registrar un abono falso.

## Tareas Funcionales a Desarrollar

### Tarea 5.1: Recibir Donación en la Bolsa (`POST /api/sponsorships`)
- **Descripción:** Desarrollar el endpoint que permite el ingreso de fondos no asignados a un participante.
- **Lógica de Fondos:**
  - El fondo puede ser global o destinado a un evento (`eventId` opcional).
  - Al igual que un pago directo, soporta divisa y tasa de cambio, pero se destina a un `SponsorshipWallet`.
  - Debe aumentar el saldo global o específico de este Monedero (Bolsa) y registrar una transacción tipo `DONATION`.
- **Tests Requeridos:**
  - `[Test]` Validar que se crea correctamente una transacción de tipo `DONATION` que incrementa el saldo del Monedero asignado a la organización o evento específico.
  - `[Test]` Validar que no se puede donar a eventos que pertenezcan a otras organizaciones (`organizationId`).

### Tarea 5.2: Asignar Dinero de la Bolsa a Deudores (`POST /api/sponsorships/:walletId/allocate`)
- **Descripción:** El administrador toma un monto específico (`amountBase`) del Monedero y lo destina a amortizar la deuda de un inscrito (`Enrollment`).
- **Lógica de Fraccionamiento (ACID Transaccional):**
  - Este es un proceso transaccional estricto (uso de `$transaction` de Prisma).
  - El sistema descuenta el `amountBase` del `SponsorshipWallet` (Monedero).
  - Al mismo tiempo, registra una transacción especial de asignación (`SPONSORSHIP_ALLOCATION`) vinculada al `Enrollment`.
  - Esta transacción incrementa el saldo a favor (`totalPaid`) de la inscripción, como si fuera un abono directo, solventando total o parcialmente su deuda.
  - **Restricción de Concurrencia:** El sistema debe evitar una sobreasignación (Asignar más fondos de los que dispone el monedero o asignar más fondos de los que debe el inscrito).
- **Tests Requeridos:**
  - `[Test]` Validar que, si la asignación es exitosa, se resta exactamente el `amountBase` del Monedero de la Organización/Evento, y se suma la misma cantidad al `totalPaid` del `Enrollment`.
  - `[Test]` Prueba de validación de saldos: Debe arrojar un error ("Fondos Insuficientes") si se intenta asignar un monto mayor al que posee actualmente la bolsa.
  - `[Test]` Prueba de límite de pago: Debe arrojar un error si se intenta asignar a un participante un monto que excede la deuda restante (ej. Debe $50 e intentan asignarle $60 desde la bolsa).
