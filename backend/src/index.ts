import express from "express";
import cors from "cors";

// Infrastructure
import { CommandBus } from "./shared/cqrs/CommandBus";
import { QueryBus } from "./shared/cqrs/QueryBus";

import { InMemoryPersonRepository } from "./infrastructure/repositories/InMemoryPersonRepository";
import { InMemoryEventRepository } from "./infrastructure/repositories/InMemoryEventRepository";

// Application Handlers
import { CreatePersonCommandHandler } from "./application/commands/CreatePerson";
import { GetPeopleQueryHandler } from "./application/queries/GetPeople";
import { CreateEventCommandHandler } from "./application/commands/CreateEvent";
import { GetEventsQueryHandler } from "./application/queries/GetEvents";

// Controllers
import { PersonController } from "./infrastructure/controllers/PersonController";
import { EventController } from "./infrastructure/controllers/EventController";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize CQRS Buses
const commandBus = new CommandBus();
const queryBus = new QueryBus();

// Initialize Repositories (In-Memory)
const personRepository = new InMemoryPersonRepository();
const eventRepository = new InMemoryEventRepository();

// Register Handlers
commandBus.register("CreatePersonCommand", new CreatePersonCommandHandler(personRepository));
queryBus.register("GetPeopleQuery", new GetPeopleQueryHandler(personRepository));

commandBus.register("CreateEventCommand", new CreateEventCommandHandler(eventRepository));
queryBus.register("GetEventsQuery", new GetEventsQueryHandler(eventRepository));

// Initialize Controllers
const personController = new PersonController(commandBus, queryBus);
const eventController = new EventController(commandBus, queryBus);

// Routes
const apiRouter = express.Router();

apiRouter.post("/people", personController.createPerson);
apiRouter.get("/people", personController.getPeople);

apiRouter.post("/events", eventController.createEvent);
apiRouter.get("/events", eventController.getEvents);

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
