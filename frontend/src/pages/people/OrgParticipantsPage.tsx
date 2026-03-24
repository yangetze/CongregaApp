import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, UserCircle, Calendar, Phone, Mail } from 'lucide-react';

interface Person {
    id: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: string;
}

export default function OrgParticipantsPage() {
    const { orgId } = useParams();
    const [participants, setParticipants] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/api/people?organizationId=${orgId}`)
            .then(res => res.json())
            .then(data => {
                setParticipants(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [orgId]);

    const calculateAge = (birthDateString?: string) => {
        if (!birthDateString) return 'N/A';
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredParticipants = participants.filter(p =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Participantes</h1>
                    <p className="text-gray-500 mt-1">Gestiona el directorio de miembros y asistentes de tu organización.</p>
                </div>
                <button className="shrink-0 flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Nuevo Participante
                </button>
            </div>

            <div className="bg-white border border-surface-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-surface-border flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">Cargando participantes...</div>
                ) : filteredParticipants.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <UserCircle className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron participantes</h3>
                        <p className="text-gray-500 mt-1">No hay datos que coincidan con tu búsqueda.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-surface-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Nombre completo</th>
                                    <th className="px-6 py-4 font-medium">Contacto</th>
                                    <th className="px-6 py-4 font-medium text-center">Fecha de Nac.</th>
                                    <th className="px-6 py-4 font-medium text-center">Edad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.map((person) => (
                                    <tr key={person.id} className="border-b border-surface-border last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                                                    {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    {person.firstName} {person.lastName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            {person.email && (
                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {person.email}
                                                </div>
                                            )}
                                            {person.phone && (
                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {person.phone}
                                                </div>
                                            )}
                                            {!person.email && !person.phone && (
                                                <span className="text-gray-400 italic">Sin contacto</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {person.birthDate ? (
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {new Date(person.birthDate).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {calculateAge(person.birthDate)}
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
