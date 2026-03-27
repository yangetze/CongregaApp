import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
import { CreateEventCommand } from "../../application/commands/CreateEvent";
import { GetEventsQuery } from "../../application/queries/GetEvents";
import { EnrollPersonCommand } from "../../application/commands/EnrollPerson";

export class EventController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, startDate, endDate, totalCapacity, organizationId, hasCost, requirements, costs, tickets, statusId, organizers, participants } = req.body;
            const command = new CreateEventCommand(
                name,
                new Date(startDate),
                new Date(endDate),
                totalCapacity,
                organizationId,
                hasCost,
                requirements,
                costs,
                tickets,
                statusId
            );
            const id = await this.commandBus.execute("CreateEventCommand", command);

            // Enroll organizers if provided
            if (organizers && Array.isArray(organizers)) {
                for (const organizerId of organizers) {
                    const enrollCommand = new EnrollPersonCommand(String(id), organizerId, "STAFF");
                    await this.commandBus.execute("EnrollPersonCommand", enrollCommand);
                }
            }

            // Enroll participants if provided
            if (participants && Array.isArray(participants)) {
                for (const participantId of participants) {
                    const enrollCommand = new EnrollPersonCommand(String(id), participantId, "PARTICIPANT");
                    await this.commandBus.execute("EnrollPersonCommand", enrollCommand);
                }
            }

            res.status(201).json({ id, message: "Event created successfully" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };

    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const organizationId = req.query.organizationId as string;
            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetEventsQuery(organizationId);
            const events = await this.queryBus.execute("GetEventsQuery", query);
            res.status(200).json(events);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };

    enrollPerson = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = req.params.eventId as string;
            const { personId, role } = req.body;

            if (!eventId || !personId) {
                res.status(400).json({ error: "eventId and personId are required" });
                return;
            }

            const command = new EnrollPersonCommand(eventId, personId, role);
            const id = await this.commandBus.execute("EnrollPersonCommand", command);

            res.status(201).json({ id, message: "Person enrolled successfully" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    }
}
