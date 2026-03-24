import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrganizationsPage from './pages/admin/AdminOrganizationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import OrgLayout from './pages/org/OrgLayout';
import OrgDashboardPage from './pages/org/OrgDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pantalla Principal */}
        <Route path="/" element={<HomePage />} />

        {/* Dashboard Administrador Global */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="organizations" replace />} />
          <Route path="organizations" element={<AdminOrganizationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Dashboard Organización */}
        <Route path="/org/:orgId" element={<OrgLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OrgDashboardPage />} />
          <Route path="participants" element={<div className="p-8"><h2 className="text-2xl font-bold">Participantes (Proximamente)</h2></div>} />
          <Route path="finances" element={<div className="p-8"><h2 className="text-2xl font-bold">Finanzas (Proximamente)</h2></div>} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
