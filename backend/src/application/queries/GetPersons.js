"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPersonsQueryHandler = exports.GetPersonsQuery = void 0;
class GetPersonsQuery {
    organizationId;
    search;
    constructor(organizationId, search) {
        this.organizationId = organizationId;
        this.search = search;
    }
}
exports.GetPersonsQuery = GetPersonsQuery;
class GetPersonsQueryHandler {
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async execute(query) {
        const allPeople = await this.personRepository.findAll();
        let filtered = allPeople.filter(p => p.organizationId === query.organizationId);
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            filtered = filtered.filter(p => {
                const matchDocument = p.documentId?.toLowerCase().includes(searchLower);
                const matchFirst = p.firstName?.toLowerCase().includes(searchLower);
                const matchLast = p.lastName?.toLowerCase().includes(searchLower);
                const matchEmail = p.email?.toLowerCase().includes(searchLower);
                return matchDocument || matchFirst || matchLast || matchEmail;
            });
        }
        return filtered;
    }
}
exports.GetPersonsQueryHandler = GetPersonsQueryHandler;
//# sourceMappingURL=GetPersons.js.map