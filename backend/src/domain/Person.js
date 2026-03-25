"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
class Person {
    id;
    firstName;
    lastName;
    email;
    organizationId;
    documentId;
    phone;
    constructor(id, firstName, lastName, email, organizationId, documentId = null, phone = null) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.organizationId = organizationId;
        this.documentId = documentId;
        this.phone = phone;
    }
}
exports.Person = Person;
//# sourceMappingURL=Person.js.map