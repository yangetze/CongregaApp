import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Relationship, RelationshipType } from "../../domain/Relationship";
export declare class EstablishRelationshipCommand implements ICommand {
    readonly personId: string;
    readonly relatedPersonId: string;
    readonly relationshipType: RelationshipType;
    constructor(personId: string, relatedPersonId: string, relationshipType: RelationshipType);
}
export interface IRelationshipRepository {
    save(relationship: Relationship): Promise<void>;
    findByPersons(personId: string, relatedPersonId: string): Promise<Relationship | null>;
}
export declare class EstablishRelationshipCommandHandler implements ICommandHandler<EstablishRelationshipCommand, void> {
    private readonly relationshipRepository;
    constructor(relationshipRepository: IRelationshipRepository);
    execute(command: EstablishRelationshipCommand): Promise<void>;
}
//# sourceMappingURL=EstablishRelationship.d.ts.map