export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ORGANIZATION_MEMBER';
  organizationId?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface EventStat {
  id: string;
  organizationId: string;
  name: string;
  date: string;
  totalCollected: number;
  totalEnrolled: number;
  totalCapacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED';
}

export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'org-1', name: 'Iglesia Vida Nueva', description: 'Comunidad cristiana en el centro', createdAt: '2024-01-15' },
  { id: 'org-2', name: 'Campamento Betel', description: 'Campamento anual de verano', createdAt: '2024-02-10' },
  { id: 'org-3', name: 'Ministerio de Jóvenes', description: 'Red de jóvenes universitarios', createdAt: '2024-03-05' },
];

export const MOCK_USERS: User[] = [
  { id: 'usr-1', name: 'Carlos Admin', email: 'carlos@congrega.app', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'usr-2', name: 'María López', email: 'maria@vidanueva.com', role: 'ORGANIZATION_MEMBER', organizationId: 'org-1', status: 'ACTIVE' },
  { id: 'usr-3', name: 'Pedro Sánchez', email: 'pedro@betel.org', role: 'ORGANIZATION_MEMBER', organizationId: 'org-2', status: 'ACTIVE' },
  { id: 'usr-4', name: 'Ana Gómez', email: 'ana@jovenes.org', role: 'ORGANIZATION_MEMBER', organizationId: 'org-3', status: 'INACTIVE' },
];

export const MOCK_EVENTS: EventStat[] = [
  { id: 'evt-1', organizationId: 'org-1', name: 'Retiro Espiritual 2025', date: '2025-05-15', totalCollected: 1500, totalEnrolled: 50, totalCapacity: 100, status: 'PUBLISHED' },
  { id: 'evt-2', organizationId: 'org-1', name: 'Conferencia de Liderazgo', date: '2025-06-20', totalCollected: 3200, totalEnrolled: 80, totalCapacity: 80, status: 'PUBLISHED' },
  { id: 'evt-3', organizationId: 'org-2', name: 'Campamento Verano 2025', date: '2025-07-10', totalCollected: 5000, totalEnrolled: 120, totalCapacity: 150, status: 'PUBLISHED' },
  { id: 'evt-4', organizationId: 'org-3', name: 'Encuentro Universitario', date: '2025-08-05', totalCollected: 800, totalEnrolled: 40, totalCapacity: 200, status: 'DRAFT' },
];
