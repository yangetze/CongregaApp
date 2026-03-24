import { useState, useEffect } from 'react';
import { Activity, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventStatus {
    id: string;
    name: string;
    description: string;
}

export default function AdminEventStatusesPage() {
    const [statuses, setStatuses] = useState<EventStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatuses = () => {
        setIsLoading(true);
        fetch('http://localhost:3000/api/admin/event-statuses')
            .then(res => res.json())
            .then(data => {
                setStatuses(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estados de Eventos</h1>
                    <p className="text-gray-500 mt-1">Catálogo de estados disponibles para todas las organizaciones</p>
                </div>
                <Button disabled className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Estado (Pronto)
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-surface-border overflow-hidden">
                <div className="p-4 border-b border-surface-border flex gap-4 bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Buscar estados..." className="w-full pl-9 pr-4 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Cargando estados...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-surface-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 font-medium">Identificador</th>
                                    <th className="px-6 py-4 font-medium">Descripción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border">
                                {statuses.map((status) => (
                                    <tr key={status.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-status-success/10 flex items-center justify-center text-status-success">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            {status.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="warning">{status.id}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {status.description}
                                        </td>
                                    </tr>
                                ))}
                                {statuses.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No hay estados registrados</td>
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
