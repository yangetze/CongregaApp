"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Infrastructure
const CommandBus_1 = require("./shared/cqrs/CommandBus");
const QueryBus_1 = require("./shared/cqrs/QueryBus");
const InMemoryPersonRepository_1 = require("./infrastructure/repositories/InMemoryPersonRepository");
const InMemoryEventRepository_1 = require("./infrastructure/repositories/InMemoryEventRepository");
const InMemoryEnrollmentRepository_1 = require("./infrastructure/repositories/InMemoryEnrollmentRepository");
const InMemoryGlobalConfigRepository_1 = require("./infrastructure/repositories/admin/InMemoryGlobalConfigRepository");
const InMemoryRelationshipRepository_1 = require("./infrastructure/repositories/InMemoryRelationshipRepository");
// Application Handlers
const CreatePerson_1 = require("./application/commands/CreatePerson");
const GetPersons_1 = require("./application/queries/GetPersons");
const GetPersonByDocument_1 = require("./application/queries/GetPersonByDocument");
const GetPersonEnrollments_1 = require("./application/queries/GetPersonEnrollments");
const CreateEvent_1 = require("./application/commands/CreateEvent");
const EnrollPerson_1 = require("./application/commands/EnrollPerson");
const GetEvents_1 = require("./application/queries/GetEvents");
const GetEventEnrollments_1 = require("./application/queries/GetEventEnrollments");
const EstablishRelationship_1 = require("./application/commands/EstablishRelationship");
// Controllers
const PersonController_1 = require("./infrastructure/controllers/PersonController");
const EventController_1 = require("./infrastructure/controllers/EventController");
const AdminController_1 = require("./infrastructure/controllers/admin/AdminController");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Initialize CQRS Buses
    const commandBus = new CommandBus_1.CommandBus();
    const queryBus = new QueryBus_1.QueryBus();
    // Initialize Repositories (In-Memory)
    const personRepository = new InMemoryPersonRepository_1.InMemoryPersonRepository();
    const eventRepository = new InMemoryEventRepository_1.InMemoryEventRepository();
    const enrollmentRepository = new InMemoryEnrollmentRepository_1.InMemoryEnrollmentRepository();
    const globalConfigRepository = new InMemoryGlobalConfigRepository_1.InMemoryGlobalConfigRepository();
    const relationshipRepository = new InMemoryRelationshipRepository_1.InMemoryRelationshipRepository();
    // Controllers
    const adminController = new AdminController_1.AdminController(globalConfigRepository);
    // Register Handlers
    commandBus.register("CreatePersonCommand", new CreatePerson_1.CreatePersonCommandHandler(personRepository));
    queryBus.register("GetPersonsQuery", new GetPersons_1.GetPersonsQueryHandler(personRepository));
    queryBus.register("GetPersonByDocumentQuery", new GetPersonByDocument_1.GetPersonByDocumentQueryHandler(personRepository));
    queryBus.register("GetPersonEnrollmentsQuery", new GetPersonEnrollments_1.GetPersonEnrollmentsQueryHandler(enrollmentRepository));
    commandBus.register("EstablishRelationshipCommand", new EstablishRelationship_1.EstablishRelationshipCommandHandler(relationshipRepository));
    commandBus.register("CreateEventCommand", new CreateEvent_1.CreateEventCommandHandler(eventRepository));
    commandBus.register("EnrollPersonCommand", new EnrollPerson_1.EnrollPersonCommandHandler(enrollmentRepository));
    queryBus.register("GetEventsQuery", new GetEvents_1.GetEventsQueryHandler(eventRepository));
    queryBus.register("GetEventEnrollmentsQuery", new GetEventEnrollments_1.GetEventEnrollmentsQueryHandler(enrollmentRepository));
    // Initialize Controllers
    const personController = new PersonController_1.PersonController(commandBus, queryBus);
    const eventController = new EventController_1.EventController(commandBus, queryBus);
    // Routes
    const apiRouter = express_1.default.Router();
    apiRouter.post("/persons", (req, res) => personController.createPerson(req, res));
    apiRouter.get("/persons/document/:documentId", (req, res) => personController.getByDocument(req, res));
    apiRouter.get("/persons/:personId/enrollments", (req, res) => personController.getEnrollments(req, res));
    apiRouter.get("/persons", (req, res) => personController.getPersons(req, res));
    apiRouter.post("/persons/:personId/relationships", (req, res) => personController.establishRelationship(req, res));
    apiRouter.post("/events", (req, res) => eventController.createEvent(req, res));
    apiRouter.post("/events/:eventId/enroll", (req, res) => eventController.enrollPerson(req, res));
    apiRouter.get("/events/:eventId/enrollments", (req, res) => eventController.getEventEnrollments(req, res));
    apiRouter.get("/events", (req, res) => eventController.getEvents(req, res));
    // Admin Global Routes
    apiRouter.get("/admin/payment-methods", adminController.getPaymentMethods);
    apiRouter.post("/admin/payment-methods", adminController.createPaymentMethod);
    apiRouter.get("/admin/event-statuses", adminController.getEventStatuses);
    // --- MOCK API FOR UI DEMO ---
    const mockAuthMiddleware = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== "Bearer mock-token") {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        next();
    };
    const getMockData = () => {
        const dataPath = path_1.default.join(__dirname, "infrastructure", "data", "db.json");
        return JSON.parse(fs_1.default.readFileSync(dataPath, "utf-8"));
    };
    apiRouter.get("/organizations", mockAuthMiddleware, (req, res) => {
        const data = getMockData();
        res.json(data.organizations);
    });
    apiRouter.get("/users", mockAuthMiddleware, (req, res) => {
        const data = getMockData();
        res.json(data.users);
    });
    apiRouter.get("/transactions", mockAuthMiddleware, (req, res) => {
        const data = getMockData();
        let transactions = data.transactions;
        if (req.query.organizationId) {
            transactions = transactions.filter((t) => t.organizationId === req.query.organizationId);
        }
        res.json(transactions);
    });
    // -----------------------------
    app.use("/api", apiRouter);
    app.get("/", (req, res) => {
        res.send("CongregaApp API is running. Try /api/persons or /api/events");
    });
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map