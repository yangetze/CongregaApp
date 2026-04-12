import { randomUUID } from "node:crypto";
import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Relationship, RelationshipType, getInverseRelationshipType } from "../../domain/Relationship";

export class EstablishRelationshipCommand implements ICommand {
    constructor(
        public readonly personId: string,
        public readonly relatedPersonId: string,
        public readonly relationshipType: RelationshipType
    ) {}
}

export interface IRelationshipRepository {
    save(relationship: Relationship): Promise<void>;
    findByPersons(personId: string, relatedPersonId: string): Promise<Relationship | null>;
}

export class EstablishRelationshipCommandHandler implements ICommandHandler<EstablishRelationshipCommand, void> {
    constructor(private readonly relationshipRepository: IRelationshipRepository) {}

    async execute(command: EstablishRelationshipCommand): Promise<void> {
        if (command.personId === command.relatedPersonId) {
            throw new Error("Cannot establish a relationship with oneself");
        }

        // Check if relationship already exists
        const existing = await this.relationshipRepository.findByPersons(command.personId, command.relatedPersonId);
        if (existing) {
            return; // Or update, but for now we just return
        }

        const id1 = randomUUID();
        const rel1 = new Relationship(
            id1,
            command.personId,
            command.relatedPersonId,
            command.relationshipType
        );

        const id2 = randomUUID();
        const rel2 = new Relationship(
            id2,
            command.relatedPersonId,
            command.personId,
            getInverseRelationshipType(command.relationshipType)
        );

        await this.relationshipRepository.save(rel1);
        await this.relationshipRepository.save(rel2);
    }
}
