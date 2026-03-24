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
// apiRouter.get("/people", personController.getPeople);

apiRouter.post("/events", eventController.createEvent);
// apiRouter.get("/events", eventController.getEvents);

// --- MOCK API FOR UI DEMO ---
import fs from "fs";
import path from "path";

const getMockData = () => {
  const dataPath = path.join(__dirname, "infrastructure", "data", "db.json");
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
};

apiRouter.get("/organizations", (req, res) => {
  const data = getMockData();
  res.json(data.organizations);
});

apiRouter.get("/users", (req, res) => {
  const data = getMockData();
  res.json(data.users);
});

apiRouter.get("/events", (req, res) => {
  const data = getMockData();
  let events = data.events;

  if (req.query.organizationId) {
    events = events.filter((e: any) => e.organizationId === req.query.organizationId);
  }

  res.json(events);
});

apiRouter.get("/people", (req, res) => {
  const data = getMockData();
  let people = data.people;

  if (req.query.organizationId) {
    people = people.filter((p: any) => p.organizationId === req.query.organizationId);
  }

  res.json(people);
});

apiRouter.get("/transactions", (req, res) => {
  const data = getMockData();
  let transactions = data.transactions;

  if (req.query.organizationId) {
    transactions = transactions.filter((t: any) => t.organizationId === req.query.organizationId);
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
