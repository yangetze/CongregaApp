import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, DollarSign, ArrowUpRight, Activity, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Transaction {
    id: string;
    organizationId: string;
    personId: string;
    personName: string;
    amount: number;
    currency: string;
    method: string;
    status: 'PENDING' | 'RECONCILED' | 'REJECTED';
    date: string;
    receiptNumber?: string;
}

type StatusFilter = 'ALL' | 'PENDING' | 'RECONCILED' | 'REJECTED';

export default function OrgFinancesPage() {
    const { orgId } = useParams();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/api/transactions?organizationId=${orgId}`, {
            headers: {
                'Authorization': 'Bearer mock-token'
            }
        })
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [orgId]);

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              t.method.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalReconciled = transactions
        .filter(t => t.status === 'RECONCILED')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const getStatusBadge = (status: Transaction['status']) => {
        switch (status) {
            case 'RECONCILED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Conciliado</span>;
            case 'PENDING':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">Por Conciliar</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Rechazado</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Finanzas</h1>
                    <p className="text-gray-500 mt-1">Gestiona los ingresos, abonos y transacciones de los participantes.</p>
                </div>
                <Button className="shrink-0 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Registrar Pago
                </Button>
            </div>

            {/* Resumen Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-surface-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ingresos Conciliados</p>
                        <p className="text-2xl font-bold text-gray-900">${totalReconciled.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-surface-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                        <Activity className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
                        <p className="text-2xl font-bold text-gray-900">{transactions.filter(t => t.status === 'PENDING').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-surface-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Transacciones</p>
                        <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-surface-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-surface-border flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por persona o método..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="w-full sm:w-auto text-sm border border-gray-300 rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white"
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="RECONCILED">Conciliados</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="REJECTED">Rechazados</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">Cargando transacciones...</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <DollarSign className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No hay transacciones</h3>
                        <p className="text-gray-500 mt-1">Intenta ajustando los filtros de búsqueda.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-surface-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Fecha</th>
                                    <th className="px-6 py-4 font-medium">Participante</th>
                                    <th className="px-6 py-4 font-medium">Método de Pago</th>
                                    <th className="px-6 py-4 font-medium text-right">Monto</th>
                                    <th className="px-6 py-4 font-medium text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-surface-border last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                                            {new Date(tx.date).toLocaleDateString()}
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {tx.personName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{tx.method}</span>
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold">{tx.currency}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold text-base ${tx.status === 'REJECTED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(tx.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
