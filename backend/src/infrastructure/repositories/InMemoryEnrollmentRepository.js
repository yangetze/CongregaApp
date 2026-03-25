"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnrollmentRepository = void 0;
class InMemoryEnrollmentRepository {
    enrollments = [];
    async save(enrollment) {
        this.enrollments.push(enrollment);
    }
    async findByPersonId(personId) {
        return this.enrollments.filter(e => e.personId === personId);
    }
    async findByEventId(eventId) {
        return this.enrollments.filter(e => e.eventId === eventId);
    }
}
exports.InMemoryEnrollmentRepository = InMemoryEnrollmentRepository;
//# sourceMappingURL=InMemoryEnrollmentRepository.js.map