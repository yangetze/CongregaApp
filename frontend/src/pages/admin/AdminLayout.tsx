import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Building2, Users, LogOut, Settings } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-surface-background">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-primary text-white flex flex-col shadow-lg">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
