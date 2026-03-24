# Lógica Crítica: El Motor de Patrocinios ("Bolsa de Dinero")

El Motor de Patrocinios es una de las funcionalidades más críticas para garantizar que los fondos no se pierdan ni se desvíen de la contabilidad oficial de la organización. A continuación, detallo la lógica de cómo se modela y maneja este sistema en la base de datos sin descuadrar la contabilidad general.

## 1. Naturaleza de la "Bolsa" (SponsorshipWallet)

La "Bolsa" (modelo `SponsorshipWallet`) no es más que una cuenta contable temporal que retiene fondos que han ingresado a la organización (o a un evento en particular) pero que aún **no han sido facturados/asociados al estado de cuenta de ningún usuario**.

* Si un donante regala \$1,000 para el campamento, este dinero se registra en la tabla `Transaction` con `type = DONATION` y `walletId` apuntando a la bolsa correspondiente. El `enrollmentId` queda nulo, ya que no pertenece a ningún inscrito todavía.
* La bolsa incrementa su campo `totalReceived` en \$1,000 (ya convertido a la moneda base, ej. USD).

## 2. El Proceso de "Asignación" (Allocation)

Cuando el administrador decide subsidiar a un Staff o cubrir la "Media Matrícula" de un inscrito, ejecuta un **fraccionamiento de la bolsa**.

### Reglas de Negocio en la Asignación:
1. **Validación de Disponibilidad:** El sistema verifica que el monto a asignar (`amountBase`) no exceda el saldo disponible de la bolsa (`totalReceived - totalAllocated`).
2. **Registro de la Transacción Interna:** Se crea una nueva entrada en la tabla `Transaction` con `type = SPONSORSHIP_ALLOCATION`.
   * Esta transacción **sí tiene** `enrollmentId` (apunta al usuario beneficiado).
   * Esta transacción **también tiene** `walletId` (apunta a la bolsa origen de los fondos).
3. **Actualización de Saldos (Transacción de Base de Datos - ACID):**
   * El `Enrollment` del beneficiado incrementa su `totalPaid` con el monto asignado.
   * El `SponsorshipWallet` incrementa su `totalAllocated` con el monto asignado.

### ¿Por qué esto cuadra la contabilidad?
La contabilidad global (Ingresos Totales de la Organización/Evento) **solo suma las transacciones de tipo `DIRECT_PAYMENT` y `DONATION`**.
Las transacciones de tipo `SPONSORSHIP_ALLOCATION` **no son ingresos nuevos de dinero** al sistema, sino simplemente un movimiento interno (un asiento contable) de una bolsa a la deuda de un usuario. Por lo tanto, al generar un reporte de ingresos reales de dinero a las cuentas bancarias de la organización, no se duplican los montos.

## 3. Sobrantes Globales (Multi-tenancy)
Si al finalizar un evento, una bolsa (`SponsorshipWallet` con `eventId != null`) queda con un saldo disponible (ej. \$200 no asignados), el administrador puede realizar un "traspaso" a la bolsa global de la organización.

* **Traspaso:** Se podría implementar simplemente poniendo el `eventId` de la bolsa a `null` (lo cual la convierte automáticamente en una bolsa global para futuros eventos de la organización).
* Alternativamente, se puede registrar una salida de la bolsa del evento y una entrada a la bolsa global, manteniendo la trazabilidad perfecta de que los fondos sobrantes del Evento A ahora están disponibles para el Evento B.
