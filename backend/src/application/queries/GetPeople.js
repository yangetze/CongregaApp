"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPeopleQueryHandler = exports.GetPeopleQuery = void 0;
class GetPeopleQuery {
    organizationId;
    constructor(organizationId) {
        this.organizationId = organizationId;
    }
}
exports.GetPeopleQuery = GetPeopleQuery;
class GetPeopleQueryHandler {
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async execute(query) {
        const allPeople = await this.personRepository.findAll();
        // Return only the ones matching the organization
        return allPeople.filter(p => p.organizationId === query.organizationId);
    }
}
exports.GetPeopleQueryHandler = GetPeopleQueryHandler;
//# sourceMappingURL=GetPeople.js.map