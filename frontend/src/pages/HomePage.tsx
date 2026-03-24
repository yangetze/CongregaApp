import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ORGANIZATIONS } from '@/data/mock';
import { Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [showOrgSelect, setShowOrgSelect] = useState(false);

  const handleAdminLogin = () => {
    navigate('/admin/organizations');
  };

  const handleOrgLogin = () => {
    if (selectedOrgId) {
      navigate(`/org/${selectedOrgId}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-surface-background flex flex-col items-center justify-center p-4">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">CongregaApp</h1>
        <p className="text-gray-500">Gestión de eventos con propósito</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

        {/* Admin Card */}
        <Card className="hover:border-brand-primary transition-colors cursor-pointer group" onClick={handleAdminLogin}>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-brand-primary" />
            </div>
            <CardTitle className="text-xl">Administrador Global</CardTitle>
            <CardDescription>
              Gestiona todas las organizaciones, suscripciones y usuarios globales del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm font-medium text-brand-primary group-hover:text-brand-primary/80">
              Ingresar como Admin <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Organization Card */}
        <Card className={`transition-all ${showOrgSelect ? 'border-brand-accent shadow-md' : 'hover:border-brand-accent cursor-pointer'}`}
              onClick={() => !showOrgSelect && setShowOrgSelect(true)}>
          <CardHeader>
             <div className="w-12 h-12 rounded-lg bg-brand-accent/10 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-brand-accent" />
            </div>
            <CardTitle className="text-xl">Organización</CardTitle>
            <CardDescription>
              Accede a tu panel para gestionar eventos, inscripciones y finanzas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showOrgSelect ? (
               <div className="flex items-center text-sm font-medium text-brand-accent">
                Seleccionar Organización <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label htmlFor="org-select" className="text-sm font-medium text-gray-700">
                    Elige tu organización
                  </label>
                  <select
                    id="org-select"
                    className="w-full h-10 px-3 py-2 rounded-md border border-surface-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                  >
                    <option value="" disabled>Selecciona una opción...</option>
                    {MOCK_ORGANIZATIONS.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); setShowOrgSelect(false); setSelectedOrgId(''); }}>
                    Cancelar
                  </Button>
                  <Button className="w-full" disabled={!selectedOrgId} onClick={handleOrgLogin}>
                    Ingresar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
