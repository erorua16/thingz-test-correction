import { Meteor } from 'meteor/meteor';
import { TestFormCollection } from '../imports/api/TestFormCollection';
import { PromoStudentsCollection } from '../imports/api/PromoStudentsCollection';
import { StudentsTestsCorrectionsCollection } from '../imports/api/StudentsTestsCorrectionsCollection';

///////PROMOSTUDENTCOLLECTION PUBLISH///////
//Find all promos
Meteor.publish('findPromos', ()=> {
  return PromoStudentsCollection.find()
})
//Find one promo
Meteor.publish('findPromo' , (_id ) => {
  return PromoStudentsCollection.find({_id: _id})
})


//////TESTFORMCOLLECTION PUBLISH///////
//Find all tests
Meteor.publish('findTests', () => {
  return TestFormCollection.find()
})
//Find one test
Meteor.publish('findTest' , (_id ) => {
  return TestFormCollection.find({_id : _id})
})


///////TESTS AND PROMOS PUBLISH///////
Meteor.publish('FindOneTestAndPromo', (testId, promoId) => {
  return [
    TestFormCollection.find({_id : testId}),
    PromoStudentsCollection.find({_id: promoId})
  ]
})


///////STUDENTSTESTCORRECTIONS PUBLISH///////
Meteor.publish('findStudentsTestsCorrections', () => {
  return StudentsTestsCorrectionsCollection.find()
})
Meteor.publish('findStudentsTestsCorrectionsByTest', ({testId}) => {
  return StudentsTestsCorrectionsCollection.find({testId: `${testId}`})
})
Meteor.publish('findOneStudentTestsCorrections', ({questionNumber, testId, studentNumber}) => {
  return StudentsTestsCorrectionsCollection.find({questionNumber: questionNumber, testId: testId, studentNumber: studentNumber})
})

Meteor.startup(() => {
  

});