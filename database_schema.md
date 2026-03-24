# Esquema de Base de Datos (Prisma)

El siguiente es el esquema relacional en formato `Prisma schema` diseñado para PostgreSQL. Contempla el soporte multi-tenancy (Organizaciones), los Módulos 1 y 2 (MVP) y deja las bases sentadas para los Módulos 3 y 4 (Visión a Futuro).

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==============================================================================
// CORE & MULTI-TENANCY (MVP)
// ==============================================================================

model Organization {
  id              String   @id @default(uuid())
  name            String
  baseCurrency    String   @default("USD") // Moneda contable oficial
  exchangeRate    Decimal  @default(1.0)   // Tasa oficial actual (puede sobreescribirse por transacción/evento)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  users           User[]
  events          Event[]
  globalSponsorships SponsorshipWallet[] // Bolsa global de la organización
  providers       Provider[] // Fase 2
}

model User {
  id              String   @id @default(uuid())
  organizationId  String
  email           String   @unique
  firstName       String
  lastName        String
  phone           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])
  enrollments     Enrollment[]
  medicalRecord   MedicalRecord? // Fase 2
}

// ==============================================================================
// MÓDULO 1: CONFIGURACIÓN DE EVENTOS Y PRESUPUESTOS (MVP)
// ==============================================================================

model Event {
  id              String   @id @default(uuid())
  organizationId  String
  name            String
  startDate       DateTime
  endDate         DateTime
  totalCapacity   Int      // Límite de cupos totales
  fundraisingGoal Decimal  @default(0.0) // Meta de recaudación general
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])
  costStructures  CostStructure[]
  enrollments     Enrollment[]
  sponsorships    SponsorshipWallet[] // Bolsa específica del evento
  logisticGroups  LogisticGroup[] // Fase 2
  payableAccounts PayableAccount[] // Fase 2
}

model CostStructure {
  id              String   @id @default(uuid())
  eventId         String
  name            String   // Ej. "Costo Base", "Transporte", "Seguro"
  amount          Decimal  // Costo real del rubro (en moneda base)
  isRequired      Boolean  @default(true) // Si es obligatorio para todos o un extra
  createdAt       DateTime @default(now())

  event           Event    @relation(fields: [eventId], references: [id])
}

// Representa la participación de un usuario en un evento específico con su rol y tarifa
model Enrollment {
  id              String   @id @default(uuid())
  eventId         String
  userId          String
  role            RoleType // "STAFF" | "ATTENDEE"
  tariffType      TariffType // "FULL_PAYMENT" | "HALF_SCHOLARSHIP" | "FULLY_SPONSORED"
  totalCost       Decimal  // Suma de los CostStructure aplicables
  totalPaid       Decimal  @default(0.0) // Monto pagado hasta la fecha (en moneda base)
  status          EnrollmentStatus @default(PENDING) // "PENDING" | "PARTIAL" | "SOLVENT"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  event           Event    @relation(fields: [eventId], references: [id])
  user            User     @relation(fields: [userId], references: [id])
  transactions    Transaction[]

  @@unique([eventId, userId]) // Un usuario solo puede inscribirse una vez por evento
}

enum RoleType {
  STAFF
  ATTENDEE
}

enum TariffType {
  FULL_PAYMENT
  HALF_SCHOLARSHIP
  FULLY_SPONSORED
}

enum EnrollmentStatus {
  PENDING
  PARTIAL
  SOLVENT
}

// ==============================================================================
// MÓDULO 2: CUENTAS POR COBRAR E INGRESOS (MVP)
// ==============================================================================

