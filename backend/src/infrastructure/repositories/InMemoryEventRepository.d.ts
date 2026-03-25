import { Event } from "../../domain/Event";
import { IEventRepository } from "../../application/commands/CreateEvent";
export declare class InMemoryEventRepository implements IEventRepository {
    private readonly events;
    save(event: Event): Promise<void>;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event | null>;
    getNextSequentialId(organizationId: string): Promise<number>;
}
//# sourceMappingURL=InMemoryEventRepository.d.ts.map