"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEventRepository = void 0;
class InMemoryEventRepository {
    events = [];
    async save(event) {
        this.events.push(event);
    }
    async findAll() {
        return this.events;
    }
    async findById(id) {
        return this.events.find(e => e.id === id) || null;
    }
}
exports.InMemoryEventRepository = InMemoryEventRepository;
//# sourceMappingURL=InMemoryEventRepository.js.map