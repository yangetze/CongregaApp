"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const CreateEvent_1 = require("../../application/commands/CreateEvent");
const GetEvents_1 = require("../../application/queries/GetEvents");
const EnrollPerson_1 = require("../../application/commands/EnrollPerson");
class EventController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    createEvent = async (req, res) => {
        try {
            const { name, startDate, endDate, totalCapacity, organizationId, hasCost, requirements, costs, tickets, statusId, organizers, participants } = req.body;
            const command = new CreateEvent_1.CreateEventCommand(name, new Date(startDate), new Date(endDate), totalCapacity, organizationId, hasCost, requirements, costs, tickets, statusId);
            const id = await this.commandBus.execute("CreateEventCommand", command);
            // Enroll organizers if provided
            if (organizers && Array.isArray(organizers)) {
                const enrollmentPromises = organizers.map(organizerId => {
                    const enrollCommand = new EnrollPerson_1.EnrollPersonCommand(String(id), organizerId, "STAFF");
                    return this.commandBus.execute("EnrollPersonCommand", enrollCommand);
                });
                await Promise.all(enrollmentPromises);
            }
            // Enroll participants if provided
            if (participants && Array.isArray(participants)) {
                const enrollmentPromises = participants.map(participantId => {
                    const enrollCommand = new EnrollPerson_1.EnrollPersonCommand(String(id), participantId, "PARTICIPANT");
                    return this.commandBus.execute("EnrollPersonCommand", enrollCommand);
                });
                await Promise.all(enrollmentPromises);
            }
            res.status(201).json({ id, message: "Event created successfully" });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
    getEvents = async (req, res) => {
        try {
            const organizationId = req.query.organizationId;
            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetEvents_1.GetEventsQuery(organizationId);
            const events = await this.queryBus.execute("GetEventsQuery", query);
            res.status(200).json(events);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
    enrollPerson = async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const { personId, role } = req.body;
            if (!eventId || !personId) {
                res.status(400).json({ error: "eventId and personId are required" });
                return;
            }
            const command = new EnrollPerson_1.EnrollPersonCommand(eventId, personId, role);
            const id = await this.commandBus.execute("EnrollPersonCommand", command);
            res.status(201).json({ id, message: "Person enrolled successfully" });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
}
exports.EventController = EventController;
//# sourceMappingURL=EventController.js.map