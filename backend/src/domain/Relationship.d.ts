export declare enum RelationshipType {
    PARENT = "PARENT",
    CHILD = "CHILD",
    SIBLING = "SIBLING",
    SPOUSE = "SPOUSE",
    OTHER = "OTHER"
}
export declare class Relationship {
    readonly id: string;
    readonly personId: string;
    readonly relatedPersonId: string;
    readonly relationshipType: RelationshipType;
    constructor(id: string, personId: string, relatedPersonId: string, relationshipType: RelationshipType);
}
export declare const getInverseRelationshipType: (type: RelationshipType) => RelationshipType;
//# sourceMappingURL=Relationship.d.ts.map