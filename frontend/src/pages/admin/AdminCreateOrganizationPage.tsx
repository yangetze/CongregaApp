import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Building2 } from 'lucide-react';

export default function AdminCreateOrganizationPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [users, setUsers] = useState<{name: string, email: string}[]>([]);

    const handleAddUser = () => {
        setUsers([...users, { name: '', email: '' }]);
    };

    const handleRemoveUser = (index: number) => {
        const updated = [...users];
        updated.splice(index, 1);
        setUsers(updated);
    };

    const handleUserChange = (index: number, field: 'name' | 'email', value: string) => {
        const updated = [...users];
        updated[index][field] = value;
        setUsers(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            name,
            country,
            users
        };

        try {
            const res = await fetch('http://localhost:3000/api/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                navigate('/admin/organizations');
            } else {
                alert('Error al crear organización');
            }
        } catch (error) {
            console.error(error);
            alert('Error de red');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/admin/organizations')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Nueva Organización</h1>
                    <p className="text-gray-500 mt-1">Registra una nueva iglesia, campamento o ministerio.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-brand-primary" />
                            Datos Generales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nombre de la Organización *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Ej. Iglesia Vida Nueva"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">País *</label>
                                <input
                                    type="text"
                                    required
                                    value={country}
                                    onChange={e => setCountry(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Ej. Venezuela"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Usuarios Administradores</CardTitle>
                                <CardDescription>Personas que tendrán acceso para gestionar esta organización.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddUser} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Agregar Usuario
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {users.map((user, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="w-full space-y-2">
                                    <label className="text-xs font-medium text-gray-600">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        required
                                        value={user.name}
                                        onChange={e => handleUserChange(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div className="w-full space-y-2">
                                    <label className="text-xs font-medium text-gray-600">Correo Electrónico *</label>
                                    <input
                                        type="email"
                                        required
                                        value={user.email}
                                        onChange={e => handleUserChange(index, 'email', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveUser(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 mb-0.5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg">
                                No se han agregado usuarios. Es recomendable agregar al menos uno.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/organizations')}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Crear Organización'}
                    </Button>
                </div>
            </form>
        </div>
    );
}