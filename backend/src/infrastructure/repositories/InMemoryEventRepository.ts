import { Event } from "../../domain/Event";
import { IEventRepository } from "../../application/commands/CreateEvent";

export class InMemoryEventRepository implements IEventRepository {
    private readonly events: Event[] = [];

    async save(event: Event): Promise<void> {
        this.events.push(event);
    }

    async findAll(): Promise<Event[]> {
        return this.events;
    }

    async findById(id: string): Promise<Event | null> {
        return this.events.find(e => e.id === id) || null;
    }

    async findByOrganizationId(organizationId: string): Promise<Event[]> {
        return this.events.filter(e => e.organizationId === organizationId);
    }

    async getNextSequentialId(organizationId: string): Promise<number> {
        const orgEvents = this.events.filter(e => e.organizationId === organizationId);
        if (orgEvents.length === 0) {
            return 1;
        }
        const maxId = Math.max(...orgEvents.map(e => e.sequentialId || 0));
        return maxId + 1;
    }
}
