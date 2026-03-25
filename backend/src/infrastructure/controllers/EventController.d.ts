import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
export declare class EventController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    createEvent: (req: Request, res: Response) => Promise<void>;
    getEvents: (req: Request, res: Response) => Promise<void>;
    enrollPerson: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=EventController.d.ts.map