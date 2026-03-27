# Paleta de Colores: "Contemporánea y Espiritual"

¡Bienvenidos a la guía de estilo de color de CongregaApp! 🎨

Como parte de nuestra arquitectura visual enfocada en una **estética moderna de 2025**, hemos elegido una paleta de colores que transmite propósito, calidez y modernidad. Queremos que líderes y jóvenes se sientan inspirados y cómodos gestionando sus eventos gracias a una UI altamente accesible.

## 🌟 Paleta Principal

Nuestra paleta combina profundidad con energía, creando interfaces claras y vibrantes.

| Rol | Color | Hex | Descripción |
| :--- | :--- | :--- | :--- |
| **Primario (Brand)** | Violeta Profundo | `#4C1D95` | Aporta espiritualidad y profundidad. Usado en headers, marca y menús. |
| **Secundario (Accent)** | Naranja Coral | `#FB923C` | Inyecta energía. Ideal para botones clave y llamadas a la acción (CTAs). |
| **Fondo (Background)**| Gris Perla | `#F9FAFB` | Color neutro y suave, previene la fatiga visual al usar la aplicación por horas. |
| **Bordes (Borders)** | Gris Claro | `#E5E7EB` | Separadores limpios y sutiles para tarjetas, tablas y modales. |

---

## 🔘 Botones y Llamadas a la Acción (CTAs)

Para mantener una consistencia visual en toda la aplicación, se han establecido las siguientes reglas para los botones de acción principales:

**1. Color de Botones Principales:**
Todos los botones de acción principales (como crear o registrar entidades) deben utilizar el color **Secundario (Accent) - Naranja Coral (`#FB923C`)** por defecto.
En el sistema de componentes (`Button.tsx`), la variante `default` corresponde a este color (`bg-brand-accent`). Se debe evitar el uso de otras clases como `bg-brand-primary` (morado) para estas acciones principales.

**2. Convención de Textos:**
- **Regla General:** Para la creación de cualquier entidad, el texto del botón debe seguir el formato **"Crear {NombreDelModuloEnSingular}"**. Ejemplos: "Crear Evento", "Crear Persona", "Crear Organización".
- **Excepción en Finanzas:** En el módulo de finanzas y pagos, debido a la naturaleza de la acción, el texto debe ser **"Registrar {NombreDeLaAccion}"**. Ejemplo: "Registrar Pago".

---

## 🚦 Colores de Estado Semánticos

Para facilitar la rápida lectura de la información en el Dashboard y las listas del CRM, hemos definido colores mandatorios. Son vitales para comunicar estados financieros, disponibilidad de tickets y alertas sin necesidad de leer todo el texto.

| Estado | Color | Hex | Uso en el Dashboard |
| :--- | :--- | :--- | :--- |
| **Éxito (Success)** | Verde Esmeralda | `#10B981` | Pago Conciliado, Solvente, Evento Activo, Cupos Disponibles. |
| **Alerta (Warning)** | Ámbar / Mostaza | `#F59E0B` | Pago Pendiente, Por Conciliar, Evento en Borrador, Atención Requerida. |
| **Peligro (Danger)** | Rojo Carmesí | `#EF4444` | Deuda, Transacción Rechazada, Evento Cancelado, Sin Cupos. |
| **Info (Info)** | Azul Turquesa | `#06B6D4` | Notificaciones generales, Asignaciones del Motor de Patrocinio. |

---

## 💻 Implementación en Tailwind CSS

En nuestro stack frontend (React + Vite + Tailwind), estos colores se integran fluidamente en el `tailwind.config.js`. ¡Con `lucide-react` para los íconos, la combinación es simplemente espectacular!

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4C1D95',
          secondary: '#FB923C',
        },
        surface: {
          background: '#F9FAFB',
          border: '#E5E7EB',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#06B6D4',
        }
      }
    }
  }
}
```
