# Lógica Crítica: El Motor de Finanzas y Patrocinios ("Bolsas de Dinero" o Wallets)

¡El Motor de Finanzas es la joya de la corona en CongregaApp! Sabemos que muchas personas asisten a los eventos gracias al apoyo de donantes, padrinos, o simplemente porque otra persona (ej. un padre) paga por múltiples asistentes a la vez. El gran reto de las organizaciones es que ese dinero a veces se desvía, y la contabilidad global deja de cuadrar.

> **Nota:** Este documento ha sido actualizado para reflejar la nueva arquitectura de dos pasos detallada en `plans/module_5_financial_allocations.md`.

Aquí explicamos de manera sencilla cómo resolvemos este problema de forma precisa utilizando el concepto de `Wallet` (Billeteras).

## 1. La "Bolsa" o Billetera (`Wallet`)

Imagina la "Bolsa" como una alcancía o una cuenta temporal. Todo dinero que ingresa al sistema (ya sea un pago regular por una entrada, una donación gigante, o un fondo de la iglesia) aterriza primero aquí. **Aún no se le ha adjudicado a ninguna persona ni a ningún evento de manera final.**

* Si alguien dona de buen corazón \$1,000 para el retiro, ese ingreso queda registrado en una `Transaction` de tipo `WALLET_DEPOSIT`. Esa transacción señala directamente a una bolsa (`walletId`) recién creada o existente.
* De inmediato, la bolsa (`Wallet`) incrementa su valor `totalReceived` a \$1,000, convertido siempre a la moneda base de la organización (ej. USD) usando la tasa de cambio del momento.
* **Importante:** Este dinero no es oficial hasta que la transacción cambie su estado a `Conciliado` en nuestra tabla `TransactionStatus`.

## 2. El Proceso de Asignación (Hacer magia con los fondos)

Una vez que el dinero está conciliado en la Wallet, el Administrador o el usuario mismo decide a dónde va ese dinero. Ejecutamos una **asignación (Allocation)**.

### ¿A dónde puede ir el dinero?
1. **A una Inscripción (`enrollmentId`):** Para pagar el cupo de una o varias personas (ej. un padre paga las entradas de sus dos hijos desde su Wallet).
2. **A un Evento (`eventId`):** Para sumar fondos directamente al presupuesto del retiro (ej. donación para logística, no para pagar un cupo específico).
3. **A nada (Saldo a Favor):** El dinero simplemente se queda en la bolsa para uso futuro.

### ¿Cómo lo mantenemos seguro?
1. **Verificar el saldo:** Nos aseguramos de que el dinero a asignar (`amountBase`) no sobrepase lo que realmente hay disponible en la bolsa (`totalReceived - totalAllocated`). ¡Nada de quedar en rojo!
2. **Registro Claro:** Se genera un movimiento de salida de la bolsa tipo `WALLET_ALLOCATION`.
   * Aquí **sí asociamos** al beneficiado (`enrollmentId` o `eventId`).
   * Y **también apuntamos** a la bolsa de donde salió el dinero (`walletId`).
3. **Todo de un solo golpe (ACID):**
   * Si va a una inscripción, el participante (`Enrollment`) ahora refleja que se le ha abonado parte de su deuda (`totalPaid`).
   * La bolsa aumenta su `totalAllocated` (lo que ya gastamos o asignamos).
   * Todo pasa simultáneamente. Si hay algún error informático, se revierte todo, sin que el dinero se pierda en el limbo.

### ¿Por qué la contabilidad no sufre descuadres?
La magia de esta arquitectura está en los reportes financieros. Para reportar los *ingresos reales* que cayeron a la cuenta bancaria de la organización, **solo contamos los depósitos a la billetera (`WALLET_DEPOSIT`) que estén en estado `Conciliado`**.
Los movimientos de `WALLET_ALLOCATION` son simplemente "dinero pasando de la bolsa a un cupo o evento". Al ignorarlos de los ingresos globales bancarios, prevenimos el temido conteo doble de dinero, pero logramos que la deuda del usuario en el sistema llegue a cero de manera perfecta.

## 3. ¿Qué pasa con los sobrantes?
Si el Evento "Retiro #1" terminó y la bolsa quedó con \$200 libres, el sistema permite que el administrador convierta esta bolsa a nivel Organización.
* **Solución Rápida:** Basta con poner el `eventId` de esa bolsa como `null`. De repente, esos \$200 están listos para apoyar a alguien en el próximo campamento, con total transparencia y rastreabilidad.
