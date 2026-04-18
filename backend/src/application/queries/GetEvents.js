"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsQueryHandler = exports.GetEventsQuery = void 0;
class GetEventsQuery {
    organizationId;
    constructor(organizationId) {
        this.organizationId = organizationId;
    }
}
exports.GetEventsQuery = GetEventsQuery;
class GetEventsQueryHandler {
    eventRepository;
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async execute(query) {
        return await this.eventRepository.findByOrganizationId(query.organizationId);
    }
}
exports.GetEventsQueryHandler = GetEventsQueryHandler;
//# sourceMappingURL=GetEvents.js.map