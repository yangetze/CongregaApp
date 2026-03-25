# Arquitectura Responsiva (Frontend)

## 1. Stack Tecnológico Frontend
La aplicación web CongregaApp está construida sobre un stack moderno y eficiente para el 2025:
- **Core:** React, Vite (empaquetado rápido).
- **Estilos:** Tailwind CSS.
- **Enrutamiento:** react-router-dom.
- **Íconos:** lucide-react (proporciona íconos limpios y escalables).

## 2. Principio Mobile-First y Accesibilidad
El diseño sigue estrictamente el principio **mobile-first**. Los estilos base en Tailwind (sin prefijos como `md:` o `lg:`) aplican a los dispositivos móviles. Esto garantiza que la plataforma, donde una gran parte de los administradores e inscritos operarán desde sus teléfonos, funcione de manera impecable y rápida.

## 3. Breakpoints de Tailwind CSS
Mantenemos la simplicidad de los breakpoints estándar de Tailwind:
- **sm**: `640px` (Móviles grandes y tablets pequeñas en vertical)
- **md**: `768px` (Tablets y pantallas medianas)
- **lg**: `1024px` (Laptops y computadoras de escritorio)
- **xl**: `1280px` (Pantallas grandes)

## 4. Patrones de Diseño Responsivo para Dashboards
- **Navegación Multinivel (App.tsx & React Router):**
  - **Móvil (< md):** El menú lateral (`aside`) desaparece a favor de un *Header* superior con botón hamburguesa (`Menu` de `lucide-react`) que abre un *Drawer*.
  - **Escritorio (>= md):** El menú lateral queda fijado (`md:flex`), aprovechando el ancho disponible para presentar la jerarquía de rutas.
  - Para los Mantenimientos Globales (`AdminMaintenancePage`), empleamos pestañas horizontales (`tabs`) sincronizadas directamente con las rutas de `react-router-dom` (ej. `/admin/payment-methods`), lo cual funciona perfectamente en todos los dispositivos usando `overflow-x-auto`.

- **Grillas de Estadísticas:**
  - Las tarjetas de KPI del Dashboard (ej. Total Recaudado, Capacidad, Total Inscritos) usan una grilla responsiva: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` o `lg:grid-cols-4`.
  - Agrupadores de títulos y botones de acción (como "Crear Evento #1") se apilan en móvil (`flex-col`) y se expanden horizontalmente en escritorio (`sm:flex-row`).

- **Tablas de CRM e Ingresos:**
  - Listas largas (como el directorio de `Personas` o el historial de transacciones) obligatoriamente se envuelven en `<div className="overflow-x-auto">` para prevenir que la UI colapse en teléfonos estrechos.

## 5. Elementos de Interfaz
- Aseguramos la mejor experiencia de usuario con un área táctil mínima (44x44px) en pantallas pequeñas.
- Las ventanas modales o diálogos no desbordan el ancho del dispositivo; se utiliza la clase `max-w-[90vw]` junto a anchos específicos para escritorio.
