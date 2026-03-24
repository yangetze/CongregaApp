export interface IQuery {
}
export interface IQueryHandler<TQuery extends IQuery, TResult> {
    execute(query: TQuery): Promise<TResult>;
}
export declare class QueryBus {
    private handlers;
    register<TQuery extends IQuery, TResult>(queryName: string, handler: IQueryHandler<TQuery, TResult>): void;
    execute<TQuery extends IQuery, TResult>(queryName: string, query: TQuery): Promise<TResult>;
}
//# sourceMappingURL=QueryBus.d.ts.map