"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Infrastructure
const CommandBus_1 = require("./shared/cqrs/CommandBus");
const QueryBus_1 = require("./shared/cqrs/QueryBus");
const InMemoryPersonRepository_1 = require("./infrastructure/repositories/InMemoryPersonRepository");
const InMemoryEventRepository_1 = require("./infrastructure/repositories/InMemoryEventRepository");
const InMemoryEnrollmentRepository_1 = require("./infrastructure/repositories/InMemoryEnrollmentRepository");
// Application Handlers
const CreatePerson_1 = require("./application/commands/CreatePerson");
const GetPeople_1 = require("./application/queries/GetPeople");
const GetPersonByDocument_1 = require("./application/queries/GetPersonByDocument");
const GetPersonEnrollments_1 = require("./application/queries/GetPersonEnrollments");
const CreateEvent_1 = require("./application/commands/CreateEvent");
const EnrollPerson_1 = require("./application/commands/EnrollPerson");
const GetEvents_1 = require("./application/queries/GetEvents");
// Controllers
const PersonController_1 = require("./infrastructure/controllers/PersonController");
const EventController_1 = require("./infrastructure/controllers/EventController");
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
const InMemoryGlobalConfigRepository_1 = require("./infrastructure/repositories/admin/InMemoryGlobalConfigRepository");
const globalConfigRepository = new InMemoryGlobalConfigRepository_1.InMemoryGlobalConfigRepository();
// Admin Controller
const AdminController_1 = require("./infrastructure/controllers/admin/AdminController");
const adminController = new AdminController_1.AdminController(globalConfigRepository);
// Register Handlers
commandBus.register("CreatePersonCommand", new CreatePerson_1.CreatePersonCommandHandler(personRepository));
queryBus.register("GetPeopleQuery", new GetPeople_1.GetPeopleQueryHandler(personRepository));
queryBus.register("GetPersonByDocumentQuery", new GetPersonByDocument_1.GetPersonByDocumentQueryHandler(personRepository));
queryBus.register("GetPersonEnrollmentsQuery", new GetPersonEnrollments_1.GetPersonEnrollmentsQueryHandler(enrollmentRepository));
commandBus.register("CreateEventCommand", new CreateEvent_1.CreateEventCommandHandler(eventRepository));
commandBus.register("EnrollPersonCommand", new EnrollPerson_1.EnrollPersonCommandHandler(enrollmentRepository));
queryBus.register("GetEventsQuery", new GetEvents_1.GetEventsQueryHandler(eventRepository));
// Initialize Controllers
const personController = new PersonController_1.PersonController(commandBus, queryBus);
const eventController = new EventController_1.EventController(commandBus, queryBus);
// Routes
const apiRouter = express_1.default.Router();
// Ensure these functions correctly map to express request handler types using bind if needed or arrow functions.
// Because the handlers are defined as arrow functions in the class, binding isn't strictly necessary, but using an explicit wrap helps prevent TypeError.
apiRouter.post("/people", (req, res) => personController.createPerson(req, res));
apiRouter.get("/people/document/:documentId", (req, res) => personController.getByDocument(req, res));
apiRouter.get("/people/:personId/enrollments", (req, res) => personController.getEnrollments(req, res));
apiRouter.get("/people", (req, res) => personController.getPeople(req, res));
apiRouter.post("/events", (req, res) => eventController.createEvent(req, res));
apiRouter.post("/events/:eventId/enroll", (req, res) => eventController.enrollPerson(req, res));
apiRouter.get("/events", (req, res) => eventController.getEvents(req, res));
// Admin Global Routes
apiRouter.get("/admin/payment-methods", adminController.getPaymentMethods);
apiRouter.post("/admin/payment-methods", adminController.createPaymentMethod);
apiRouter.get("/admin/event-statuses", adminController.getEventStatuses);
// --- MOCK API FOR UI DEMO ---
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getMockData = () => {
    const dataPath = path_1.default.join(__dirname, "infrastructure", "data", "db.json");
    return JSON.parse(fs_1.default.readFileSync(dataPath, "utf-8"));
};
apiRouter.get("/organizations", (req, res) => {
    const data = getMockData();
    res.json(data.organizations);
});
apiRouter.get("/users", (req, res) => {
    const data = getMockData();
    res.json(data.users);
});
apiRouter.get("/transactions", (req, res) => {
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
    res.send("CongregaApp API is running. Try /api/people or /api/events");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map