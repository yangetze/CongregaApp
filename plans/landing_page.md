# Plan de Landing Page

## Visión General
La Landing Page es la puerta de entrada principal para instituciones, iglesias y campamentos que desean conocer CongregaApp. Su objetivo es convertir visitantes en prospectos o usuarios activos.

El tono de comunicación debe ser **comercial pero con cercanía**, demostrando empatía con las necesidades de la comunidad mientras se mantiene una imagen profesional de una solución SaaS B2B sólida.

El diseño UX/UI utilizará la paleta "Contemporánea y Espiritual" (Violeta profundo, Naranja coral, Gris perla), e integrará **movimientos sutiles pero interactivos** (como efectos de hover suaves, apariciones tipo *fade-in* al hacer scroll y micro-animaciones en botones) que brinden una experiencia moderna (estética 2025) sin sobrecargar al usuario.

## Estructura de Secciones

### 1. Barra de Navegación (Header)
- **Logotipo:** CongregaApp (lado izquierdo).
- **Enlaces rápidos:** Características, Cómo funciona, Testimonios, FAQ.
- **Botones de Acción (Derecha):**
  - `Iniciar sesión`: Botón secundario o enlace fantasma.
  - `Registrarse`: Botón principal (Naranja coral) llamativo para el llamado a la acción.
- **Comportamiento:** Fijo (sticky) en la parte superior con un ligero efecto de sombra o desenfoque (glassmorphism) al hacer scroll.

### 2. Sección Hero (Inicio)
- **Mensaje Principal:** Titular potente y acogedor que resalte el valor principal (ej. "Organiza tus eventos con propósito y sin complicaciones").
- **Subtítulo:** Una breve descripción que conecte con el usuario (ej. "La plataforma integral para iglesias y campamentos que simplifica la gestión, las finanzas y la logística, para que te enfoques en lo verdaderamente importante").
- **Llamado a la Acción (CTA):** Botón principal para "Comienza gratis" o "Crea tu organización".
- **Visual:** Un mockup sutilmente animado (flotando suavemente) de los dashboards (Global o de Organización) o una ilustración amigable.

### 3. Características Destacadas (Features)
- **Estructura:** Grid de tarjetas interactivas. Al pasar el cursor (hover), las tarjetas deben tener una elevación suave y cambiar sutilmente el tono de sus bordes o iconos.
- **Puntos a destacar:**
  - *Gestión de Eventos:* Creación ágil, control de aforos y estados.
  - *Control Financiero:* Pasarelas de pago, abonos fraccionados, y gestión de donaciones (patrocinios).
  - *Directorio y CRM:* Base de datos unificada sin registros duplicados (vía `documentId`).

### 4. Cómo Funciona (Paso a Paso)
- **Visualización:** Una línea de tiempo (timeline) vertical u horizontal que se va iluminando (scroll-triggered animation) a medida que el usuario baja.
- **Pasos:**
  1. Registra tu organización.
  2. Crea y personaliza tu primer evento.
  3. Invita a tu comunidad y recibe inscripciones/pagos.
  4. Disfruta del evento con métricas en tiempo real.

### 5. Sección de Confianza / Testimonios
- **Carrusel o Grid:** Mostrar citas breves de líderes de iglesias y directores de campamentos que ya utilizan la plataforma.
- **Estilo:** Fotos de perfil con nombres y cargos, acompañados de estrellas de calificación. Transiciones suaves entre testimonios.

### 6. Preguntas Frecuentes (FAQ)
- **Formato:** Acordeón (Accordion). Solo una pregunta se expande a la vez, con una transición suave (ease-in-out) para mostrar la respuesta.
- **Preguntas sugeridas:**
  - ¿Cómo gestionan los pagos y comisiones?
  - ¿Puedo tener diferentes roles en mi equipo de trabajo?
  - ¿Cómo evitan que una misma persona se registre varias veces?
  - ¿Es posible aplicar subsidios o patrocinios a los asistentes?

### 7. Llamado a la Acción Final (Pre-footer)
- **Diseño:** Un bloque destacado con fondo de color primario (Violeta profundo) y texto en contraste.
- **Mensaje:** "Únete a la nueva era en la administración de eventos. Empieza hoy mismo y transforma tu organización."
- **Botón:** "Registrarse ahora".

### 8. Pie de Página (Footer)
- **Secciones:** Enlaces legales (Términos y condiciones, Política de privacidad), Enlaces de soporte (Centro de ayuda, Contacto) y Redes sociales.
- **Tono:** Agradecimiento final, manteniendo la estética limpia y ordenada.

## Especificaciones Técnicas (Animaciones y UI)
- Usar librerías como Framer Motion o Tailwind CSS (utilidades de transición) para lograr animaciones consistentes de menos de 300ms de duración.
- **Interacciones:** Efectos hover que inviten a hacer clic en toda área clickeable (botones, tarjetas, elementos del menú).
- Accesibilidad (A11y) como pilar, garantizando buen contraste de texto y navegación por teclado fluida.
