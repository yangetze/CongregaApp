import React, { useEffect, useState } from 'react';

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organizationId: string;
}

export const PeopleList: React.FC = () => {
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        // Hardcoded org ID for demo purposes
        fetch('http://localhost:3000/api/people?organizationId=org-123')
            .then(res => res.json())
            .then(data => setPeople(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>People (CRM)</h2>
            <ul>
                {people.map(p => (
                    <li key={p.id}>{p.firstName} {p.lastName} - {p.email}</li>
                ))}
            </ul>
        </div>
    );
};

export const CreatePerson: React.FC = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            organizationId: 'org-123'
        };

        await fetch('http://localhost:3000/api/people', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        window.location.reload(); // naive refresh for demo
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Person</h3>
            <input name="firstName" placeholder="First Name" required />
            <input name="lastName" placeholder="Last Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <button type="submit">Save</button>
        </form>
    );
};
