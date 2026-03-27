export enum RelationshipType {
    PARENT = "PARENT",
    CHILD = "CHILD",
    SIBLING = "SIBLING",
    SPOUSE = "SPOUSE",
    OTHER = "OTHER"
}

export class Relationship {
    constructor(
        public readonly id: string,
        public readonly personId: string,
        public readonly relatedPersonId: string,
        public readonly relationshipType: RelationshipType
    ) {}
}

export const getInverseRelationshipType = (type: RelationshipType): RelationshipType => {
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
