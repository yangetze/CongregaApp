"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const CreateEvent_1 = require("../../application/commands/CreateEvent");
const GetEvents_1 = require("../../application/queries/GetEvents");
class EventController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    createEvent = async (req, res) => {
        try {
            const { name, startDate, endDate, totalCapacity, organizationId, costs } = req.body;
            const command = new CreateEvent_1.CreateEventCommand(name, new Date(startDate), new Date(endDate), totalCapacity, organizationId, costs);
            const id = await this.commandBus.execute("CreateEventCommand", command);
            res.status(201).json({ id, message: "Event created successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    };
}
exports.EventController = EventController;
//# sourceMappingURL=EventController.js.map