"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInverseRelationshipType = exports.Relationship = exports.RelationshipType = void 0;
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["PARENT"] = "PARENT";
    RelationshipType["CHILD"] = "CHILD";
    RelationshipType["SIBLING"] = "SIBLING";
    RelationshipType["SPOUSE"] = "SPOUSE";
    RelationshipType["OTHER"] = "OTHER";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
class Relationship {
    id;
    personId;
    relatedPersonId;
    relationshipType;
    constructor(id, personId, relatedPersonId, relationshipType) {
        this.id = id;
        this.personId = personId;
        this.relatedPersonId = relatedPersonId;
        this.relationshipType = relationshipType;
    }
}
exports.Relationship = Relationship;
const getInverseRelationshipType = (type) => {
    switch (type) {
        case RelationshipType.PARENT:
            return RelationshipType.CHILD;
        case RelationshipType.CHILD:
            return RelationshipType.PARENT;
        case RelationshipType.SIBLING:
            return RelationshipType.SIBLING;
        case RelationshipType.SPOUSE:
            return RelationshipType.SPOUSE;
        default:
            return RelationshipType.OTHER;
    }
};
exports.getInverseRelationshipType = getInverseRelationshipType;
//# sourceMappingURL=Relationship.js.map