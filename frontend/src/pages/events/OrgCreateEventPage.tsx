import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function OrgCreateEventPage() {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [capacity, setCapacity] = useState('100');
    const [hasCost, setHasCost] = useState(false);

    // Dynamic Requirements
    const [requirements, setRequirements] = useState<Array<{key: string, value: string}>>([]);
    const availableReqKeys = ['minAge', 'maxAge', 'targetGender', 'requiresDocumentId'];

    // Budget / Costs
    const [costs, setCosts] = useState<Array<{name: string, amount: string, isMandatory: boolean}>>([]);

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

        const data = {
            name,
            startDate,
            endDate,
            totalCapacity: Number(capacity),
            organizationId: orgId,
            hasCost,
            requirements: reqObj,
            costs: formattedCosts
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                                <input required type="date" className="w-full p-2 border rounded-lg"
                                    value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin *</label>
                                <input required type="date" className="w-full p-2 border rounded-lg"
                                    value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Total *</label>
                                <input required type="number" min="1" className="w-full p-2 border rounded-lg"
                                    value={capacity} onChange={e => setCapacity(e.target.value)} />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                                        checked={hasCost} onChange={e => setHasCost(e.target.checked)} />
                                    <span className="text-sm font-medium text-gray-900">El evento tiene costo</span>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
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
                            <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                <select className="p-2 border rounded-lg bg-white flex-1"
                                    value={req.key} onChange={e => {
                                        const newReqs = [...requirements];
                                        newReqs[idx].key = e.target.value;
                                        setRequirements(newReqs);
                                    }}>
                                    {availableReqKeys.map(k => <option key={k} value={k}>{k}</option>)}
                                    <option value="custom">Otro (Personalizado)</option>
                                </select>
                                <input type="text" placeholder="Valor (ej. 18, FEMALE, true)" className="p-2 border rounded-lg bg-white flex-1"
                                    value={req.value} onChange={e => {
                                        const newReqs = [...requirements];
                                        newReqs[idx].value = e.target.value;
                                        setRequirements(newReqs);
                                    }} />
                                <Button type="button" variant="ghost" size="icon" className="text-red-500"
                                    onClick={() => setRequirements(requirements.filter((_, i) => i !== idx))}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {requirements.length === 0 && <p className="text-sm text-gray-500 italic">No hay requisitos dinámicos configurados.</p>}
                    </CardContent>
                </Card>

                {hasCost && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Estructura de Costos</CardTitle>
                                <CardDescription>Define el presupuesto y rubros a cobrar.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCosts([...costs, {name: '', amount: '', isMandatory: true}])}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar Rubro
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {costs.map((cost, idx) => (
                                <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                    <input type="text" placeholder="Nombre (ej. Base, Transporte)" required className="p-2 border rounded-lg bg-white flex-1"
                                        value={cost.name} onChange={e => {
                                            const newCosts = [...costs];
                                            newCosts[idx].name = e.target.value;
                                            setCosts(newCosts);
                                        }} />
                                    <input type="number" placeholder="Monto ($)" required className="p-2 border rounded-lg bg-white w-32"
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
                                    <Button type="button" variant="ghost" size="icon" className="text-red-500"
                                        onClick={() => setCosts(costs.filter((_, i) => i !== idx))}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {costs.length === 0 && <p className="text-sm text-red-500 font-medium">Si el evento tiene costo, debes agregar al menos un rubro.</p>}
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting || (hasCost && costs.length === 0)}>
                        {isSubmitting ? 'Guardando...' : 'Crear Evento'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
