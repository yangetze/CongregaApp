import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, CreditCard, Activity, DollarSign, Database, Plus, Edit2, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type TabType = 'variables' | 'currencies' | 'payment-methods' | 'statuses';

export default function AdminMaintenancePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabType>('variables');

    // Sync tab with URL
    useEffect(() => {
        if (location.pathname.includes('/payment-methods')) {
            setActiveTab('payment-methods');
        } else if (location.pathname.includes('/event-statuses')) {
            setActiveTab('statuses');
        } else if (location.pathname.includes('/currencies')) {
            setActiveTab('currencies');
        } else {
            setActiveTab('variables');
        }
    }, [location]);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        if (tab === 'payment-methods') {
            navigate('/admin/payment-methods');
        } else if (tab === 'statuses') {
            navigate('/admin/event-statuses');
        } else if (tab === 'currencies') {
            navigate('/admin/currencies');
        } else {
            navigate('/admin/maintenance');
        }
    };

    // Data states
    const [variables, setVariables] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<any[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);

    // Edit variables state
    const [editingVarId, setEditingVarId] = useState<string | null>(null);
    const [editVarDesc, setEditVarDesc] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [varsRes, currRes, payRes, statRes] = await Promise.all([
                fetch('http://localhost:3000/api/admin/global-variables'),
                fetch('http://localhost:3000/api/admin/currencies'),
                fetch('http://localhost:3000/api/admin/payment-methods'),
                fetch('http://localhost:3000/api/admin/event-statuses')
            ]);

            if (varsRes.ok) setVariables(await varsRes.json());
            if (currRes.ok) setCurrencies(await currRes.json());
            if (payRes.ok) setPaymentMethods(await payRes.json());
            if (statRes.ok) setStatuses(await statRes.json());
        } catch (err) {
            console.error('Error fetching admin data', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditVariable = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/global-variables/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: editVarDesc })
            });
            if (res.ok) {
                setVariables(variables.map(v => v.id === id ? { ...v, description: editVarDesc } : v));
                setEditingVarId(null);
            } else {
                alert('Error actualizando variable');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-brand-primary" />
                        Mantenimiento
                    </h1>
                    <p className="text-gray-500 mt-1">Gestión de catálogos y configuraciones globales.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b border-surface-border">
                <button
                    onClick={() => handleTabChange('variables')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'variables' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <div className="flex items-center gap-2"><Database className="w-4 h-4" /> Variables Globales</div>
                </button>
                <button
                    onClick={() => handleTabChange('currencies')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'currencies' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Monedas</div>
                </button>
                <button
                    onClick={() => handleTabChange('payment-methods')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'payment-methods' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <div className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Métodos de Pago</div>
                </button>
                <button
                    onClick={() => handleTabChange('statuses')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'statuses' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Estados de Evento</div>
                </button>
            </div>

            <Card className="animate-in fade-in">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                        {activeTab === 'variables' && 'Variables Globales del Sistema'}
                        {activeTab === 'currencies' && 'Catálogo de Monedas'}
                        {activeTab === 'payment-methods' && 'Catálogo de Métodos de Pago'}
                        {activeTab === 'statuses' && 'Catálogo de Estados de Evento'}
                    </CardTitle>
                    {activeTab !== 'variables' && activeTab !== 'statuses' && (
                        <Button size="sm" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Agregar {activeTab === 'currencies' ? 'Moneda' : 'Método'}
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">Cargando...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-surface-border">
                                    {activeTab === 'variables' && (
                                        <tr>
                                            <th className="px-6 py-3">Variable</th>
                                            <th className="px-6 py-3">Módulo</th>
                                            <th className="px-6 py-3">Tipo</th>
                                            <th className="px-6 py-3">Descripción</th>
                                            <th className="px-6 py-3 text-right">Acciones</th>
                                        </tr>
                                    )}
                                    {activeTab === 'currencies' && (
                                        <tr>
                                            <th className="px-6 py-3">Código</th>
                                            <th className="px-6 py-3">Nombre</th>
                                            <th className="px-6 py-3">Símbolo</th>
                                        </tr>
                                    )}
                                    {activeTab === 'payment-methods' && (
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Nombre</th>
                                            <th className="px-6 py-3">Moneda</th>
                                        </tr>
                                    )}
                                    {activeTab === 'statuses' && (
                                        <tr>
                                            <th className="px-6 py-3">Código</th>
                                            <th className="px-6 py-3">Nombre</th>
                                            <th className="px-6 py-3">Descripción</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {activeTab === 'variables' && variables.map(v => (
                                        <tr key={v.id} className="bg-white border-b hover:bg-surface-background">
                                            <td className="px-6 py-4 font-mono font-medium text-gray-900">{v.name}</td>
                                            <td className="px-6 py-4"><Badge variant="default">{v.module}</Badge></td>
                                            <td className="px-6 py-4 text-xs font-mono text-brand-accent">{v.type}</td>
                                            <td className="px-6 py-4">
                                                {editingVarId === v.id ? (
                                                    <input
                                                        type="text"
                                                        value={editVarDesc}
                                                        onChange={e => setEditVarDesc(e.target.value)}
                                                        className="w-full px-2 py-1 border rounded"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    v.description
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingVarId === v.id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditVariable(v.id)} className="text-green-600 h-8 w-8"><Save className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingVarId(null)} className="text-red-600 h-8 w-8"><X className="w-4 h-4" /></Button>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="icon" onClick={() => { setEditingVarId(v.id); setEditVarDesc(v.description); }} className="h-8 w-8 text-brand-primary"><Edit2 className="w-4 h-4" /></Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'currencies' && currencies.map(c => (
                                        <tr key={c.id} className="bg-white border-b hover:bg-surface-background">
                                            <td className="px-6 py-4 font-bold text-gray-900">{c.code}</td>
                                            <td className="px-6 py-4">{c.name}</td>
                                            <td className="px-6 py-4 font-mono font-bold">{c.symbol}</td>
                                        </tr>
                                    ))}
                                    {activeTab === 'payment-methods' && paymentMethods.map(p => (
                                        <tr key={p.id} className="bg-white border-b hover:bg-surface-background">
                                            <td className="px-6 py-4 font-mono text-xs">{p.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                            <td className="px-6 py-4"><Badge>{p.currency}</Badge></td>
                                        </tr>
                                    ))}
                                    {activeTab === 'statuses' && statuses.map(s => (
                                        <tr key={s.id} className="bg-white border-b hover:bg-surface-background">
                                            <td className="px-6 py-4 font-bold text-gray-900">{s.id}</td>
                                            <td className="px-6 py-4"><Badge variant={s.id === 'PUBLISHED' ? 'success' : 'default'}>{s.name}</Badge></td>
                                            <td className="px-6 py-4">{s.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}