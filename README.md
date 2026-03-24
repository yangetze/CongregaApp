# 🏕️ CongregaApp

¡Bienvenido a **CongregaApp**! La solución definitiva para la gestión de eventos, finanzas y logística de iglesias, campamentos, retiros y convenciones.

Sabemos que organizar un gran evento requiere mucho más que buena voluntad: manejar inscripciones, llevar el control de pagos fraccionados, asignar donaciones y organizar la logística puede volverse un verdadero dolor de cabeza. **CongregaApp** nace para simplificar tu día a día, permitiéndote enfocarte en lo verdaderamente importante: **las personas y el propósito de tu evento.**

---

## 🌟 ¿Cómo te ayuda CongregaApp en tu día a día?

Nuestra plataforma está diseñada como un **SaaS Multi-Organización** que te brinda herramientas poderosas pero fáciles de usar:

- **Control total de tus finanzas:** Registra abonos fraccionados, maneja múltiples divisas y mantén el estado de cuenta de cada participante siempre actualizado.
- **Transparencia en donaciones:** Gracias a nuestro innovador **Motor de Patrocinios** ("Bolsa de Dinero"), puedes recibir donaciones globales o para un evento específico y fraccionarlas para becar a participantes, manteniendo la contabilidad oficial cuadrada al centavo.
- **Gestión inteligente de cupos:** Define la capacidad de tus eventos, configura tarifas diferentes según el rol (Staff o Inscrito) y evita sobreventas.
- **Logística sin estrés (Próximamente):** Fichas médicas centralizadas, asignación de cabañas/habitaciones y un rápido check-in/check-out.

---

## 📦 Módulos y Estado Actual

Estamos construyendo CongregaApp por etapas para asegurar la máxima calidad en cada entrega. Aquí te presentamos nuestro mapa de ruta:

**Leyenda de Estados:**
🟢 Terminado | 🟡 En progreso | 🔴 Sin iniciar

### Fase 1: MVP (Producto Mínimo Viable)

#### 1. Módulo de Eventos y Presupuestos (🟡 En progreso)
* Creación de eventos con metas de recaudación y capacidad límite.
* Configuración de estructuras de costos (Ej: Costo Base, Transporte).
* Inscripción de participantes con roles específicos (Staff / Inscrito) y tipos de tarifa (Pago Completo, Media Beca, Patrocinio Total).

#### 2. Módulo de Cuentas por Cobrar e Ingresos (🟡 En progreso)
* Registro de abonos directos multidivisa con tasa de cambio.
* Generación de estados de cuenta detallados por participante.
* **Motor de Patrocinios:** Recepción de donaciones (Bolsa) y asignación de fondos a deudores sin descuadrar la contabilidad general de ingresos.

### Fase 2: Visión a Futuro

#### 3. Módulo de Logística y Registro (🔴 Sin iniciar)
* Ficha médica global y específica por evento (Alergias, condiciones).
* Asignación a grupos logísticos (Cabañas, Habitaciones, Equipos).
* Control de acceso (Check-in / Check-out).

#### 4. Módulo de Cuentas por Pagar (🔴 Sin iniciar)
* Gestión del catálogo de proveedores del evento.
* Registro de facturas, compromisos y conceptos a pagar.
* Emisión de pagos y abonos a proveedores.

---

## 💻 Para Desarrolladores

CongregaApp está construido sobre un stack robusto y moderno orientado a la escalabilidad (**PERN + Prisma**):
- **Frontend:** React.js, Tailwind CSS, Estado Global (Zustand/Redux).
- **Backend:** Node.js (Express), Prisma ORM.
- **Base de Datos:** PostgreSQL (Multi-tenancy a nivel de fila).

### 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu máquina local:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [PostgreSQL](https://www.postgresql.org/) (v14 o superior)
- Un gestor de paquetes (`npm`, `yarn` o `pnpm`)

### 🚀 Instalación y Cómo levantar el proyecto

Sigue estos pasos para tener CongregaApp corriendo en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/congrega-app.git
   cd congrega-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo y configura tus credenciales de base de datos.
   ```bash
   cp .env.example .env
   # Edita el archivo .env con tu DATABASE_URL
   ```

4. **Ejecutar migraciones de la base de datos:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

¡Listo! El backend de CongregaApp debería estar corriendo en `http://localhost:3000` (o el puerto configurado).

---

*Hecho con ❤️ para facilitar la organización de eventos con propósito.*
