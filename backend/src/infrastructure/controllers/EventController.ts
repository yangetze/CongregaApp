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
            const { name, startDate, endDate, totalCapacity, organizationId, hasCost, requirements, costs } = req.body;
            const command = new CreateEventCommand(
                name,
                new Date(startDate),
                new Date(endDate),
                totalCapacity,
                organizationId,
                hasCost,
                requirements,
                costs
            );
            const id = await this.commandBus.execute("CreateEventCommand", command);
            res.status(201).json({ id, message: "Event created successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
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
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    enrollPerson = async (req: Request, res: Response): Promise<void> => {
        try {
            const { eventId } = req.params;
            const { personId, role } = req.body;

            if (!eventId || !personId) {
                res.status(400).json({ error: "eventId and personId are required" });
                return;
            }

            const command = new EnrollPersonCommand(eventId, personId, role);
            const id = await this.commandBus.execute("EnrollPersonCommand", command);

            res.status(201).json({ id, message: "Person enrolled successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
