# Lógica Crítica: El Motor de Patrocinios ("Bolsa de Dinero")

¡El Motor de Patrocinios es la joya de la corona en CongregaApp! Sabemos que muchas personas asisten a los eventos gracias al apoyo de donantes y padrinos. El gran reto de las organizaciones es que ese dinero de patrocinio a veces se desvía, y la contabilidad global deja de cuadrar. Aquí explicamos de manera sencilla cómo resolvemos este problema de forma precisa.

## 1. La "Bolsa" (`SponsorshipWallet`)

Imagina la "Bolsa" como una alcancía o una cuenta temporal. Aquí guardamos el dinero que ingresa a la organización o a un evento, pero que **aún no se le ha adjudicado a ninguna persona en particular**.

* Si alguien dona de buen corazón \$1,000 para el retiro, ese ingreso queda registrado en una `Transaction` de tipo `DONATION`. Esa transacción señala directamente a nuestra bolsa (`walletId`). Como no está atada a nadie todavía, no tiene un `enrollmentId`.
* De inmediato, la bolsa (`SponsorshipWallet`) incrementa su valor `totalReceived` a \$1,000, convertido siempre a la moneda base de la organización (ej. USD) usando la tasa de cambio del momento.

## 2. El Proceso de Asignación (Hacer magia con los fondos)

Cuando el Administrador de la Organización decide apoyar a alguien (por ejemplo, cubrirle la mitad de su inscripción a un participante), ejecutamos una **asignación**.

### ¿Cómo lo mantenemos seguro?
1. **Verificar el saldo:** Nos aseguramos de que el dinero a usar (`amountBase`) no sobrepase lo que realmente hay disponible en la bolsa (`totalReceived - totalAllocated`). ¡Nada de quedar en rojo!
2. **Registro Claro:** Se genera un movimiento interno tipo `SPONSORSHIP_ALLOCATION`.
   * Aquí **sí asociamos** al beneficiado (`enrollmentId`).
   * Y **también apuntamos** a la bolsa de donde salió el dinero (`walletId`).
3. **Todo de un solo golpe (ACID):**
   * El participante (`Enrollment`) ahora refleja que se le ha abonado parte de su deuda (`totalPaid`).
   * La bolsa aumenta su `totalAllocated` (lo que ya gastamos).
   * Todo pasa simultáneamente. Si hay algún error informático, se revierte todo, sin que el dinero se pierda en el limbo.

### ¿Por qué la contabilidad no sufre descuadres?
La magia de esta arquitectura está en los reportes financieros. Para reportar los *ingresos reales* que cayeron a la cuenta bancaria de la organización, **solo contamos los cobros directos (`DIRECT_PAYMENT`) y las donaciones (`DONATION`)**.
Los movimientos de `SPONSORSHIP_ALLOCATION` son simplemente "dinero pasando de la bolsa a una cuenta interna". Al ignorarlos de los ingresos globales, prevenimos el temido conteo doble de dinero, pero logramos que la deuda del usuario llegue a cero.

## 3. ¿Qué pasa con los sobrantes?
Si el Evento "Retiro #1" terminó y la bolsa quedó con \$200 libres, el sistema permite que el administrador convierta esta bolsa a nivel Organización.
* **Solución Rápida:** Basta con poner el `eventId` de esa bolsa como `null`. De repente, esos \$200 están listos para apoyar a alguien en el próximo campamento, con total transparencia y rastreabilidad.
