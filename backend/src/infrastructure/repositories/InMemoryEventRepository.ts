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
}
