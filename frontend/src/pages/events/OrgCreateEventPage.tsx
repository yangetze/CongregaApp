import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { PersonSearch } from '@/components/PersonSearch';

export default function OrgCreateEventPage() {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hasCost, setHasCost] = useState(false);

    const [isMultiDay, setIsMultiDay] = useState(false);

    // Dynamic Requirements
    const [requirements, setRequirements] = useState<Array<{key: string, value: string}>>([]);
    const availableReqKeys = ['minAge', 'maxAge', 'targetGender', 'requiresDocumentId'];

    // Budget / Costs
    const [costs, setCosts] = useState<Array<{name: string, amount: string, isMandatory: boolean}>>([]);

    // Tickets
    const [tickets, setTickets] = useState<Array<{name: string, price: string, quantity: string}>>([
        { name: 'General', price: '0', quantity: '10' }
    ]);

    // Calculate Capacity dynamically
    const calculatedCapacity = tickets.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    // Organizers and Participants
    const [organizers, setOrganizers] = useState<string[]>([]);
    const [participants, setParticipants] = useState<string[]>([]);
    const [people, setPeople] = useState<any[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/people?organizationId=${orgId}`)
            .then(res => res.json())
            .then(data => setPeople(data))
            .catch(console.error);
    }, [orgId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Convert requirements array back to object
        const reqObj: Record<string, any> = {};
        requirements.forEach(r => {
            if (r.key && r.value) {
                // Try to parse numbers or booleans
                if (r.value === 'true') reqObj[r.key] = true;
                else if (r.value === 'false') reqObj[r.key] = false;
                else if (!isNaN(Number(r.value))) reqObj[r.key] = Number(r.value);
                else reqObj[r.key] = r.value;
            }
        });

        // Format costs
        const formattedCosts = costs.map(c => ({
            name: c.name,
            amount: Number(c.amount) || 0,
            isMandatory: c.isMandatory
        }));

        const finalEndDate = isMultiDay ? endDate : startDate;

        const data = {
            name,
            startDate,
            endDate: finalEndDate,
            totalCapacity: calculatedCapacity,
            organizationId: orgId,
            hasCost,
            requirements: reqObj,
            costs: formattedCosts,
            tickets: tickets.map(t => ({
                name: t.name || 'General',
                price: Number(t.price) || 0,
                quantity: Number(t.quantity) || 0
            })),
            statusId: 'DRAFT',
            organizers: organizers,
            participants: participants
        };

        try {
            const res = await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const result = await res.json();
                navigate(`/org/${orgId}/events/${result.id}`);
            } else {
                alert('Error al crear evento');
            }
        } catch (error) {
            console.error(error);
            alert('Error de red');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate(`/org/${orgId}/events`)}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Crear Nuevo Evento</h1>
                    <p className="text-gray-500 mt-1">Configura los detalles básicos, reglas de inscripción y costos.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Información Básica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento *</label>
                            <input required type="text" className="w-full p-2 border rounded-lg"
                                value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Campamento Juvenil 2025" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="multiDay" className="rounded text-brand-primary"
                                checked={isMultiDay} onChange={(e) => setIsMultiDay(e.target.checked)} />
                            <label htmlFor="multiDay" className="text-sm font-medium text-gray-700 cursor-pointer">
                                ¿El evento dura varios días?
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                                <input required type="date" className="w-full p-2 border rounded-lg"
                                    value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            {isMultiDay && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin *</label>
                                    <input required type="date" className="w-full p-2 border rounded-lg"
                                        value={endDate} onChange={e => setEndDate(e.target.value)} />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Total (Calculada)</label>
                                <input type="number" readOnly className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                    value={calculatedCapacity} title="La capacidad se calcula automáticamente sumando las cantidades de los tickets" />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                                        checked={hasCost} onChange={e => setHasCost(e.target.checked)} />
                                    <span className="text-sm font-medium text-gray-900">El evento tiene costo</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Organizadores (Staff)</label>
                                <PersonSearch
                                    people={people}
                                    selectedIds={organizers}
                                    onSelect={(id) => setOrganizers([...organizers, id])}
                                    onRemove={(id) => setOrganizers(organizers.filter(oId => oId !== id))}
                                    placeholder="Buscar organizador por nombre o cédula..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Serán añadidas como STAFF.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Participantes (Conocidos)</label>
                                <PersonSearch
                                    people={people}
                                    selectedIds={participants}
                                    onSelect={(id) => setParticipants([...participants, id])}
                                    onRemove={(id) => setParticipants(participants.filter(pId => pId !== id))}
                                    placeholder="Buscar participante por nombre o cédula..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Serán añadidas como PARTICIPANTE.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Tipos de Tickets</CardTitle>
                            <CardDescription>Define los tickets disponibles y su cantidad.</CardDescription>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => setTickets([...tickets, {name: 'General', price: '', quantity: ''}])}>
                            <Plus className="w-4 h-4 mr-2" /> Agregar Ticket
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tickets.map((ticket, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded-lg">
                                <input type="text" placeholder="Descripción (ej. General)" required className="p-2 border rounded-lg bg-white w-full sm:flex-1"
                                    value={ticket.name} onChange={e => {
                                        const newTickets = [...tickets];
                                        newTickets[idx].name = e.target.value;
                                        setTickets(newTickets);
                                    }} />
                                <input type="number" placeholder="Precio ($)" className="p-2 border rounded-lg bg-white w-full sm:w-32"
                                    value={ticket.price} onChange={e => {
                                        const newTickets = [...tickets];
                                        newTickets[idx].price = e.target.value;
                                        setTickets(newTickets);
                                    }} />
                                <input type="number" placeholder="Cantidad" className="p-2 border rounded-lg bg-white w-full sm:w-32"
                                    value={ticket.quantity} onChange={e => {
                                        const newTickets = [...tickets];
                                        newTickets[idx].quantity = e.target.value;
                                        setTickets(newTickets);
                                    }} />
                                <Button type="button" variant="ghost" size="icon" className="text-red-500 w-full sm:w-auto mt-2 sm:mt-0"
                                    onClick={() => setTickets(tickets.filter((_, i) => i !== idx))}>
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                </Button>
                            </div>
                        ))}
                        {tickets.length === 0 && <p className="text-sm text-gray-500 italic">No hay tickets configurados. Se creará un ticket general por defecto.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Requisitos Dinámicos</CardTitle>
                            <CardDescription>Añade reglas específicas para la inscripción.</CardDescription>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => setRequirements([...requirements, {key: availableReqKeys[0], value: ''}])}>
                            <Plus className="w-4 h-4 mr-2" /> Agregar Requisito
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {requirements.map((req, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded-lg">
                                <select className="p-2 border rounded-lg bg-white w-full sm:flex-1"
                                    value={req.key} onChange={e => {
                                        const newReqs = [...requirements];
                                        newReqs[idx].key = e.target.value;
                                        setRequirements(newReqs);
                                    }}>
                                    {availableReqKeys.map(k => <option key={k} value={k}>{k}</option>)}
                                    <option value="custom">Otro (Personalizado)</option>
                                </select>
                                <input type="text" placeholder="Valor (ej. 18, FEMALE, true)" className="p-2 border rounded-lg bg-white w-full sm:flex-1"
                                    value={req.value} onChange={e => {
                                        const newReqs = [...requirements];
                                        newReqs[idx].value = e.target.value;
                                        setRequirements(newReqs);
                                    }} />
                                <Button type="button" variant="ghost" size="icon" className="text-red-500 w-full sm:w-auto mt-2 sm:mt-0"
                                    onClick={() => setRequirements(requirements.filter((_, i) => i !== idx))}>
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                </Button>
                            </div>
                        ))}
                        {requirements.length === 0 && <p className="text-sm text-gray-500 italic">No hay requisitos dinámicos configurados.</p>}
                    </CardContent>
                </Card>

                {hasCost && (
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Estructura de Costos</CardTitle>
                                <CardDescription>Opcional: Define el presupuesto y rubros internos.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCosts([...costs, {name: '', amount: '', isMandatory: true}])}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar Rubro
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {costs.map((cost, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded-lg">
                                    <input type="text" placeholder="Nombre (ej. Base, Transporte)" required className="p-2 border rounded-lg bg-white w-full sm:flex-1"
                                        value={cost.name} onChange={e => {
                                            const newCosts = [...costs];
                                            newCosts[idx].name = e.target.value;
                                            setCosts(newCosts);
                                        }} />
                                    <input type="number" placeholder="Monto ($)" required className="p-2 border rounded-lg bg-white w-full sm:w-32"
                                        value={cost.amount} onChange={e => {
                                            const newCosts = [...costs];
                                            newCosts[idx].amount = e.target.value;
                                            setCosts(newCosts);
                                        }} />
                                    <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap px-2">
                                        <input type="checkbox" className="rounded text-brand-primary"
                                            checked={cost.isMandatory} onChange={e => {
                                                const newCosts = [...costs];
                                                newCosts[idx].isMandatory = e.target.checked;
                                                setCosts(newCosts);
                                            }} />
                                        Obligatorio
                                    </label>
                                    <Button type="button" variant="ghost" size="icon" className="text-red-500 w-full sm:w-auto mt-2 sm:mt-0"
                                        onClick={() => setCosts(costs.filter((_, i) => i !== idx))}>
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                    </Button>
                                </div>
                            ))}
                            {costs.length === 0 && <p className="text-sm text-gray-500 italic">No hay estructura de costos definida (Opcional).</p>}
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Crear Evento'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
