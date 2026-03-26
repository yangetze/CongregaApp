import express from "express";
import cors from "cors";

// Infrastructure
import { CommandBus } from "./shared/cqrs/CommandBus";
import { QueryBus } from "./shared/cqrs/QueryBus";

import { InMemoryPersonRepository } from "./infrastructure/repositories/InMemoryPersonRepository";
import { InMemoryEventRepository } from "./infrastructure/repositories/InMemoryEventRepository";
import { InMemoryEnrollmentRepository } from "./infrastructure/repositories/InMemoryEnrollmentRepository";
import { InMemoryGlobalConfigRepository } from "./infrastructure/repositories/admin/InMemoryGlobalConfigRepository";

// Application Handlers
import { CreatePersonCommandHandler } from "./application/commands/CreatePerson";
import { GetPeopleQueryHandler } from "./application/queries/GetPeople";
import { GetPersonByDocumentQueryHandler } from "./application/queries/GetPersonByDocument";
import { GetPersonEnrollmentsQueryHandler } from "./application/queries/GetPersonEnrollments";
import { CreateEventCommandHandler } from "./application/commands/CreateEvent";
import { EnrollPersonCommandHandler } from "./application/commands/EnrollPerson";
import { GetEventsQueryHandler } from "./application/queries/GetEvents";

// Controllers
import { PersonController } from "./infrastructure/controllers/PersonController";
import { EventController } from "./infrastructure/controllers/EventController";
import { AdminController } from "./infrastructure/controllers/admin/AdminController";

import fs from "fs";
import path from "path";

export const createApp = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Initialize CQRS Buses
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();

    // Initialize Repositories (In-Memory)
    const personRepository = new InMemoryPersonRepository();
    const eventRepository = new InMemoryEventRepository();
    const enrollmentRepository = new InMemoryEnrollmentRepository();
    const globalConfigRepository = new InMemoryGlobalConfigRepository();

    // Controllers
    const adminController = new AdminController(globalConfigRepository);

    // Register Handlers
    commandBus.register("CreatePersonCommand", new CreatePersonCommandHandler(personRepository));
    queryBus.register("GetPeopleQuery", new GetPeopleQueryHandler(personRepository));
    queryBus.register("GetPersonByDocumentQuery", new GetPersonByDocumentQueryHandler(personRepository));
    queryBus.register("GetPersonEnrollmentsQuery", new GetPersonEnrollmentsQueryHandler(enrollmentRepository));

    commandBus.register("CreateEventCommand", new CreateEventCommandHandler(eventRepository));
    commandBus.register("EnrollPersonCommand", new EnrollPersonCommandHandler(enrollmentRepository));
    queryBus.register("GetEventsQuery", new GetEventsQueryHandler(eventRepository));

    // Initialize Controllers
    const personController = new PersonController(commandBus, queryBus);
    const eventController = new EventController(commandBus, queryBus);

    // Routes
    const apiRouter = express.Router();

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

    return app;
};
