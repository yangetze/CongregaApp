import express from "express";
import cors from "cors";

// Infrastructure
import { CommandBus } from "./shared/cqrs/CommandBus";
import { QueryBus } from "./shared/cqrs/QueryBus";

import { InMemoryPersonRepository } from "./infrastructure/repositories/InMemoryPersonRepository";
import { InMemoryEventRepository } from "./infrastructure/repositories/InMemoryEventRepository";
import { InMemoryEnrollmentRepository } from "./infrastructure/repositories/InMemoryEnrollmentRepository";
import { InMemoryGlobalConfigRepository } from "./infrastructure/repositories/admin/InMemoryGlobalConfigRepository";
import { InMemoryRelationshipRepository } from "./infrastructure/repositories/InMemoryRelationshipRepository";

// Application Handlers
import { CreatePersonCommandHandler } from "./application/commands/CreatePerson";
import { GetPersonsQueryHandler } from "./application/queries/GetPersons";
import { GetPersonByDocumentQueryHandler } from "./application/queries/GetPersonByDocument";
import { GetPersonEnrollmentsQueryHandler } from "./application/queries/GetPersonEnrollments";
import { CreateEventCommandHandler } from "./application/commands/CreateEvent";
import { EnrollPersonCommandHandler } from "./application/commands/EnrollPerson";
import { GetEventsQueryHandler } from "./application/queries/GetEvents";
import { GetEventEnrollmentsQueryHandler } from "./application/queries/GetEventEnrollments";
import { EstablishRelationshipCommandHandler } from "./application/commands/EstablishRelationship";

// Controllers
import { PersonController } from "./infrastructure/controllers/PersonController";
import { EventController } from "./infrastructure/controllers/EventController";
import { AdminController } from "./infrastructure/controllers/admin/AdminController";

// Middleware
import { authMiddleware } from "./infrastructure/middleware/authMiddleware";

import fs from "fs";
import path from "path";

export const createApp = () => {
    const app = express();

    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
        : ["http://localhost:5173"];

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    }));

    app.use(express.json());

    // Initialize CQRS Buses
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();

    // Initialize Repositories (In-Memory)
    const personRepository = new InMemoryPersonRepository();
    const eventRepository = new InMemoryEventRepository();
    const enrollmentRepository = new InMemoryEnrollmentRepository();
    const globalConfigRepository = new InMemoryGlobalConfigRepository();
    const relationshipRepository = new InMemoryRelationshipRepository();

    // Controllers
    const adminController = new AdminController(globalConfigRepository);

    // Register Handlers
    commandBus.register("CreatePersonCommand", new CreatePersonCommandHandler(personRepository));
    queryBus.register("GetPersonsQuery", new GetPersonsQueryHandler(personRepository));
    queryBus.register("GetPersonByDocumentQuery", new GetPersonByDocumentQueryHandler(personRepository));
    queryBus.register("GetPersonEnrollmentsQuery", new GetPersonEnrollmentsQueryHandler(enrollmentRepository));
    commandBus.register("EstablishRelationshipCommand", new EstablishRelationshipCommandHandler(relationshipRepository));

    commandBus.register("CreateEventCommand", new CreateEventCommandHandler(eventRepository));
    commandBus.register("EnrollPersonCommand", new EnrollPersonCommandHandler(enrollmentRepository));
    queryBus.register("GetEventsQuery", new GetEventsQueryHandler(eventRepository));
    queryBus.register("GetEventEnrollmentsQuery", new GetEventEnrollmentsQueryHandler(enrollmentRepository));

    // Initialize Controllers
    const personController = new PersonController(commandBus, queryBus);
    const eventController = new EventController(commandBus, queryBus);

    // Routes
    const apiRouter = express.Router();

    // Global Authentication for all API routes
    apiRouter.use(authMiddleware);

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
    const getMockData = async () => {
      const dataPath = path.join(__dirname, "infrastructure", "data", "db.json");
      const content = await fs.promises.readFile(dataPath, "utf-8");
      return JSON.parse(content);
    };

    apiRouter.get("/organizations", async (req, res) => {
      const data = await getMockData();
      res.json(data.organizations);
    });

    apiRouter.get("/users", async (req, res) => {
      const data = await getMockData();
      res.json(data.users);
    });

    apiRouter.get("/transactions", async (req, res) => {
      const data = await getMockData();
      let transactions = data.transactions;

      if (req.query.organizationId) {
        transactions = transactions.filter((t: any) => t.organizationId === req.query.organizationId);
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
