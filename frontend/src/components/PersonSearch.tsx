import { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    documentId?: string;
}

interface PersonSearchProps {
    people: Person[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    placeholder?: string;
}

export function PersonSearch({ people, selectedIds, onSelect, onRemove, placeholder = 'Buscar por nombre, apellido o cédula...' }: PersonSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredPeople = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const lowerTerm = searchTerm.toLowerCase();
        return people.filter(p => {
            const matchesFirst = p.firstName?.toLowerCase().includes(lowerTerm);
            const matchesLast = p.lastName?.toLowerCase().includes(lowerTerm);
            const matchesDoc = p.documentId?.toLowerCase().includes(lowerTerm);
            return matchesFirst || matchesLast || matchesDoc;
        });
    }, [people, searchTerm]);

    const handleSelect = (person: Person) => {
        if (!selectedIds.includes(person.id)) {
            onSelect(person.id);
        }
        setSearchTerm('');
        setIsOpen(false);
    };

    const selectedPeople = people.filter(p => selectedIds.includes(p.id));

    return (
        <div className="space-y-3">
            <div className="relative" ref={wrapperRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => {
                            if (searchTerm.trim()) setIsOpen(true);
                        }}
                    />
                </div>

                {isOpen && searchTerm.trim() && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredPeople.length > 0 ? (
                            <ul className="py-1">
                                {filteredPeople.map((person) => {
                                    const isSelected = selectedIds.includes(person.id);
                                    return (
                                        <li
                                            key={person.id}
                                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center ${
                                                isSelected ? 'bg-gray-50 opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={() => !isSelected && handleSelect(person)}
                                        >
                                            <span className="font-medium">
                                                {person.firstName} {person.lastName}
                                            </span>
                                            {person.documentId && (
                                                <span className="text-gray-500 text-xs">C.I: {person.documentId}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No se encontraron resultados.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected items list */}
            {selectedPeople.length > 0 ? (
                <div className="flex flex-col gap-2 border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                    {selectedPeople.map(person => (
                        <div key={person.id} className="flex justify-between items-center bg-white border rounded p-2 text-sm">
                            <span className="font-medium text-gray-900">
                                {person.firstName} {person.lastName} {person.documentId ? <span className="text-gray-500 font-normal">({person.documentId})</span> : ''}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onRemove(person.id)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-sm text-gray-500 italic">No hay personas seleccionadas.</p>
                </div>
            )}
        </div>
    );
}
