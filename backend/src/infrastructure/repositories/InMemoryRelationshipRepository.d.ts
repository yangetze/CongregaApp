import { Relationship } from "../../domain/Relationship";
import { IRelationshipRepository } from "../../application/commands/EstablishRelationship";
export declare class InMemoryRelationshipRepository implements IRelationshipRepository {
    private readonly relationships;
    save(relationship: Relationship): Promise<void>;
    findByPersons(personId: string, relatedPersonId: string): Promise<Relationship | null>;
}
//# sourceMappingURL=InMemoryRelationshipRepository.d.ts.map