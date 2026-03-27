import { Relationship } from "../../domain/Relationship";
import { IRelationshipRepository } from "../../application/commands/EstablishRelationship";

export class InMemoryRelationshipRepository implements IRelationshipRepository {
    private readonly relationships: Relationship[] = [];

    async save(relationship: Relationship): Promise<void> {
        this.relationships.push(relationship);
    }

    async findByPersons(personId: string, relatedPersonId: string): Promise<Relationship | null> {
        return this.relationships.find(r => r.personId === personId && r.relatedPersonId === relatedPersonId) || null;
    }
}
