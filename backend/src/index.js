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
// Application Handlers
const CreatePerson_1 = require("./application/commands/CreatePerson");
const GetPeople_1 = require("./application/queries/GetPeople");
const CreateEvent_1 = require("./application/commands/CreateEvent");
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
// Register Handlers
commandBus.register("CreatePersonCommand", new CreatePerson_1.CreatePersonCommandHandler(personRepository));
queryBus.register("GetPeopleQuery", new GetPeople_1.GetPeopleQueryHandler(personRepository));
commandBus.register("CreateEventCommand", new CreateEvent_1.CreateEventCommandHandler(eventRepository));
queryBus.register("GetEventsQuery", new GetEvents_1.GetEventsQueryHandler(eventRepository));
// Initialize Controllers
const personController = new PersonController_1.PersonController(commandBus, queryBus);
const eventController = new EventController_1.EventController(commandBus, queryBus);
// Routes
const apiRouter = express_1.default.Router();
apiRouter.post("/people", personController.createPerson);
apiRouter.get("/people", personController.getPeople);
apiRouter.post("/events", eventController.createEvent);
apiRouter.get("/events", eventController.getEvents);
app.use("/api", apiRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map