import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrganizations } from '@/lib/api';

export default function AdminOrganizationsPage() {
  const { data: organizations, loading } = useOrganizations();

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
            {loading ? <Loader2 className="animate-spin w-6 h-6 text-gray-400" /> : (
              <>
                <div className="text-2xl font-bold">{organizations.length}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">+2 este mes</p>
              </>
            )}
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
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Cargando organizaciones...
                    </td>
                  </tr>
                ) : organizations.map((org: any) => (
                  <tr key={org.id} className="bg-white border-b border-surface-border hover:bg-surface-background transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                        {org.name.charAt(0)}
                      </div>
                      {org.name}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={org.description}>{org.description || '-'}</td>
                    <td className="px-6 py-4">{new Date(org.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Activa</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-brand-primary">Ver detalles</Button>
                    </td>
                  </tr>
                ))}
                {!loading && organizations.length === 0 && (
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
