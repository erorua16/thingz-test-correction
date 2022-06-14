import React from "react";
import { Meteor } from "meteor/meteor";
import { PromoStudentsCollection } from "../api/PromoStudentsCollection";
import { TestFormCollection } from "../api/TestFormCollection";
import { useParams } from "react-router-dom";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { GradingCriteriaType } from "../types/TestFormCollectionType";
import { TestFormCollectionType } from "../types/TestFormCollectionType";
import { PromoStudentsCollectionType } from "../types/PromoStudentsCollectionType";
import { StudentsTestsCorrectionsCollectionType } from "/imports/types/StudentsTestsCorrectionsCollectionType";
import { StudentsTestsCorrectionsCollection } from "../api/StudentsTestsCorrectionsCollection";

const IdvTestGrades = () => {
  //Use params
  const { testId }: any = useParams<string>();
  const { promoId }: any = useParams<string>();
  //Is loading
  const isLoadingPromo = useSubscribe("findPromo", promoId);
  const isLoadingTest = useSubscribe("findTest", testId);
  const isLoadingCorrections = useSubscribe(
    "findStudentsTestsCorrectionsByTest",
    {
      testId,
    },
    []
  );
  //DB results
  const dataTest: TestFormCollectionType = useFind(() => {
    return TestFormCollection.find({ _id: testId });
  })[0];
  const dataPromo: PromoStudentsCollectionType = useFind(() => {
    return PromoStudentsCollection.find({ _id: promoId });
  })[0];
  const dataCorrections: StudentsTestsCorrectionsCollectionType[] = useFind(
    () => {
      return StudentsTestsCorrectionsCollection.find({
        testId: `${testId}`,
      });
    }
  );
  const totalStudent = (studentNumber: number) => {
    var total = 0;
    dataCorrections.map((e) => {
      if (e.studentNumber === studentNumber) {
        total += dataTest.questions[e.questionNumber].barem! * e.points;
      }
    });
    return total;
  };

  React.useEffect(() => {}, []);

  return (
    <>
      {isLoadingPromo() && isLoadingTest() && isLoadingCorrections() ? (
        <>Loading</>
      ) : (
        <>
          {dataTest ? (
            <>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th>Student name</th>
                      {dataTest.questions.map((e, i) => {
                        return (
                          <th
                            key={`question${i}`}
                            scope="col"
                            className="px-6 py-3"
                          >
                            Q{i + 1}
                          </th>
                        );
                      })}
                      <th scope="col" className="px-6 py-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPromo.students.map((student, studentIndex) => {
                      return (
                        <tr
                          key={`student${studentIndex}`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                          >
                            {student.firstName + " " + student.lastName ||
                              student.firstAndLastName}
                          </th>
                          {dataCorrections.map((e) => {
                            if (e.studentNumber == studentIndex) {
                              return (
                                <td
                                  key={`grade${studentIndex}${e.points}${e.questionNumber}`}
                                  scope="col"
                                  className="px-6 py-3"
                                >
                                  {(
                                    dataTest.questions[e.questionNumber]
                                      .barem! * e.points
                                  ).toFixed(2)}
                                </td>
                              );
                            }
                          })}
                          <td
                            key={`total${studentIndex}`}
                            scope="col"
                            className="px-6 py-3"
                          >
                            {totalStudent(studentIndex).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default IdvTestGrades;
