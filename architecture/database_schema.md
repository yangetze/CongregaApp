# Esquema de Base de Datos (Prisma)

El siguiente esquema representa la base de datos de CongregaApp, diseñada para un modelo B2B multi-tenant con separación clara de roles y módulos robustos para el MVP.

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
  exchangeRate    Decimal  @default(1.0)   // Tasa oficial actual
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  users           User[]     // Administradores de la plataforma
  persons         Person[]   // CRM de asistentes
  events          Event[]
  wallets         Wallet[]   // Bolsas de dinero de la organización
  paymentMethods  OrganizationPaymentMethod[]
  providers       Provider[] // Fase 2
}

// Catálogo Global de Métodos de Pago
model PaymentMethod {
  id              String   @id @default(uuid())
  name            String   // Ej. "ZELLE"
  currency        String   // Ej. "USD"
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organizationMethods OrganizationPaymentMethod[]
}

// Métodos de Pago por Organización
model OrganizationPaymentMethod {
  id              String   @id @default(uuid())
  organizationId  String
  paymentMethodId String
  details         Json     // Ej. { email: "pagos@iglesia.com", banco: "Banesco" }
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization  @relation(fields: [organizationId], references: [id])
  paymentMethod   PaymentMethod @relation(fields: [paymentMethodId], references: [id])
  transactions    Transaction[]

  @@unique([organizationId, paymentMethodId])
}

// Administradores del sistema (Acceso al Dashboard)
model User {
  id              String   @id @default(uuid())
  organizationId  String?  // Nulo si es Admin Global
  email           String   @unique
  passwordHash    String?
  firstName       String
  lastName        String
  role            UserRole @default(ORGANIZATION_MEMBER)
  status          UserStatus @default(ACTIVE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization? @relation(fields: [organizationId], references: [id])
}

enum UserRole {
  ADMIN
  ORGANIZATION_MEMBER
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

// ==============================================================================
// MÓDULO DE PERSONAS (CRM / ASISTENTES)
// ==============================================================================

model Person {
  id              String   @id @default(uuid())
  organizationId  String
  documentId      String?  // Cédula, permite evitar duplicados
  email           String?
  firstName       String
  lastName        String
  phone           String?
  birthDate       DateTime? // Usado para cálculo de edad dinámico
  gender          Gender?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])
  enrollments     Enrollment[]
  medicalRecord   MedicalRecord? // Fase 2

  relationships   Relationship[] @relation("PersonToRelationship")
  relatedTo       Relationship[] @relation("RelatedPersonToRelationship")

  @@unique([organizationId, email])
  @@unique([organizationId, documentId])
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

model Relationship {
  id              String   @id @default(uuid())
  personId        String
  relatedPersonId String
  relationshipType RelationshipType
  createdAt       DateTime @default(now())

  person          Person   @relation("PersonToRelationship", fields: [personId], references: [id])
  relatedPerson   Person   @relation("RelatedPersonToRelationship", fields: [relatedPersonId], references: [id])

  @@unique([personId, relatedPersonId])
}

enum RelationshipType {
  PARENT
  CHILD
  SIBLING
  SPOUSE
  OTHER
}

// ==============================================================================
// MÓDULO 1: EVENTOS Y PRESUPUESTOS (MVP)
// ==============================================================================

model Event {
  id              String   @id @default(uuid())
  sequentialId    Int      @default(autoincrement()) // Ej. Evento #1
  organizationId  String
  name            String
  startDate       DateTime
  endDate         DateTime
  totalCapacity   Int?     // Límite dinámico calculado como la suma de los TicketStructures
  hasCost         Boolean  @default(false)
  fundraisingGoal Decimal  @default(0.0)

  requirements    Json     @default("{}") // Reglas dinámicas (edad, género)
  status          EventStatusType @default(DRAFT)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])
  costStructures  CostStructure[]
  ticketStructures TicketStructure[]
  enrollments     Enrollment[]
  wallets         Wallet[] // Wallet asociado específicamente a este evento
  allocations     Transaction[] @relation("EventAllocations") // Dinero asignado directamente a este evento
  logisticGroups  LogisticGroup[] // Fase 2
  payableAccounts PayableAccount[] // Fase 2
}

enum EventStatusType {
  DRAFT
  PUBLISHED
  COMPLETED
  CANCELLED
}

// Costos fijos/obligatorios u opcionales del evento
model CostStructure {
  id              String   @id @default(uuid())
  eventId         String
  name            String   // Ej. "Transporte"
  amount          Decimal
  isMandatory     Boolean  @default(true)
  createdAt       DateTime @default(now())

  event           Event    @relation(fields: [eventId], references: [id])
}

// Estructura de Tickets
model TicketStructure {
  id              String   @id @default(uuid())
  eventId         String
  name            String   // Ej. "Ticket VIP"
  price           Decimal
  quantity        Int      @default(10)
  createdAt       DateTime @default(now())

  event           Event    @relation(fields: [eventId], references: [id])
  enrollments     Enrollment[]
}

