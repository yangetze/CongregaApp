import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
import { CreateEventCommand } from "../../application/commands/CreateEvent";
import { GetEventsQuery } from "../../application/queries/GetEvents";
import { GetEventEnrollmentsQuery } from "../../application/queries/GetEventEnrollments";
import { EnrollPersonCommand } from "../../application/commands/EnrollPerson";
import { handleControllerError } from "../utils/errorHandler";

export class EventController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, startDate, endDate, totalCapacity, organizationId, hasCost, requirements, costs, tickets, statusId, eventType, organizers, participants } = req.body;
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
                statusId,
                eventType
            );
            const id = await this.commandBus.execute("CreateEventCommand", command);

            // Enroll organizers if provided
            if (organizers && Array.isArray(organizers)) {
                const enrollmentPromises = organizers.map(organizerId => {
                    const enrollCommand = new EnrollPersonCommand(String(id), organizerId, "STAFF");
                    return this.commandBus.execute("EnrollPersonCommand", enrollCommand);
                });
                await Promise.all(enrollmentPromises);
            }

            // Enroll participants if provided
            if (participants && Array.isArray(participants)) {
                const enrollmentPromises = participants.map(participantId => {
                    const enrollCommand = new EnrollPersonCommand(String(id), participantId, "PARTICIPANT");
                    return this.commandBus.execute("EnrollPersonCommand", enrollCommand);
                });
                await Promise.all(enrollmentPromises);
            }

            res.status(201).json({ id, message: "Event created successfully" });
        } catch (error: unknown) {
            handleControllerError(res, error);
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
            handleControllerError(res, error);
        }
    };

    getEventEnrollments = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = req.params.eventId as string;

            if (!eventId) {
                res.status(400).json({ error: "eventId is required" });
                return;
            }

            const query = new GetEventEnrollmentsQuery(eventId);
            const enrollments = await this.queryBus.execute("GetEventEnrollmentsQuery", query);

            res.status(200).json(enrollments);
        } catch (error: unknown) {
            handleControllerError(res, error);
        }
    };

    enrollPerson = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = req.params.eventId as string;
            const { personId, role, ticketNumber } = req.body;

            if (!eventId || !personId) {
                res.status(400).json({ error: "eventId and personId are required" });
                return;
            }

            const command = new EnrollPersonCommand(eventId, personId, role, ticketNumber);
            const id = await this.commandBus.execute("EnrollPersonCommand", command);

            res.status(201).json({ id, message: "Person enrolled successfully" });
        } catch (error: unknown) {
            handleControllerError(res, error);
        }
    }
}
