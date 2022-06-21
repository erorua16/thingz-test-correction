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
import { Button, Form, Header, Table, Modal } from "semantic-ui-react";

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
    var total: any = 0;
    if(dataCorrections.length > 0) {
      dataCorrections.map((e) => {
        if (e.studentNumber === studentNumber) {
          total += dataTest.questions[e.questionNumber].barem! * e.points;
        }
      });
    }
    return total.toFixed(2);
  };
  //To display the answers to the questions if there are any, else show no answers
  const questionsCells = (studentIndex: number) => {
    const data = dataTest.questions.map((e, i) => {
      return (
        <Table.Cell key={`grade${studentIndex}${i}`} scope="col" l>
          --
        </Table.Cell>
      );
    });
    dataCorrections.map((e) => {
      if (e.studentNumber === studentIndex) {
        data[e.questionNumber] = (
          <Table.Cell
            key={`grade${studentIndex}${e.points}${e.questionNumber}`}
            scope="col"
          >
            {e.points}
          </Table.Cell>
        );
      }
    });

    return data;
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
              <div>
                <Table
                  color="blue"
                  striped
                  selectable
                  celled
                  size="large"
                  padded
                >
                  <Table.Header className="largeText">
                    <Table.Row>
                      <Table.HeaderCell scope="col">
                        STUDENT NAME
                      </Table.HeaderCell>
                      {dataTest.questions.map((e, i) => {
                        return (
                          <Table.HeaderCell key={`question${i}`} scope="col">
                            Q{i + 1}
                          </Table.HeaderCell>
                        );
                      })}
                      <Table.HeaderCell scope="col">TOTAL</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {dataPromo.students.map((student, studentIndex) => {
                      return (
                        <Table.Row key={`student${studentIndex}`}>
                          <Table.Cell scope="row">
                            {student.firstName && student.lastName
                              ? student.firstName + " " + student.lastName
                              : student.firstAndLastName}
                          </Table.Cell>
                          {questionsCells(studentIndex)}
                          <Table.Cell key={`total${studentIndex}`} scope="col">
                            {totalStudent(studentIndex)}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
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
