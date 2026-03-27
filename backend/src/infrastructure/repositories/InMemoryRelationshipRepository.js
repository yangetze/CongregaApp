"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRelationshipRepository = void 0;
class InMemoryRelationshipRepository {
    relationships = [];
    async save(relationship) {
        this.relationships.push(relationship);
    }
    async findByPersons(personId, relatedPersonId) {
        return this.relationships.find(r => r.personId === personId && r.relatedPersonId === relatedPersonId) || null;
    }
}
exports.InMemoryRelationshipRepository = InMemoryRelationshipRepository;
//# sourceMappingURL=InMemoryRelationshipRepository.js.map