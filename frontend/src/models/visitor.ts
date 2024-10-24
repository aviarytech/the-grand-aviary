//This might need changing with the final copy with the actual fields
export interface Visitor {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}