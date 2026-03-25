"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPersonByDocumentQueryHandler = exports.GetPersonByDocumentQuery = void 0;
class GetPersonByDocumentQuery {
    organizationId;
    documentId;
    constructor(organizationId, documentId) {
        this.organizationId = organizationId;
        this.documentId = documentId;
    }
}
exports.GetPersonByDocumentQuery = GetPersonByDocumentQuery;
class GetPersonByDocumentQueryHandler {
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async execute(query) {
        const person = await this.personRepository.findByDocumentId(query.documentId);
        if (person && person.organizationId === query.organizationId) {
            return person;
        }
        return null;
    }
}
exports.GetPersonByDocumentQueryHandler = GetPersonByDocumentQueryHandler;
//# sourceMappingURL=GetPersonByDocument.js.map