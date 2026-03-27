import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Search, Plus, ArrowLeft, Mail, Phone, Ticket } from 'lucide-react';
import { toast } from 'sonner';

interface EventData {
    id: string;
    sequentialId?: number;
    name: string;
    startDate: string;
    endDate: string;
    totalCapacity: number;
    organizationId: string;
    hasCost: boolean;
    requirements: Record<string, any>;
    costs: any[];
}

interface Person {
    id: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    documentId: string | null;
}

export default function OrgEventDetailsPage() {
    const { orgId, eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState<EventData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Enrollment Flow State
    const [isEnrollmentMode, setIsEnrollmentMode] = useState(false);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [documentSearch, setDocumentSearch] = useState('');
    const [foundPerson, setFoundPerson] = useState<Person | null>(null);
    const [searchMessage, setSearchMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('PARTICIPANT');

    // New Person Form State
    const [isCreatingNewPerson, setIsCreatingNewPerson] = useState(false);
    const [newPersonData, setNewPersonData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Event
            const eventRes = await fetch(`http://localhost:3000/api/events?organizationId=${orgId}`);
            const eventData = await eventRes.json();
            const found = eventData.find((e: any) => e.id === eventId);
            setEvent(found || null);

            // Fetch Enrollments for this event
            const enrollmentsRes = await fetch(`http://localhost:3000/api/events/${eventId}/enrollments`);
            if (enrollmentsRes.ok) {
                const enrollmentsData = await enrollmentsRes.json();
                setEnrollments(enrollmentsData);
            }

            // Fetch People to map names
            const peopleRes = await fetch(`http://localhost:3000/api/people?organizationId=${orgId}`);
            if (peopleRes.ok) {
                const peopleData = await peopleRes.json();
                setPeople(peopleData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [orgId, eventId]);

    const handleSearchDocument = async () => {
        if (!documentSearch) return;
        setSearchMessage('Buscando...');
        setFoundPerson(null);
        setIsCreatingNewPerson(false);

        try {
            const res = await fetch(`http://localhost:3000/api/persons/document/${documentSearch}?organizationId=${orgId}`);
            if (res.ok) {
                const data = await res.json();
                setFoundPerson(data);
                setSearchMessage('');
            } else {
                setFoundPerson(null);
                setSearchMessage('Persona no encontrada. Por favor, ingresa sus datos para crearla.');
                setIsCreatingNewPerson(true);
            }
        } catch (error) {
            setSearchMessage('Error al buscar la persona.');
        }
    };

    const handleEnroll = async (personId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/events/${eventId}/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ personId, role: selectedRole })
            });

            if (res.ok) {
                toast.success('¡Inscripción exitosa!');
                setIsEnrollmentMode(false);
                setDocumentSearch('');
                setFoundPerson(null);
                setIsCreatingNewPerson(false);
                fetchData(); // Refresh enrollments list
            } else {
                const data = await res.json();
                toast.error(data.error || 'Error al inscribir persona');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    const handleCreateAndEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create Person
            const personRes = await fetch('http://localhost:3000/api/persons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newPersonData,
                    documentId: documentSearch,
                    organizationId: orgId
                })
            });

            const personData = await personRes.json();
            if (!personRes.ok) {
                toast.error(personData.error || 'Error creando persona');
                return;
            }

            // 2. Enroll Person
            const enrollRes = await fetch(`http://localhost:3000/api/events/${eventId}/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ personId: personData.id, role: selectedRole })
            });

            if (enrollRes.ok) {
                toast.success('¡Inscripción exitosa!');
                setIsEnrollmentMode(false);
                setDocumentSearch('');
                setFoundPerson(null);
                setIsCreatingNewPerson(false);
                fetchData(); // Refresh enrollments list
            } else {
                const enrollData = await enrollRes.json();
                toast.error(enrollData.error || 'Error al inscribir persona. Puede que ya esté inscrita.');
            }

        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Hubo un error al crear e inscribir a la persona.';
            toast.error(errorMessage);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-gray-500">Cargando evento...</div>;
    if (!event) return <div className="p-12 text-center text-red-500">Evento no encontrado</div>;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate(`/org/${orgId}/events`)}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{event.name}</h1>
                            {event.sequentialId && (
                                <Badge variant="default" className="bg-brand-primary text-white text-sm">
                                    Evento #{event.sequentialId}
                                </Badge>
                            )}
                            {event.hasCost && <Badge variant="warning">Tiene Costo</Badge>}
                        </div>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </p>
                    </div>
                    {!isEnrollmentMode && (
                        <Button onClick={() => setIsEnrollmentMode(true)} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Crear Inscripción
                        </Button>
                    )}
                </div>
            </div>

            {isEnrollmentMode ? (
                /* ENROLLMENT FLOW */
                <Card className="border-t-4 border-t-brand-primary shadow-lg max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl">Inscribir Participante</CardTitle>
                        <CardDescription>Busca por número de documento para comenzar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Número de Identidad / Cédula"
                                    value={documentSearch}
                                    onChange={(e) => setDocumentSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                            <Button onClick={handleSearchDocument}>Buscar</Button>
                        </div>

                        {searchMessage && <p className="text-sm text-brand-accent font-medium">{searchMessage}</p>}

                        {/* FOUND PERSON */}
                        {foundPerson && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg">
                                        {foundPerson.firstName.charAt(0)}{foundPerson.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{foundPerson.firstName} {foundPerson.lastName}</h3>
                                        <div className="text-sm text-gray-500 space-y-1 mt-1">
                                            {foundPerson.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {foundPerson.email}</p>}
                                            {foundPerson.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {foundPerson.phone}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol en el Evento</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="PARTICIPANT">Participante (Por defecto)</option>
                                        <option value="STAFF">Staff / Equipo</option>
                                    </select>
                                </div>

                                <Button className="w-full" onClick={() => handleEnroll(foundPerson.id)}>
                                    Confirmar Inscripción
                                </Button>
                            </div>
                        )}

                        {/* CREATE NEW PERSON FORM */}
                        {isCreatingNewPerson && (
                            <form onSubmit={handleCreateAndEnroll} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-2">Datos de la nueva persona</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
                                        <input required type="text" className="w-full p-2 border rounded text-sm"
                                            value={newPersonData.firstName} onChange={e => setNewPersonData({...newPersonData, firstName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Apellido *</label>
                                        <input required type="text" className="w-full p-2 border rounded text-sm"
                                            value={newPersonData.lastName} onChange={e => setNewPersonData({...newPersonData, lastName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Correo Electrónico</label>
                                        <input type="email" className="w-full p-2 border rounded text-sm"
                                            value={newPersonData.email} onChange={e => setNewPersonData({...newPersonData, email: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                                        <input type="tel" className="w-full p-2 border rounded text-sm"
                                            value={newPersonData.phone} onChange={e => setNewPersonData({...newPersonData, phone: e.target.value})} />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol en el Evento</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="PARTICIPANT">Participante (Por defecto)</option>
                                        <option value="STAFF">Staff / Equipo</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full mt-2">Guardar e Inscribir</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                {/* EVENT DETAILS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Detalles de Configuración</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-gray-50 p-4 rounded-lg">
                                     <p className="text-sm text-gray-500 mb-1">Capacidad Total</p>
                                     <p className="text-xl font-semibold flex items-center gap-2">
                                         <Users className="w-5 h-5 text-brand-primary" /> {event.totalCapacity}
                                     </p>
                                 </div>
                                 <div className="bg-gray-50 p-4 rounded-lg">
                                     <p className="text-sm text-gray-500 mb-1">Tipo de Evento</p>
                                     <p className="text-lg font-semibold flex items-center gap-2">
                                        <Ticket className="w-5 h-5 text-status-success" />
                                        {event.hasCost ? 'Pago' : 'Gratuito'}
                                     </p>
                                 </div>
                             </div>

                             {event.requirements && Object.keys(event.requirements).length > 0 && (
                                 <div>
                                     <h3 className="font-medium text-gray-900 mb-3">Requisitos de Inscripción</h3>
                                     <div className="flex flex-wrap gap-2">
                                         {Object.entries(event.requirements).map(([key, val]) => (
                                             <Badge key={key} variant="info" className="bg-gray-50">
                                                 {key}: {val.toString()}
                                             </Badge>
                                         ))}
                                     </div>
                                 </div>
                             )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resupuesto / Costos</CardTitle>
                            <CardDescription>Estructura de costos del evento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {event.costs && event.costs.length > 0 ? (
                                <ul className="space-y-3">
                                    {event.costs.map((c: any, i: number) => (
                                        <li key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{c.name}</p>
                                                {c.isMandatory && <span className="text-xs text-brand-accent">Obligatorio</span>}
                                            </div>
                                            <span className="font-bold text-gray-900">${c.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No hay estructura de costos definida.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* PARTICIPANTS LIST */}
                <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <CardTitle>Participantes Registrados</CardTitle>
                            <CardDescription>Personas inscritas en este evento.</CardDescription>
                        </div>
                        <Badge variant="info" className="text-brand-primary border-brand-primary">
                            {enrollments.length} Inscritos
                        </Badge>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {enrollments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p>No hay participantes inscritos aún.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-surface-border">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Nombre completo</th>
                                            <th className="px-6 py-4 font-medium">Rol</th>
                                            <th className="px-6 py-4 font-medium">Fecha de Inscripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.map((enrollment, idx) => {
                                            const person = people.find(p => p.id === enrollment.personId);
                                            return (
                                                <tr key={idx} className="border-b border-surface-border last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                                                                {person ? `${person.firstName.charAt(0)}${person.lastName.charAt(0)}` : '?'}
                                                            </div>
                                                            <div className="font-medium text-gray-900">
                                                                {person ? `${person.firstName} ${person.lastName}` : 'Persona Desconocida'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={enrollment.role === 'STAFF' ? 'info' : 'default'} className="text-xs">
                                                            {enrollment.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {new Date(enrollment.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                </>
            )}
        </div>
    );
}
