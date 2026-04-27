"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonController = void 0;
const CreatePerson_1 = require("../../application/commands/CreatePerson");
const GetPersons_1 = require("../../application/queries/GetPersons");
const GetPersonByDocument_1 = require("../../application/queries/GetPersonByDocument");
const GetPersonEnrollments_1 = require("../../application/queries/GetPersonEnrollments");
const EstablishRelationship_1 = require("../../application/commands/EstablishRelationship");
const errorHandler_1 = require("../utils/errorHandler");
class PersonController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    createPerson = async (req, res) => {
        try {
            const { firstName, lastName, email, organizationId, documentId, phone } = req.body;
            if (!firstName || !lastName || !organizationId) {
                res.status(400).json({ error: "Missing required fields: firstName, lastName, and organizationId are required." });
                return;
            }
            const parsedBirthDate = req.body.birthDate ? new Date(req.body.birthDate) : null;
            const command = new CreatePerson_1.CreatePersonCommand(firstName, lastName, email, organizationId, documentId, phone, parsedBirthDate);
            const id = await this.commandBus.execute("CreatePersonCommand", command);
            res.status(201).json({ id, message: "Person created successfully" });
        }
        catch (error) {
            (0, errorHandler_1.handleControllerError)(res, error);
        }
    };
    getPersons = async (req, res) => {
        try {
            const organizationId = req.query.organizationId;
            const search = req.query.search;
            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetPersons_1.GetPersonsQuery(organizationId, search);
            const persons = await this.queryBus.execute("GetPersonsQuery", query);
            // Format response to include calculated age getter as regular property
            const formattedPersons = persons.map((p) => ({
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
        }
        catch (error) {
            (0, errorHandler_1.handleControllerError)(res, error);
        }
    };
    getByDocument = async (req, res) => {
        try {
            const documentId = req.params.documentId;
            const organizationId = req.query.organizationId;
            if (!organizationId) {
                res.status(400).json({ error: "organizationId is required" });
                return;
            }
            const query = new GetPersonByDocument_1.GetPersonByDocumentQuery(organizationId, documentId);
            const person = await this.queryBus.execute("GetPersonByDocumentQuery", query);
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
        }
        catch (error) {
            (0, errorHandler_1.handleControllerError)(res, error);
        }
    };
    getEnrollments = async (req, res) => {
        try {
            const personId = req.params.personId;
            const query = new GetPersonEnrollments_1.GetPersonEnrollmentsQuery(personId);
            const enrollments = await this.queryBus.execute("GetPersonEnrollmentsQuery", query);
            res.status(200).json(enrollments);
        }
        catch (error) {
            (0, errorHandler_1.handleControllerError)(res, error);
        }
    };
    establishRelationship = async (req, res) => {
        try {
            const personId = req.params.personId;
            const { relatedPersonId, relationshipType } = req.body;
            if (!relatedPersonId || !relationshipType) {
                res.status(400).json({ error: "relatedPersonId and relationshipType are required" });
                return;
            }
            const command = new EstablishRelationship_1.EstablishRelationshipCommand(personId, relatedPersonId, relationshipType);
            await this.commandBus.execute("EstablishRelationshipCommand", command);
            res.status(201).json({ message: "Relationship established successfully" });
        }
        catch (error) {
            (0, errorHandler_1.handleControllerError)(res, error, 400);
        }
    };
}
exports.PersonController = PersonController;
//# sourceMappingURL=PersonController.js.map