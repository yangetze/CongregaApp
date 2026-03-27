import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, UserCircle, Calendar, Phone, Mail, Activity, X } from 'lucide-react';
import { toast } from 'sonner';

interface Person {
    id: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: string;
    documentId?: string;
}

interface EnrollmentData {
    id: string;
    eventId: string;
    role: string;
    createdAt: string;
}

export default function OrgPeoplePage() {
    const { orgId } = useParams();
    const [people, setPeople] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [personEnrollments, setPersonEnrollments] = useState<EnrollmentData[]>([]);
    const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentId: '',
        birthDate: ''
    });

    const fetchPeople = () => {
        setIsLoading(true);
        fetch(`http://localhost:3000/api/people?organizationId=${orgId}`)
            .then(res => res.json())
            .then(data => {
                setPeople(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPeople();
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

    const handleViewPerson = async (personId: string) => {
        if (selectedPersonId === personId) {
            setSelectedPersonId(null);
            return;
        }

        setSelectedPersonId(personId);
        setIsLoadingEnrollments(true);
        setPersonEnrollments([]);

        try {
            const res = await fetch(`http://localhost:3000/api/people/${personId}/enrollments`);
            if (res.ok) {
                const data = await res.json();
                setPersonEnrollments(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingEnrollments(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreatePerson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName) {
            toast.error('El nombre y apellido son obligatorios');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:3000/api/persons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    organizationId: orgId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Ocurrió un error al guardar la persona');
                return;
            }

            toast.success('Persona agregada exitosamente');
            setIsModalOpen(false);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', documentId: '', birthDate: '' });
            fetchPeople();
        } catch (error) {
            console.error(error);
            toast.error('No se pudo conectar con el servidor');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredPeople = people.filter(p =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Directorio de Personas</h1>
                    <p className="text-gray-500 mt-1">Gestiona el directorio general de miembros y asistentes de tu organización.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="shrink-0 flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Persona
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
                    <div className="p-12 text-center text-gray-500">Cargando personas...</div>
                ) : filteredPeople.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <UserCircle className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron personas</h3>
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
                                {filteredPeople.map((person) => (
                                    <React.Fragment key={person.id}>
                                    <tr onClick={() => handleViewPerson(person.id)} className="cursor-pointer border-b border-surface-border last:border-0 hover:bg-gray-50/50 transition-colors">
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
                                    {selectedPersonId === person.id && (
                                        <tr className="bg-brand-primary/5 border-b border-surface-border">
                                            <td colSpan={4} className="px-6 py-6">
                                                <div className="bg-white rounded-lg p-4 border border-brand-primary/20 shadow-sm">
                                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-brand-primary" />
                                                        Historial de Eventos (Inscripciones)
                                                    </h4>

                                                    {isLoadingEnrollments ? (
                                                        <p className="text-sm text-gray-500 italic">Cargando historial...</p>
                                                    ) : personEnrollments.length === 0 ? (
                                                        <p className="text-sm text-gray-500 italic">No hay inscripciones registradas para esta persona.</p>
                                                    ) : (
                                                        <ul className="space-y-3">
                                                            {personEnrollments.map((enrollment, idx) => (
                                                                <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                                    <div>
                                                                        <span className="font-medium text-gray-900">ID de Evento: {enrollment.eventId}</span>
                                                                        <span className="text-gray-500 ml-3">Rol: {enrollment.role}</span>
                                                                    </div>
                                                                    <span className="text-gray-400 text-xs">
                                                                        Inscrito el {new Date(enrollment.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal para Agregar Persona */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">Nueva Persona</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePerson} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        placeholder="Ej. Juan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        placeholder="Ej. Pérez"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula / Documento</label>
                                <input
                                    type="text"
                                    name="documentId"
                                    value={formData.documentId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    placeholder="Ej. V-12345678"
                                />
                                <p className="mt-1 text-xs text-gray-500">Útil para evitar duplicados en el directorio.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        placeholder="+58 412..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Persona'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