// Inscripción de la Person en un Evento
model Enrollment {
  id              String   @id @default(uuid())
  eventId         String
  personId        String
  ticketId        String?  // Obligatorio, si se borra el ticket que pasa
  role            EnrollmentRole @default(PARTICIPANT)
  tariffType      TariffType @default(FULL_PAYMENT)
  totalCost       Decimal  // Copia inicial del precio del ticket para congelar el valor, o para tarifas diferentes
  totalPaid       Decimal  @default(0.0)
  status          EnrollmentStatus @default(PENDING) // Puede ser un modelo separado luego, como TransactionStatus
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  event           Event    @relation(fields: [eventId], references: [id])
  person          Person   @relation(fields: [personId], references: [id])
  ticket          TicketStructure? @relation(fields: [ticketId], references: [id])
  allocations     Transaction[] @relation("EnrollmentAllocations")

  @@unique([eventId, personId])
}

enum EnrollmentRole {
  STAFF
  PARTICIPANT
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
// MÓDULO 2: CUENTAS POR COBRAR (MVP) - NUEVO MODELO DE WALLET
// ==============================================================================

model TransactionStatus {
  id              String   @id @default(uuid())
  code            String   @unique // Ej. "PENDING", "RECONCILED", "REJECTED"
  name            String   // Nombre amigable "Por Conciliar", "Conciliado", "Rechazado"
  description     String?
  transactions    Transaction[]
}

model Transaction {
  id              String   @id @default(uuid())
  // Para asignar (Allocation)
  enrollmentId    String?  // Destino 1: Asignado a Inscripción (Person)
  eventId         String?  // Destino 2: Asignado a Evento

  walletId        String?  // Origen (para Allocations) o Destino (para Registros de Ingreso)
  amountOriginal  Decimal
  currencyOriginal String
  exchangeRate    Decimal
  amountBase      Decimal
  organizationPaymentMethodId String?
  receiptNumber   String?  @unique @default(uuid())
  type            TransactionType
  statusId        String   // Referencia a TransactionStatus
  date            DateTime @default(now())
  createdAt       DateTime @default(now())

  enrollment      Enrollment? @relation("EnrollmentAllocations", fields: [enrollmentId], references: [id])
  event           Event?      @relation("EventAllocations", fields: [eventId], references: [id])
  wallet          Wallet?     @relation(fields: [walletId], references: [id])
  status          TransactionStatus @relation(fields: [statusId], references: [id])
  organizationPaymentMethod OrganizationPaymentMethod? @relation(fields: [organizationPaymentMethodId], references: [id])
}

enum TransactionType {
  WALLET_DEPOSIT   // Registro de pago/donación hacia la Wallet
  WALLET_ALLOCATION // Asignación de dinero desde la Wallet (hacia Evento o Enrollment)
}

// Bolsa de Fondos Centralizada (Genérica)
model Wallet {
  id              String   @id @default(uuid())
  organizationId  String
  eventId         String?  // Nulo si es global, con valor si es para un evento específico
  ownerName       String?  // Nombre del Donante o de la Persona que hace el pago general
  category        WalletCategory @default(PAYMENT) // Para discriminar donaciones externas de pagos regulares
  totalReceived   Decimal  @default(0.0)
  totalAllocated  Decimal  @default(0.0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])
  event           Event?       @relation(fields: [eventId], references: [id])
  transactions    Transaction[]
}

enum WalletCategory {
  DONATION              // Donaciones externas/fondo perdido
  PAYMENT               // Pagos regulares o saldo a favor
  MEMBER_CONTRIBUTION   // Aportes directos
}

// ==============================================================================
// FASE 2: LOGÍSTICA Y PROVEEDORES
// ==============================================================================

model MedicalRecord {
  id              String   @id @default(uuid())
  personId        String   @unique
  allergies       String?
  conditions      String?
  activeTreatments String?
  updatedAt       DateTime @updatedAt

  person          Person   @relation(fields: [personId], references: [id])
}

model LogisticGroup {
  id              String   @id @default(uuid())
  eventId         String
  name            String
  type            String   // "CABIN" | "TEAM" | "ROOM"
  capacity        Int
  genderRules     String?

  event           Event    @relation(fields: [eventId], references: [id])
}

model AccessControl {
  id              String   @id @default(uuid())
  enrollmentId    String   @unique
  checkInDate     DateTime?
  checkInBy       String?
  checkOutDate    DateTime?
  checkOutBy      String?
}

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
  concept         String
  totalAmount     Decimal
  paidAmount      Decimal  @default(0.0)
  status          String

  event           Event    @relation(fields: [eventId], references: [id])
  provider        Provider @relation(fields: [providerId], references: [id])
}
```
