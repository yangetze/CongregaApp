"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPersonRepository = void 0;
class InMemoryPersonRepository {
    persons = [];
    async save(person) {
        this.persons.push(person);
    }
    async findAll() {
        return this.persons;
    }
    async findById(id) {
        return this.persons.find(p => p.id === id) || null;
    }
}
exports.InMemoryPersonRepository = InMemoryPersonRepository;
//# sourceMappingURL=InMemoryPersonRepository.js.map