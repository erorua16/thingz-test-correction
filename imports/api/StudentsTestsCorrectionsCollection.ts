import { Mongo } from 'meteor/mongo';   
import { Meteor } from "meteor/meteor";
import { StudentsTestsCorrectionsCollectionType } from "/imports/types/StudentsTestsCorrectionsCollectionType"

export const StudentsTestsCorrectionsCollection = new Mongo.Collection<StudentsTestsCorrectionsCollectionType>('StudentsTestsCorrections')

Meteor.methods({
    insertGrade({studentNumber, questionNumber, testId, points}){
        return StudentsTestsCorrectionsCollection.insert(
            {
                testId: testId,
                questionNumber : questionNumber,
                studentNumber: studentNumber,
                points: points,
                createdAt: new Date()
            })
    },
    updateStudentGrade( {_id , points}){
        return StudentsTestsCorrectionsCollection.update({_id: _id}, {
            $set: {
                points : points            
            }
          })
    }
})