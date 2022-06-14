import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';   
import { TestFormCollectionType } from '../types/TestFormCollectionType'

//@TODO
//Add simplSchema validation to the methods using validate

export const TestFormCollection = new Mongo.Collection<TestFormCollectionType>('TestForm')
Meteor.methods({
    insertTest({name, promoId, questions}){
        const test = TestFormCollection.insert(
            {
                name: name,
                createdAt: new Date(),
                promoId: promoId, 
                questions: questions
            },
            (error: any, result: any) => {
                if (error) return error; //info about what went wrong
                if (result) return result; //the _id of new object if successful
            }
        );
        return test
    },
    updateTest({questions, _id}) {
        return TestFormCollection.update(
            { _id: _id},
            {
              $set: { questions: questions },
            }
          );
    },
    updateOneTestQuestion({_id, idUpdate, questions}){
        TestFormCollection.update(
            { _id: _id },
            {
              $set: { [`questions.${idUpdate}`]: questions[idUpdate] },
            },
            {},
            function (error: any, result: any) {
              if (error) return error //info about what went wrong
              if (result) return result
            }
        );
    },
    updateTestGradingCriteria({_id, questionNumber, newCriterias}){
        return TestFormCollection.update(
            {_id: _id},
            {
                $set: { [`questions.${questionNumber}.gradingCriteria`] : newCriterias}
            }
        )
    }
})