"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreatePerson_1 = require("../src/application/commands/CreatePerson");
const InMemoryPersonRepository_1 = require("../src/infrastructure/repositories/InMemoryPersonRepository");
describe("CreatePersonCommandHandler", () => {
    it("should create a person and return an id", async () => {
        // Arrange
        const repository = new InMemoryPersonRepository_1.InMemoryPersonRepository();
        const handler = new CreatePerson_1.CreatePersonCommandHandler(repository);
        const command = new CreatePerson_1.CreatePersonCommand("John", "Doe", "john.doe@example.com", "org-1");
        // Act
        const id = await handler.execute(command);
        const allPeople = await repository.findAll();
        // Assert
        expect(id).toBeDefined();
        expect(allPeople.length).toBe(1);
        expect(allPeople[0].firstName).toBe("John");
        expect(allPeople[0].email).toBe("john.doe@example.com");
    });
});
//# sourceMappingURL=CreatePerson.test.js.map