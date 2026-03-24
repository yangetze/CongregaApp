"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonController = void 0;
const CreatePerson_1 = require("../../application/commands/CreatePerson");
const GetPeople_1 = require("../../application/queries/GetPeople");
class PersonController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    createPerson = async (req, res) => {
        try {
            const { firstName, lastName, email, organizationId } = req.body;
            const command = new CreatePerson_1.CreatePersonCommand(firstName, lastName, email, organizationId);
            const id = await this.commandBus.execute("CreatePersonCommand", command);
            res.status(201).json({ id, message: "Person created successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    getPeople = async (req, res) => {
        try {
            const organizationId = req.query.organizationId;
            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetPeople_1.GetPeopleQuery(organizationId);
            const people = await this.queryBus.execute("GetPeopleQuery", query);
            res.status(200).json(people);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
exports.PersonController = PersonController;
//# sourceMappingURL=PersonController.js.map