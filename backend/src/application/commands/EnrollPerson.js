"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollPersonCommandHandler = exports.EnrollPersonCommand = void 0;
const Event_1 = require("../../domain/Event");
class EnrollPersonCommand {
    eventId;
    personId;
    role;
    constructor(eventId, personId, role) {
        this.eventId = eventId;
        this.personId = personId;
        this.role = role;
    }
}
exports.EnrollPersonCommand = EnrollPersonCommand;
class EnrollPersonCommandHandler {
    enrollmentRepository;
    constructor(enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    async execute(command) {
        const id = Math.random().toString(36).substring(2, 9);
        const role = command.role || Event_1.EnrollmentRole.PARTICIPANT;
        const enrollment = new Event_1.Enrollment(id, command.eventId, command.personId, role);
        await this.enrollmentRepository.save(enrollment);
        return id;
    }
}
exports.EnrollPersonCommandHandler = EnrollPersonCommandHandler;
//# sourceMappingURL=EnrollPerson.js.map