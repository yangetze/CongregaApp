import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
import { CreatePersonCommand } from "../../application/commands/CreatePerson";
import { GetPeopleQuery } from "../../application/queries/GetPeople";

export class PersonController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    createPerson = async (req: Request, res: Response): Promise<void> => {
        try {
            const { firstName, lastName, email, organizationId } = req.body;
            const command = new CreatePersonCommand(firstName, lastName, email, organizationId);
            const id = await this.commandBus.execute("CreatePersonCommand", command);
            res.status(201).json({ id, message: "Person created successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getPeople = async (req: Request, res: Response): Promise<void> => {
        try {
            const organizationId = req.query.organizationId as string;
            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetPeopleQuery(organizationId);
            const people = await this.queryBus.execute("GetPeopleQuery", query);
            res.status(200).json(people);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
