export interface IQuery {
    // Marker interface for queries
}

export interface IQueryHandler<TQuery extends IQuery, TResult> {
    execute(query: TQuery): Promise<TResult>;
}

export class QueryBus {
    private handlers: Map<string, any> = new Map();

    register<TQuery extends IQuery, TResult>(
        queryName: string,
        handler: IQueryHandler<TQuery, TResult>
    ) {
        this.handlers.set(queryName, handler);
    }

    async execute<TQuery extends IQuery, TResult>(
        queryName: string,
        query: TQuery
    ): Promise<TResult> {
        const handler = this.handlers.get(queryName);
        if (!handler) {
            throw new Error(`Query handler for ${queryName} not found.`);
        }
        return handler.execute(query);
    }
}