model Transaction {
  id              String   @id @default(uuid())
  enrollmentId    String?  // Nulo si es una donación directa a la bolsa (SponsorshipWallet)
  walletId        String?  // Presente si este pago es una asignación desde la bolsa de patrocinios
  amountOriginal  Decimal  // Monto pagado en la moneda en que se dio
  currencyOriginal String  // "USD", "EUR", "MXN", etc.
  exchangeRate    Decimal  // Tasa de cambio aplicada ese día
  amountBase      Decimal  // Monto equivalente exacto en la moneda base del sistema
  paymentMethod   String   // "Efectivo", "Zelle", "Transferencia"
  receiptNumber   String   @unique @default(uuid()) // Comprobante único
  type            TransactionType // "DIRECT_PAYMENT" | "DONATION" | "SPONSORSHIP_ALLOCATION"
  date            DateTime @default(now())
  createdAt       DateTime @default(now())

  enrollment      Enrollment? @relation(fields: [enrollmentId], references: [id])
  wallet          SponsorshipWallet? @relation(fields: [walletId], references: [id])
}

enum TransactionType {
  DIRECT_PAYMENT          // Pago normal de un inscrito
  DONATION                // Ingreso de dinero a la bolsa de patrocinio
  SPONSORSHIP_ALLOCATION  // Dinero transferido de la bolsa a la cuenta (Enrollment) de un deudor
}

// Motor de Patrocinios: La "Bolsa de Dinero"
model SponsorshipWallet {
  id              String   @id @default(uuid())
  organizationId  String
  eventId         String?  // Si es nulo, la bolsa es global para la organización (sobrantes)
  donorName       String?  // Opcional, nombre de quien dona
  totalReceived   Decimal  @default(0.0) // Total donado (en moneda base)
  totalAllocated  Decimal  @default(0.0) // Total ya fraccionado y asignado a deudores
  // Saldo disponible = totalReceived - totalAllocated
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])
  event           Event?       @relation(fields: [eventId], references: [id])
  allocations     Transaction[] // Relación con los pagos hechos usando este fondo
}

// ==============================================================================
// FASE 2: VISIÓN A FUTURO (LOGÍSTICA Y CUENTAS POR PAGAR)
// ==============================================================================

// MÓDULO 3: LOGÍSTICA
model MedicalRecord {
  id              String   @id @default(uuid())
  userId          String   @unique
  allergies       String?
  conditions      String?
  activeTreatments String?
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id])
}

model LogisticGroup {
  id              String   @id @default(uuid())
  eventId         String
  name            String   // Ej. "Cabaña A", "Equipo Rojo"
  type            String   // "CABIN" | "TEAM" | "ROOM"
  capacity        Int
  genderRules     String?  // "MALE", "FEMALE", "MIXED"

  event           Event    @relation(fields: [eventId], references: [id])
  // Relación a Enrollment o participantes asignados a este grupo (se implementará en Fase 2)
}

// Control de Acceso (Check-In/Check-Out)
model AccessControl {
  id              String   @id @default(uuid())
  enrollmentId    String   @unique // Asumimos Check-In único por evento. Podría ser 1:N si hay salidas diarias.
  checkInDate     DateTime?
  checkInBy       String?  // Nombre o ID de quien entrega al menor
  checkOutDate    DateTime?
  checkOutBy      String?  // Nombre o ID de quien recibe al menor

  // Relaciones en Fase 2...
}

// MÓDULO 4: CUENTAS POR PAGAR
model Provider {
  id              String   @id @default(uuid())
  organizationId  String
  name            String
  contactInfo     String?

  organization    Organization @relation(fields: [organizationId], references: [id])
  payableAccounts PayableAccount[]
}

model PayableAccount {
  id              String   @id @default(uuid())
  eventId         String
  providerId      String
  concept         String   // Ej. "Transporte de ida"
  totalAmount     Decimal  // Compromiso total
  paidAmount      Decimal  @default(0.0)
  status          String   // "PENDING", "PARTIAL", "PAID"

  event           Event    @relation(fields: [eventId], references: [id])
  provider        Provider @relation(fields: [providerId], references: [id])
  // Pagos o abonos a proveedores en Fase 2...
}

```
