import { useMemo } from 'react';
import { MOCK_USERS } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  const stats = useMemo(() => {
    return MOCK_USERS.reduce(
      (acc, user) => {
        if (user.role === 'ADMIN') acc.adminCount++;
        if (user.status === 'ACTIVE') acc.activeUsersCount++;
        return acc;
      },
      { adminCount: 0, activeUsersCount: 0 }
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Usuarios Globales</h1>
          <p className="text-gray-500 mt-1">Administra el acceso y roles de los usuarios en la plataforma.</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Usuario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Usuarios</CardTitle>
            <Users className="w-4 h-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_USERS.length}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">Todos los roles</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Administradores</CardTitle>
            <ShieldCheck className="w-4 h-4 text-status-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminCount}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">Con acceso total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Usuarios Activos</CardTitle>
            <User className="w-4 h-4 text-status-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsersCount}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">Operando actualmente</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle className="text-lg">Directorio de Usuarios</CardTitle>
             <div className="relative w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 placeholder="Buscar por nombre o correo..."
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
                  <th scope="col" className="px-6 py-3">Usuario</th>
                  <th scope="col" className="px-6 py-3">Rol</th>
                  <th scope="col" className="px-6 py-3">Organización</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="bg-white border-b border-surface-border hover:bg-surface-background transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'ADMIN' ? 'bg-status-info/10 text-status-info' : 'bg-brand-accent/10 text-brand-accent'}`}>
                           {user.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-gray-500 font-normal">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={user.role === 'ADMIN' ? 'info' : 'default'}>
                         {user.role === 'ADMIN' ? 'Administrador' : 'Miembro'}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.organizationId ? <span className="text-brand-primary font-medium">{user.organizationId}</span> : <span className="text-gray-400 italic">Global</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>
                        {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-brand-primary">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
