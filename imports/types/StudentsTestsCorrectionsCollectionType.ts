import { ObjectId } from "mongodb";
export type StudentsTestsCorrectionsCollectionType = {
    _id: ObjectId,
    testId: string,
    questionNumber : number,
    studentNumber: number,
    points: number,
    createdAt: Date
}