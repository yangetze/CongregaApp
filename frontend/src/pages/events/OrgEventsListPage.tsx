import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventData {
    id: string;
    sequentialId?: number;
    name: string;
    startDate: string;
    endDate: string;
    totalCapacity: number;
    organizationId: string;
    hasCost: boolean;
}

export default function OrgEventsListPage() {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/api/events?organizationId=${orgId}`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [orgId]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Eventos</h1>
                    <p className="text-gray-500 mt-1">Administra los eventos, congresos y retiros.</p>
                </div>
                <Button onClick={() => navigate(`/org/${orgId}/events/new`)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Evento
                </Button>
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-gray-500">Cargando eventos...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No hay eventos activos</h3>
                    <p className="text-gray-500 mb-4">Crea tu primer evento para comenzar.</p>
                    <Button onClick={() => navigate(`/org/${orgId}/events/new`)}>Crear Evento</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Card
                            key={event.id}
                            className="cursor-pointer hover:shadow-md transition-shadow hover:border-brand-primary"
                            onClick={() => navigate(`/org/${orgId}/events/${event.id}`)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{event.name}</CardTitle>
                                    {event.sequentialId && (
                                        <Badge variant="default" className="bg-brand-primary text-white text-xs">
                                            Evento #{event.sequentialId}
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                                    <CalendarDays className="w-4 h-4" />
                                    {new Date(event.startDate).toLocaleDateString()}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 flex justify-between items-center text-sm font-medium">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4" />
                                        <span>Cap: {event.totalCapacity}</span>
                                    </div>
                                    {event.hasCost ? (
                                        <Badge variant="warning">Pago</Badge>
                                    ) : (
                                        <Badge variant="success">Gratuito</Badge>
                                    )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
