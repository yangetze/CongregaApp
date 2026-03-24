export interface ICommand {
    // Marker interface for commands
}

export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
    execute(command: TCommand): Promise<TResult>;
}

export class CommandBus {
    private handlers: Map<string, any> = new Map();

    register<TCommand extends ICommand, TResult>(
        commandName: string,
        handler: ICommandHandler<TCommand, TResult>
    ) {
        this.handlers.set(commandName, handler);
    }

    async execute<TCommand extends ICommand, TResult>(
        commandName: string,
        command: TCommand
    ): Promise<TResult> {
        const handler = this.handlers.get(commandName);
        if (!handler) {
            throw new Error(`Command handler for ${commandName} not found.`);
        }
        return handler.execute(command);
    }
}
