import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
import { CreatePersonCommand } from "../../application/commands/CreatePerson";
import { GetPeopleQuery } from "../../application/queries/GetPeople";
import { GetPersonByDocumentQuery } from "../../application/queries/GetPersonByDocument";
import { GetPersonEnrollmentsQuery } from "../../application/queries/GetPersonEnrollments";

export class PersonController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    createPerson = async (req: Request, res: Response): Promise<void> => {
        try {
            const { firstName, lastName, email, organizationId, documentId, phone } = req.body;
            const command = new CreatePersonCommand(firstName, lastName, email, organizationId, documentId, phone);
            const id = await this.commandBus.execute("CreatePersonCommand", command);
            res.status(201).json({ id, message: "Person created successfully" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };

    getByDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            const documentId = req.params.documentId as string;
            const organizationId = req.query.organizationId as string;

            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }

            const query = new GetPersonByDocumentQuery(organizationId, documentId);
            const person = await this.queryBus.execute("GetPersonByDocumentQuery", query);

            if (!person) {
                res.status(404).json({ error: "Person not found" });
                return;
            }

            res.status(200).json(person);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };

    getEnrollments = async (req: Request, res: Response): Promise<void> => {
        try {
            const personId = req.params.personId as string;

            const query = new GetPersonEnrollmentsQuery(personId);
            const enrollments = await this.queryBus.execute("GetPersonEnrollmentsQuery", query);

            res.status(200).json(enrollments);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
}
