import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrganizationsPage from './pages/admin/AdminOrganizationsPage';
import AdminCreateOrganizationPage from './pages/admin/AdminCreateOrganizationPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminMaintenancePage from './pages/admin/AdminMaintenancePage';
import OrgLayout from './pages/org/OrgLayout';
import OrgDashboardPage from './pages/org/OrgDashboardPage';
import OrgPeoplePage from './pages/people/OrgPeoplePage';
import OrgFinancesPage from './pages/org/OrgFinancesPage';
import OrgEventsListPage from './pages/events/OrgEventsListPage';
import OrgCreateEventPage from './pages/events/OrgCreateEventPage';
import OrgEventDetailsPage from './pages/events/OrgEventDetailsPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Pantalla Principal */}
        <Route path="/" element={<HomePage />} />

        {/* Dashboard Administrador Global */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="organizations" replace />} />
          <Route path="organizations" element={<AdminOrganizationsPage />} />
          <Route path="organizations/new" element={<AdminCreateOrganizationPage />} />
          <Route path="payment-methods" element={<AdminMaintenancePage />} />
          <Route path="event-statuses" element={<AdminMaintenancePage />} />
          <Route path="currencies" element={<AdminMaintenancePage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="maintenance" element={<AdminMaintenancePage />} />
        </Route>

        {/* Dashboard Organización */}
        <Route path="/org/:orgId" element={<OrgLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OrgDashboardPage />} />
          <Route path="people" element={<OrgPeoplePage />} />
          <Route path="finances" element={<OrgFinancesPage />} />
          <Route path="events" element={<OrgEventsListPage />} />
          <Route path="events/new" element={<OrgCreateEventPage />} />
          <Route path="events/:eventId" element={<OrgEventDetailsPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
