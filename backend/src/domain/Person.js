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
    birthDate;
    constructor(id, firstName, lastName, email, organizationId, documentId = null, phone = null, birthDate = null) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.organizationId = organizationId;
        this.documentId = documentId;
        this.phone = phone;
        this.birthDate = birthDate;
    }
    get age() {
        if (!this.birthDate) {
            return null;
        }
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
exports.Person = Person;
