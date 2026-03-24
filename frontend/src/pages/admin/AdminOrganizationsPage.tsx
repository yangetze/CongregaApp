import { useState, useEffect } from 'react';
import { MOCK_ORGANIZATIONS, MOCK_USERS } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminOrganizationsPage() {
  const [eventsData, setEventsData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch events for mock statistics for all organizations
    const fetchAllEvents = async () => {
      try {
        const events = [];
        for (const org of MOCK_ORGANIZATIONS) {
           const res = await fetch(`http://localhost:3000/api/events?organizationId=${org.id}`);
           if (res.ok) {
             const data = await res.json();
             events.push(...data);
           }
        }
        setEventsData(events);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };
    fetchAllEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Organizaciones</h1>
          <p className="text-gray-500 mt-1">Gestiona las organizaciones registradas en la plataforma.</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Organización
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Organizaciones</CardTitle>
            <Building2 className="w-4 h-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_ORGANIZATIONS.length}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">+2 este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle className="text-lg">Lista de Organizaciones</CardTitle>
             <div className="relative w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 placeholder="Buscar..."
                 className="w-full pl-9 pr-4 py-2 rounded-md border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
               />
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-surface-border">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Descripción</th>
                  <th scope="col" className="px-6 py-3">Fecha de Creación</th>
                  <th scope="col" className="px-6 py-3">Estadísticas</th>
                  <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORGANIZATIONS.map((org) => {
                  const activeUsers = MOCK_USERS.filter(u => u.organizationId === org.id && u.status === 'ACTIVE').length;
                  const createdEvents = eventsData.filter(e => e.organizationId === org.id).length;

                  return (
                  <tr key={org.id} className="bg-white border-b border-surface-border hover:bg-surface-background transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                        {org.name.charAt(0)}
                      </div>
                      {org.name}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={org.description}>{org.description || '-'}</td>
                    <td className="px-6 py-4">{new Date(org.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-xs space-y-1 text-gray-600">
                      <div><span className="font-semibold text-gray-900">Usuarios Activos:</span> {activeUsers}</div>
                      <div><span className="font-semibold text-gray-900">Eventos Creados:</span> {createdEvents}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-brand-primary">Ver detalles</Button>
                    </td>
                  </tr>
                )})}
                {MOCK_ORGANIZATIONS.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay organizaciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
