"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBus = void 0;
class QueryBus {
    handlers = new Map();
    register(queryName, handler) {
        this.handlers.set(queryName, handler);
    }
    async execute(queryName, query) {
        const handler = this.handlers.get(queryName);
        if (!handler) {
            throw new Error(`Query handler for ${queryName} not found.`);
        }
        return handler.execute(query);
    }
}
exports.QueryBus = QueryBus;
//# sourceMappingURL=QueryBus.js.map