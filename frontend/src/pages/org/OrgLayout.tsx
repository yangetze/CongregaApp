import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, Users, LogOut, Settings, Wallet, CreditCard, Activity, Menu, X } from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '@/data/mock';

export default function OrgLayout() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const org = MOCK_ORGANIZATIONS.find(o => o.id === orgId) || { name: 'Organización Desconocida' };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-surface-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-surface-border flex-col shadow-sm z-20">
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
            <Activity className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink
            to={`/org/${orgId}/events`}
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={closeMobileMenu}
          ></div>

          {/* Drawer Content */}
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-white shadow-xl transition-transform transform">
            <div className="p-6 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                   {org.name.charAt(0)}
                 </div>
                 <div>
                   <h2 className="text-sm font-bold text-gray-900 leading-tight truncate w-24" title={org.name}>{org.name}</h2>
                   <p className="text-xs text-brand-accent mt-0.5">Plan Pro</p>
                 </div>
              </div>
              <button onClick={closeMobileMenu} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
              <NavLink
                to={`/org/${orgId}/dashboard`}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-surface-background hover:text-gray-900'
                  }`
                }
              >
                <Activity className="w-5 h-5" />
                Dashboard
              </NavLink>

              <NavLink
                to={`/org/${orgId}/events`}
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-4 sm:px-8 shadow-sm">
           <div className="flex items-center gap-2 sm:gap-3 text-sm text-gray-500">
             <button
               onClick={toggleMobileMenu}
               className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-1"
             >
               <Menu className="w-5 h-5" />
             </button>
             <span className="hidden sm:inline">Portal de Organización</span>
             <span className="hidden sm:inline">/</span>
             <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{org.name}</span>
           </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <button className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors bg-brand-primary/5 px-3 py-1.5 rounded-full">
              <CreditCard className="w-4 h-4" />
              Suscripción Activa
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-surface-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
