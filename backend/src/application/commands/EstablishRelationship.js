"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishRelationshipCommandHandler = exports.EstablishRelationshipCommand = void 0;
const Relationship_1 = require("../../domain/Relationship");
class EstablishRelationshipCommand {
    personId;
    relatedPersonId;
    relationshipType;
    constructor(personId, relatedPersonId, relationshipType) {
        this.personId = personId;
        this.relatedPersonId = relatedPersonId;
        this.relationshipType = relationshipType;
    }
}
exports.EstablishRelationshipCommand = EstablishRelationshipCommand;
class EstablishRelationshipCommandHandler {
    relationshipRepository;
    constructor(relationshipRepository) {
        this.relationshipRepository = relationshipRepository;
    }
    async execute(command) {
        if (command.personId === command.relatedPersonId) {
            throw new Error("Cannot establish a relationship with oneself");
        }
        // Check if relationship already exists
        const existing = await this.relationshipRepository.findByPersons(command.personId, command.relatedPersonId);
        if (existing) {
            return; // Or update, but for now we just return
        }
        const id1 = Math.random().toString(36).substring(2, 9);
        const rel1 = new Relationship_1.Relationship(id1, command.personId, command.relatedPersonId, command.relationshipType);
        const id2 = Math.random().toString(36).substring(2, 9);
        const rel2 = new Relationship_1.Relationship(id2, command.relatedPersonId, command.personId, (0, Relationship_1.getInverseRelationshipType)(command.relationshipType));
        await this.relationshipRepository.save(rel1);
        await this.relationshipRepository.save(rel2);
    }
}
exports.EstablishRelationshipCommandHandler = EstablishRelationshipCommandHandler;
//# sourceMappingURL=EstablishRelationship.js.map