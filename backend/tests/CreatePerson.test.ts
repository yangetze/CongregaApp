import { CreatePersonCommand, CreatePersonCommandHandler } from "../src/application/commands/CreatePerson";
import { InMemoryPersonRepository } from "../src/infrastructure/repositories/InMemoryPersonRepository";

describe("CreatePersonCommandHandler", () => {
    it("should create a person and return an id", async () => {
        // Arrange
        const repository = new InMemoryPersonRepository();
        const handler = new CreatePersonCommandHandler(repository);
        const command = new CreatePersonCommand(
            "John",
            "Doe",
            "john.doe@example.com",
            "org-1"
        );

        // Act
        const id = await handler.execute(command);
        const allPeople = await repository.findAll();

        // Assert
        expect(id).toBeDefined();
        expect(allPeople.length).toBe(1);
        expect(allPeople[0]!.firstName).toBe("John");
        expect(allPeople[0]!.email).toBe("john.doe@example.com");
    });
});
