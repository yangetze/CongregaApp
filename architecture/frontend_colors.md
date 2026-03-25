# Paleta de Colores: "Contemporánea y Espiritual"

¡Bienvenidos a la guía de estilo de color de CongregaApp! 🎨

Como parte de nuestra arquitectura visual, hemos elegido una paleta de colores que transmite **propósito, calidez y modernidad**. Sabemos que nuestra app será usada tanto por líderes adultos como por jóvenes, y queremos que todos se sientan inspirados y cómodos mientras gestionan sus eventos.

A continuación, te presentamos nuestra paleta principal y los colores de estado obligatorios para el dashboard.

## 🌟 Paleta Principal (Violeta y Naranja)

Esta combinación crea una interfaz moderna y atractiva: el violeta aporta un toque de espiritualidad y profundidad, mientras que el naranja coral inyecta energía y llama a la acción.

| Rol | Color | Hex | Descripción |
| :--- | :--- | :--- | :--- |
| **Primario (Brand)** | Violeta Profundo | `#4C1D95` | Fuerte y distintivo. Ideal para la marca, headers y menús laterales. |
| **Secundario (Acentos)** | Naranja Coral | `#FB923C` | Perfecto para llamadas a la acción (CTAs) como "Registrar Abono" o "Nuevo Evento". Atrae la mirada al instante. |
| **Fondo (Background)** | Gris Perla | `#F9FAFB` | Un color suave para el fondo general de la aplicación, evitando cansar la vista. |
| **Líneas y Bordes** | Gris Claro | `#E5E7EB` | Útil para separar discretamente filas en tablas de participantes o tarjetas de información. |

---

## 🚦 Colores de Estado (Dashboard)

Dado que CongregaApp maneja un motor de "Cuentas por Cobrar" y temas financieros, necesitamos colores semánticos muy claros para comunicar el estado de las finanzas y los cupos de un vistazo.

| Estado | Color | Hex | Uso en el Dashboard |
| :--- | :--- | :--- | :--- |
| **Éxito** | Verde Esmeralda | `#10B981` | Solvente, Pago Completo, Meta Alcanzada. |
| **Alerta** | Amarillo Mostaza | `#F59E0B` | Pago Iniciado, Pendiente, Atención Requerida. |
| **Peligro** | Rojo Carmesí | `#EF4444` | Deuda, Cupo Bloqueado, Error en la transacción. |
| **Informativo** | Azul Turquesa | `#06B6D4` | Patrocinios disponibles, Información general. |

---

## 💻 Ejemplos de Implementación (Tailwind CSS)

En nuestro frontend (React + Tailwind CSS), configuraremos estos colores en el archivo `tailwind.config.js`. Aquí te mostramos cómo se verían aplicados en el código:

### Configuración en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4C1D95', // Violeta Profundo
          accent: '#FB923C',  // Naranja Coral
        },
        surface: {
          background: '#F9FAFB', // Gris Perla
          border: '#E5E7EB',     // Gris Claro
        },
        status: {
          success: '#10B981', // Verde Esmeralda
          warning: '#F59E0B', // Amarillo Mostaza
          danger: '#EF4444',  // Rojo Carmesí
          info: '#06B6D4',    // Azul Turquesa
        }
      }
    }
  }
}
```

### Ejemplo de uso en un componente React:

```jsx
// Botón de Acción Principal (CTA)
<button className="bg-brand-accent hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
  Registrar Abono
</button>

// Tarjeta de Estado de Cuenta (Solvente)
<div className="bg-white border border-surface-border p-4 rounded shadow">
  <h3 className="text-brand-primary font-semibold">Estado de Cuenta</h3>
  <p className="text-status-success mt-2">Solvente (Pago Completo)</p>
</div>

// Fila de Tabla
<tr className="border-b border-surface-border hover:bg-surface-background">
  <td className="py-2 px-4 text-gray-800">Juan Pérez</td>
  <td className="py-2 px-4 text-status-warning">Pago Pendiente</td>
</tr>
```

¡Con estos colores, aseguramos que CongregaApp no solo funcione increíble, sino que también se vea espectacular! ✨
