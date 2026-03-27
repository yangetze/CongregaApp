import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
import { CreatePersonCommand } from "../../application/commands/CreatePerson";
import { GetPersonsQuery } from "../../application/queries/GetPersons";
import { GetPersonByDocumentQuery } from "../../application/queries/GetPersonByDocument";
import { GetPersonEnrollmentsQuery } from "../../application/queries/GetPersonEnrollments";
import { EstablishRelationshipCommand } from "../../application/commands/EstablishRelationship";

export class PersonController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    createPerson = async (req: Request, res: Response): Promise<void> => {
        try {
            const { firstName, lastName, email, organizationId, documentId, phone } = req.body;

            if (!firstName || !lastName || !organizationId) {
                res.status(400).json({ error: "Missing required fields: firstName, lastName, and organizationId are required." });
                return;
            }

            const parsedBirthDate = req.body.birthDate ? new Date(req.body.birthDate) : null;
            const command = new CreatePersonCommand(firstName, lastName, email, organizationId, documentId, phone, parsedBirthDate);
            const id = await this.commandBus.execute("CreatePersonCommand", command);
            res.status(201).json({ id, message: "Person created successfully" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };

    getPersons = async (req: Request, res: Response): Promise<void> => {
        try {
            const organizationId = req.query.organizationId as string;
            const search = req.query.search as string | undefined;

            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetPersonsQuery(organizationId, search);
            const persons: any = await this.queryBus.execute("GetPersonsQuery", query);

            // Format response to include calculated age getter as regular property
            const formattedPersons = persons.map((p: any) => ({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                organizationId: p.organizationId,
                documentId: p.documentId,
                phone: p.phone,
                birthDate: p.birthDate,
                age: p.age
            }));

            res.status(200).json(formattedPersons);
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
            const person: any = await this.queryBus.execute("GetPersonByDocumentQuery", query);

            if (!person) {
                res.status(404).json({ error: "Person not found" });
                return;
            }

            const formattedPerson = {
                id: person.id,
                firstName: person.firstName,
                lastName: person.lastName,
                email: person.email,
                organizationId: person.organizationId,
                documentId: person.documentId,
                phone: person.phone,
                birthDate: person.birthDate,
                age: person.age
            };

            res.status(200).json(formattedPerson);
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

    establishRelationship = async (req: Request, res: Response): Promise<void> => {
        try {
            const personId = req.params.personId as string;
            const { relatedPersonId, relationshipType } = req.body;

            if (!relatedPersonId || !relationshipType) {
                res.status(400).json({ error: "relatedPersonId and relationshipType are required" });
                return;
            }

            const command = new EstablishRelationshipCommand(personId, relatedPersonId, relationshipType);
            await this.commandBus.execute("EstablishRelationshipCommand", command);

            res.status(201).json({ message: "Relationship established successfully" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(400).json({ error: errorMessage });
        }
    };
}
