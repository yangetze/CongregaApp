import { CreateEventCommand, CreateEventCommandHandler } from "../src/application/commands/CreateEvent";
import { InMemoryEventRepository } from "../src/infrastructure/repositories/InMemoryEventRepository";
import { EventType } from "../src/domain/Event";

describe("CreateEventCommandHandler", () => {
    let repository: InMemoryEventRepository;
    let handler: CreateEventCommandHandler;

    beforeEach(() => {
        repository = new InMemoryEventRepository();
        handler = new CreateEventCommandHandler(repository);
    });

    it("should create an event with provided tickets", async () => {
        // Arrange
        const command = new CreateEventCommand(
            "Test Event",
            new Date("2025-01-01"),
            new Date("2025-01-02"),
            null,
            "org-1",
            false,
            {},
            [],
            [{ name: "VIP", price: 100, quantity: 5 }]
        );

        // Act
        const id = await handler.execute(command);
        const event = await repository.findById(id);

        // Assert
        expect(id).toBeDefined();
        expect(event).toBeDefined();
        expect(event!.tickets.length).toBe(1);
        expect(event!.tickets[0]!.name).toBe("VIP");
        expect(event!.tickets[0]!.price).toBe(100);
        expect(event!.tickets[0]!.quantity).toBe(5);
        expect(event?.totalCapacity).toBe(5);
        expect(event?.eventType).toBe(EventType.REGULAR);
    });

    it("should create an event with default 'General' ticket when tickets array is empty", async () => {
        // Arrange
        const command = new CreateEventCommand(
            "Test Event",
            new Date("2025-01-01"),
            new Date("2025-01-02"),
            null,
            "org-1",
            false,
            {},
            [],
            [] // Empty tickets
        );

        // Act
        const id = await handler.execute(command);
        const event = await repository.findById(id);

        // Assert
        expect(id).toBeDefined();
        expect(event).toBeDefined();
        expect(event!.tickets.length).toBe(1);
        expect(event!.tickets[0]!.name).toBe("General");
        expect(event!.tickets[0]!.price).toBe(0);
        expect(event!.tickets[0]!.quantity).toBe(10);
        expect(event?.totalCapacity).toBe(10);
        expect(event?.eventType).toBe(EventType.REGULAR);
    });

    it("should create an event with default 'General' ticket when tickets parameter is omitted", async () => {
        // Arrange
        const command = new CreateEventCommand(
            "Test Event",
            new Date("2025-01-01"),
            new Date("2025-01-02"),
            null,
            "org-1"
            // tickets omitted, defaults to []
        );

        // Act
        const id = await handler.execute(command);
        const event = await repository.findById(id);

        // Assert
        expect(id).toBeDefined();
        expect(event).toBeDefined();
        expect(event!.tickets.length).toBe(1);
        expect(event!.tickets[0]!.name).toBe("General");
        expect(event?.totalCapacity).toBe(10);
        expect(event?.eventType).toBe(EventType.REGULAR);
    });

    it("should create an event with JORNADA type when specified", async () => {
        // Arrange
        const command = new CreateEventCommand(
            "Jornada Event",
            new Date("2025-02-01"),
            new Date("2025-02-02"),
            null,
            "org-1",
            false,
            {},
            [],
            [],
            "DRAFT",
            EventType.JORNADA
        );

        // Act
        const id = await handler.execute(command);
        const event = await repository.findById(id);

        // Assert
        expect(id).toBeDefined();
        expect(event).toBeDefined();
        expect(event?.eventType).toBe(EventType.JORNADA);
    });
});
