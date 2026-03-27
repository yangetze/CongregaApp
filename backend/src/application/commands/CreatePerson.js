"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePersonCommandHandler = exports.CreatePersonCommand = void 0;
const node_crypto_1 = require("node:crypto");
const Person_1 = require("../../domain/Person");
// Command Definition
class CreatePersonCommand {
    firstName;
    lastName;
    email;
    organizationId;
    documentId;
    phone;
    birthDate;
    constructor(firstName, lastName, email, organizationId, documentId = null, phone = null, birthDate = null) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.organizationId = organizationId;
        this.documentId = documentId;
        this.phone = phone;
        this.birthDate = birthDate;
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
        // Prevent duplicates based on documentId and organizationId
        if (command.documentId) {
            const existingPerson = await this.personRepository.findByDocumentId(command.documentId);
            if (existingPerson && existingPerson.organizationId === command.organizationId) {
                // Return the existing person's ID instead of throwing an error or duplicating
                return existingPerson.id;
            }
        }
        // Simple mock ID generation
        const id = (0, node_crypto_1.randomUUID)();
        const person = new Person_1.Person(id, command.firstName, command.lastName, command.email, command.organizationId, command.documentId, command.phone, command.birthDate);
        await this.personRepository.save(person);
        return id;
    }
}
exports.CreatePersonCommandHandler = CreatePersonCommandHandler;
//# sourceMappingURL=CreatePerson.js.map