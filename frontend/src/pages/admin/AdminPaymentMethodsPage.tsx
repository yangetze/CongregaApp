import { useState, useEffect } from 'react';
import { CreditCard, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
    id: string;
    name: string;
    currency: string;
}

export default function AdminPaymentMethodsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newMethod, setNewMethod] = useState({ name: '', currency: '' });

    const fetchMethods = () => {
        setIsLoading(true);
        fetch('http://localhost:3000/api/admin/payment-methods')
            .then(res => res.json())
            .then(data => {
                setMethods(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/admin/payment-methods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMethod)
            });
            if (res.ok) {
                setNewMethod({ name: '', currency: '' });
                setIsCreating(false);
                fetchMethods();
            } else {
                alert('Error al crear el método de pago');
            }
        } catch (error) {
            console.error(error);
            alert('Hubo un error de conexión');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Métodos de Pago Globales</h1>
                    <p className="text-gray-500 mt-1">Catálogo de métodos disponibles para todas las organizaciones</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Método
                </Button>
            </div>

            {isCreating && (
                <Card className="bg-brand-background">
                    <CardHeader>
                        <CardTitle>Agregar Nuevo Método de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input required type="text" className="w-full p-2 border rounded" value={newMethod.name} onChange={e => setNewMethod({...newMethod, name: e.target.value})} placeholder="Ej. Zelle, PayPal" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                                    <input required type="text" className="w-full p-2 border rounded" value={newMethod.currency} onChange={e => setNewMethod({...newMethod, currency: e.target.value})} placeholder="Ej. USD, EUR" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
                                <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-surface-border overflow-hidden">
                <div className="p-4 border-b border-surface-border flex gap-4 bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Buscar métodos..." className="w-full pl-9 pr-4 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Cargando métodos...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-surface-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Método</th>
                                    <th className="px-6 py-4 font-medium">Moneda</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border">
                                {methods.map((method) => (
                                    <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            {method.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="info">{method.currency}</Badge>
                                        </td>
                                    </tr>
                                ))}
                                {methods.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500">No hay métodos registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
