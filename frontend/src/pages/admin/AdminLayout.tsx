import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Building2, Users, LogOut, Settings, CreditCard, Activity, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <aside className="hidden md:flex w-64 bg-brand-primary text-white flex-col shadow-lg z-20">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">CongregaApp</h2>
          <p className="text-brand-primary-light text-sm opacity-80 mt-1">Admin Global</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink
            to="/admin/organizations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
              }`
            }
          >
            <Building2 className="w-5 h-5" />
            Organizaciones
          </NavLink>

          <NavLink
            to="/admin/payment-methods"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
              }`
            }
          >
            <CreditCard className="w-5 h-5" />
            Métodos de Pago
          </NavLink>

          <NavLink
            to="/admin/event-statuses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
              }`
            }
          >
            <Activity className="w-5 h-5" />
            Estados de Evento
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
              }`
            }
          >
            <Users className="w-5 h-5" />
            Usuarios Globales
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
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
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-brand-primary text-white shadow-xl transition-transform transform">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">CongregaApp</h2>
                <p className="text-brand-primary-light text-sm opacity-80 mt-1">Admin Global</p>
              </div>
              <button onClick={closeMobileMenu} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
              <NavLink
                to="/admin/organizations"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`
                }
              >
                <Building2 className="w-5 h-5" />
                Organizaciones
              </NavLink>

              <NavLink
                to="/admin/payment-methods"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`
                }
              >
                <CreditCard className="w-5 h-5" />
                Métodos de Pago
              </NavLink>

              <NavLink
                to="/admin/event-statuses"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`
                }
              >
                <Activity className="w-5 h-5" />
                Estados de Evento
              </NavLink>

              <NavLink
                to="/admin/users"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`
                }
              >
                <Users className="w-5 h-5" />
                Usuarios Globales
              </NavLink>
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-4 sm:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
