import { ObjectId } from "mongodb";

export type TestFormCollectionType = {
    _id: ObjectId,
    promoId: ObjectId,
    name:string,
    questions:QuestionType[],
    createdAt: Date
}

export type QuestionType = {
    question: string;
    barem?: number;
    gradingCriteria: GradingCriteriaType[];
  };
  
export type GradingCriteriaType ={
    name: string;
    points: number;
};