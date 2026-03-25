import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_EVENTS, type EventStat } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, DollarSign, Users, Ticket, ArrowRight, Activity } from 'lucide-react';

export default function OrgDashboardPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const events = MOCK_EVENTS.filter(e => e.organizationId === orgId);
  const [selectedEvent, setSelectedEvent] = useState<EventStat | null>(null);

  // Calcula totales generales
  const totalRecaudado = events.reduce((acc, curr) => acc + curr.totalCollected, 0);
  const totalInscritos = events.reduce((acc, curr) => acc + curr.totalEnrolled, 0);

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Eventos Activos</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Gestiona los eventos, campamentos o congresos de tu organización.</p>
        </div>
        <Button className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2" onClick={() => navigate(`/org/${orgId}/events/new`)}>
          <Plus className="w-4 h-4" />
          Crear Evento
        </Button>
      </div>

       {/* Resumen Global */}
       {!selectedEvent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-brand-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-brand-primary">Total Recaudado Global</CardTitle>
              <DollarSign className="w-5 h-5 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${totalRecaudado.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 border-brand-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-brand-accent">Inscritos Totales</CardTitle>
              <Users className="w-5 h-5 text-brand-accent" />
            </CardHeader>
             <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalInscritos}</div>
            </CardContent>
          </Card>

           <Card className="bg-gradient-to-br from-status-info/10 to-status-info/5 border-status-info/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-status-info">Eventos Publicados</CardTitle>
              <CalendarDays className="w-5 h-5 text-status-info" />
            </CardHeader>
             <CardContent>
              <div className="text-3xl font-bold text-gray-900">{events.filter(e => e.status === 'PUBLISHED').length}</div>
            </CardContent>
          </Card>
        </div>
       )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Eventos */}
        <div className={`space-y-4 ${selectedEvent ? 'lg:col-span-1' : 'lg:col-span-3'} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Selecciona un evento</h2>
            {selectedEvent && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-brand-primary">
                Ver resumen global
              </Button>
            )}
          </div>

          <div className={`grid gap-4 ${selectedEvent ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {events.map(event => (
              <Card
                key={event.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedEvent?.id === event.id ? 'border-brand-primary shadow-md ring-1 ring-brand-primary' : 'hover:border-gray-300'}`}
                onClick={() => setSelectedEvent(event)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                      {event.name}
                    </CardTitle>
                     <Badge variant={event.status === 'PUBLISHED' ? 'success' : event.status === 'DRAFT' ? 'warning' : 'default'}>
                        {event.status === 'PUBLISHED' ? 'Publicado' : event.status === 'DRAFT' ? 'Borrador' : 'Cerrado'}
                     </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 mt-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex justify-between items-center text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-accent" />
                      <span>{event.totalEnrolled} / {event.totalCapacity}</span>
                    </div>
                    {selectedEvent?.id !== event.id && (
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    )}
                </CardContent>
              </Card>
            ))}
            {events.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No hay eventos aún</h3>
                <p className="text-gray-500 mt-1 mb-4">Crea tu primer evento para empezar a gestionar.</p>
                <Button>Crear mi primer evento</Button>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Estadísticas Detalladas del Evento Seleccionado */}
        {selectedEvent && (
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-8">
            <Card className="border-t-4 border-t-brand-primary shadow-lg">
              <CardHeader className="pb-4 border-b border-surface-border">
                <div className="flex items-center gap-3 mb-1">
                  <Activity className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-brand-primary">Vista de Detalle</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{selectedEvent.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base flex items-center gap-2">
                   Programado para el {new Date(selectedEvent.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Recaudado */}
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-status-success" />
                      </div>
                      <span className="font-semibold text-gray-700">Total Recaudado</span>
                    </div>
                    <div className="text-3xl font-extrabold text-status-success mt-auto">
                      ${selectedEvent.totalCollected.toLocaleString()}
                    </div>
                  </div>

                  {/* Inscritos */}
                  <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-accent" />
                      </div>
                      <span className="font-semibold text-gray-700">Total Inscritos</span>
                    </div>
                    <div className="text-3xl font-extrabold text-brand-accent mt-auto">
                      {selectedEvent.totalEnrolled}
                    </div>
                     <div className="text-xs text-orange-600 mt-2 font-medium">
                        {(selectedEvent.totalEnrolled / selectedEvent.totalCapacity * 100).toFixed(0)}% de ocupación
                     </div>
                  </div>

                  {/* Disponible */}
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-status-info" />
                      </div>
                      <span className="font-semibold text-gray-700">Cupos Disponibles</span>
                    </div>
                    <div className="text-3xl font-extrabold text-status-info mt-auto">
                      {selectedEvent.totalCapacity - selectedEvent.totalEnrolled}
                    </div>
                    <div className="text-xs text-blue-600 mt-2 font-medium">
                        De un total de {selectedEvent.totalCapacity}
                     </div>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row gap-3">
                  <Button className="w-full">Gestionar Inscripciones</Button>
                  <Button variant="outline" className="w-full">Ver Finanzas Detalladas</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
