import { Request, Response } from "express";
import { CommandBus } from "../../shared/cqrs/CommandBus";
import { QueryBus } from "../../shared/cqrs/QueryBus";
export declare class PersonController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    createPerson: (req: Request, res: Response) => Promise<void>;
    getPeople: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=PersonController.d.ts.map