import { EstablishRelationshipCommand, EstablishRelationshipCommandHandler } from "../src/application/commands/EstablishRelationship";
import { InMemoryRelationshipRepository } from "../src/infrastructure/repositories/InMemoryRelationshipRepository";
import { RelationshipType } from "../src/domain/Relationship";

describe("EstablishRelationshipCommandHandler", () => {
    it("should establish a bidirectional relationship with valid UUIDs", async () => {
        // Arrange
        const repository = new InMemoryRelationshipRepository();
        const handler = new EstablishRelationshipCommandHandler(repository);
        const personId = "person-1";
        const relatedPersonId = "person-2";
        const command = new EstablishRelationshipCommand(
            personId,
            relatedPersonId,
            RelationshipType.PARENT
        );

        // Act
        await handler.execute(command);

        // Assert
        // Check first relationship (person-1 is PARENT of person-2)
        const rel1 = await repository.findByPersons(personId, relatedPersonId);
        expect(rel1).not.toBeNull();
        // UUID v4 regex
        expect(rel1!.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        expect(rel1!.relationshipType).toBe(RelationshipType.PARENT);

        // Check second relationship (person-2 is CHILD of person-1)
        const rel2 = await repository.findByPersons(relatedPersonId, personId);
        expect(rel2).not.toBeNull();
        expect(rel2!.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        expect(rel2!.relationshipType).toBe(RelationshipType.CHILD);

        expect(rel1!.id).not.toBe(rel2!.id);
    });

    it("should throw error when establishing relationship with oneself", async () => {
        const repository = new InMemoryRelationshipRepository();
        const handler = new EstablishRelationshipCommandHandler(repository);
        const command = new EstablishRelationshipCommand(
            "person-1",
            "person-1",
            RelationshipType.PARENT
        );

        await expect(handler.execute(command)).rejects.toThrow("Cannot establish a relationship with oneself");
    });
});
