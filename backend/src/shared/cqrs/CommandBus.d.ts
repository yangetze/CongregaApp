export interface ICommand {
}
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
    execute(command: TCommand): Promise<TResult>;
}
export declare class CommandBus {
    private handlers;
    register<TCommand extends ICommand, TResult>(commandName: string, handler: ICommandHandler<TCommand, TResult>): void;
    execute<TCommand extends ICommand, TResult>(commandName: string, command: TCommand): Promise<TResult>;
}
//# sourceMappingURL=CommandBus.d.ts.map