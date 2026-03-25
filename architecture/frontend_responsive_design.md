# Arquitectura Responsiva (Frontend)

## 1. Principio Mobile-First
La aplicación web CongregaApp debe ser diseñada y construida siguiendo el principio de **mobile-first**. Esto significa que los estilos base (sin prefijos) aplican a dispositivos móviles y se usan los breakpoints de Tailwind CSS para adaptar el diseño a pantallas más grandes.

## 2. Breakpoints de Tailwind CSS
Se utilizarán los breakpoints estándar de Tailwind:
- **sm**: `640px` (Móviles en landscape y tablets pequeñas)
- **md**: `768px` (Tablets y pantallas medianas)
- **lg**: `1024px` (Laptops y pantallas de escritorio)
- **xl**: `1280px` (Pantallas de escritorio grandes)

## 3. Patrones de Diseño Responsivo
- **Navegación (Layouts):**
  - **Móvil (< md):** El menú lateral (`aside`) estará oculto. Se utilizará un *header* superior que contenga un botón de "hamburguesa" (usando el ícono `Menu` de `lucide-react`). Al hacer clic, se mostrará un *Drawer* o menú desplegable para la navegación.
  - **Escritorio (>= md):** El menú lateral se mantendrá visible y fijo (`md:flex`), maximizando el uso del espacio horizontal.

- **Grillas y Contenedores:**
  - Las tarjetas de información y estadísticas usarán una grilla responsiva: ej. `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
  - Los contenedores deben usar `flex-col sm:flex-row` cuando agrupen títulos y botones de acción (como el botón "Crear Evento") para que en móviles aparezcan apilados y en escritorio lado a lado.

- **Tablas de Datos:**
  - Las tablas siempre deberán estar envueltas en un contenedor con la clase `overflow-x-auto` para permitir el scroll horizontal en dispositivos móviles, previniendo así que el diseño se rompa o la tabla desborde el viewport de la pantalla principal.

## 4. Elementos de UI
- Los modales, popovers y dropdowns deben adaptarse al ancho del dispositivo móvil, evitando salirse del viewport usando clases como `max-w-[90vw]`.
- En botones se garantizará un área táctil mínima (al menos `44px` x `44px`) en móviles, aunque en pantallas más grandes el diseño pueda ser más compacto.
