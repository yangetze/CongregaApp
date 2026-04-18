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
    async findByOrganizationId(organizationId) {
        return this.events.filter(e => e.organizationId === organizationId);
    }
    async getNextSequentialId(organizationId) {
        const orgEvents = this.events.filter(e => e.organizationId === organizationId);
        if (orgEvents.length === 0) {
            return 1;
        }
        const maxId = Math.max(...orgEvents.map(e => e.sequentialId || 0));
        return maxId + 1;
    }
}
exports.InMemoryEventRepository = InMemoryEventRepository;
//# sourceMappingURL=InMemoryEventRepository.js.map