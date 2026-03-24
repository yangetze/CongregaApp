import React, { useEffect, useState } from 'react';

interface EventData {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    totalCapacity: number;
    organizationId: string;
}

export const EventsList: React.FC = () => {
    const [events, setEvents] = useState<EventData[]>([]);

    useEffect(() => {
        // Hardcoded org ID for demo purposes
        fetch('http://localhost:3000/api/events?organizationId=org-123')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Events</h2>
            <ul>
                {events.map(e => (
                    <li key={e.id}>{e.name} (Cap: {e.totalCapacity})</li>
                ))}
            </ul>
        </div>
    );
};

export const CreateEvent: React.FC = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            totalCapacity: Number(formData.get('totalCapacity')),
            organizationId: 'org-123',
            costs: [
                { name: 'Base Ticket', amount: 50, isMandatory: true } // Demo data
            ]
        };

        await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        window.location.reload(); // naive refresh for demo
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Event</h3>
            <input name="name" placeholder="Event Name" required />
            <input name="startDate" type="date" required />
            <input name="endDate" type="date" required />
            <input name="totalCapacity" type="number" placeholder="Capacity" required />
            <button type="submit">Save</button>
        </form>
    );
};
