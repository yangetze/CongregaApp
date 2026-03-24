"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePersonCommandHandler = exports.CreatePersonCommand = void 0;
const Person_1 = require("../../domain/Person");
// Command Definition
class CreatePersonCommand {
    firstName;
    lastName;
    email;
    organizationId;
    constructor(firstName, lastName, email, organizationId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.organizationId = organizationId;
    }
}
exports.CreatePersonCommand = CreatePersonCommand;
// Command Handler
class CreatePersonCommandHandler {
    personRepository;
    constructor(personRepository) {
        this.personRepository = personRepository;
    }
    async execute(command) {
        // Simple mock ID generation
        const id = Math.random().toString(36).substring(2, 9);
        const person = new Person_1.Person(id, command.firstName, command.lastName, command.email, command.organizationId);
        await this.personRepository.save(person);
        return id;
    }
}
exports.CreatePersonCommandHandler = CreatePersonCommandHandler;
//# sourceMappingURL=CreatePerson.js.map