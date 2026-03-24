import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrganizationsPage from './pages/admin/AdminOrganizationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPaymentMethodsPage from './pages/admin/AdminPaymentMethodsPage';
import AdminEventStatusesPage from './pages/admin/AdminEventStatusesPage';
import OrgLayout from './pages/org/OrgLayout';
import OrgDashboardPage from './pages/org/OrgDashboardPage';
import OrgParticipantsPage from './pages/people/OrgParticipantsPage';
import OrgFinancesPage from './pages/org/OrgFinancesPage';
import OrgEventsListPage from './pages/events/OrgEventsListPage';
import OrgCreateEventPage from './pages/events/OrgCreateEventPage';
import OrgEventDetailsPage from './pages/events/OrgEventDetailsPage';

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
          <Route path="payment-methods" element={<AdminPaymentMethodsPage />} />
          <Route path="event-statuses" element={<AdminEventStatusesPage />} />
        </Route>

        {/* Dashboard Organización */}
        <Route path="/org/:orgId" element={<OrgLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OrgDashboardPage />} />
          <Route path="participants" element={<OrgParticipantsPage />} />
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
