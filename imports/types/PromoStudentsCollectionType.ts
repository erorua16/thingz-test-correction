import { ObjectId } from "mongodb";

type StudentType = {
    firstName?:string,
    lastName?: string,
    firstAndLastName?:string
}

export type PromoStudentsCollectionType = {
    _id: ObjectId,
    name:string,
    students:StudentType[],
    createdAt: Date
}