import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, Users, LogOut, Settings, Wallet, CreditCard } from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '@/data/mock';

export default function OrgLayout() {
  const navigate = useNavigate();
  const { orgId } = useParams();

  const org = MOCK_ORGANIZATIONS.find(o => o.id === orgId) || { name: 'Organización Desconocida' };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-surface-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-border flex flex-col shadow-sm">
        <div className="p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
               {org.name.charAt(0)}
             </div>
             <div>
               <h2 className="text-sm font-bold text-gray-900 leading-tight truncate w-36" title={org.name}>{org.name}</h2>
               <p className="text-xs text-brand-accent mt-0.5">Plan Pro</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          <NavLink
            to={`/org/${orgId}/dashboard`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-surface-background hover:text-gray-900'
              }`
            }
          >
            <CalendarDays className="w-5 h-5" />
            Eventos
          </NavLink>

          <NavLink
            to={`/org/${orgId}/participants`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-surface-background hover:text-gray-900'
              }`
            }
          >
            <Users className="w-5 h-5" />
            Participantes
          </NavLink>

          <NavLink
            to={`/org/${orgId}/finances`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-surface-background hover:text-gray-900'
              }`
            }
          >
            <Wallet className="w-5 h-5" />
            Finanzas
          </NavLink>
        </nav>

        <div className="p-4 border-t border-surface-border space-y-2">
           <button className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-surface-background transition-colors">
            <Settings className="w-5 h-5" />
            Configuración
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Salir al Home
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-8">
           <div className="flex items-center gap-2 text-sm text-gray-500">
             <span>Portal de Organización</span>
             <span>/</span>
             <span className="font-medium text-gray-900">{org.name}</span>
           </div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors bg-brand-primary/5 px-3 py-1.5 rounded-full">
              <CreditCard className="w-4 h-4" />
              Suscripción Activa
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-surface-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
