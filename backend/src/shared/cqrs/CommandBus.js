"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBus = void 0;
class CommandBus {
    handlers = new Map();
    register(commandName, handler) {
        this.handlers.set(commandName, handler);
    }
    async execute(commandName, command) {
        const handler = this.handlers.get(commandName);
        if (!handler) {
            throw new Error(`Command handler for ${commandName} not found.`);
        }
        return handler.execute(command);
    }
}
exports.CommandBus = CommandBus;
