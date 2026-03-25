"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPersonEnrollmentsQueryHandler = exports.GetPersonEnrollmentsQuery = void 0;
class GetPersonEnrollmentsQuery {
    personId;
    constructor(personId) {
        this.personId = personId;
    }
}
exports.GetPersonEnrollmentsQuery = GetPersonEnrollmentsQuery;
class GetPersonEnrollmentsQueryHandler {
    enrollmentRepository;
    constructor(enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    async execute(query) {
        return await this.enrollmentRepository.findByPersonId(query.personId);
    }
}
exports.GetPersonEnrollmentsQueryHandler = GetPersonEnrollmentsQueryHandler;
//# sourceMappingURL=GetPersonEnrollments.js.map