import React from "react";
import { Meteor } from "meteor/meteor";
import { PromoStudentsCollection } from "../api/PromoStudentsCollection";
import { TestFormCollection } from "../api/TestFormCollection";
import { useParams } from "react-router-dom";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { GradingCriteriaType } from "../types/TestFormCollectionType";
import { TestFormCollectionType } from "../types/TestFormCollectionType";
import { PromoStudentsCollectionType } from "../types/PromoStudentsCollectionType";
import { StudentsTestsCorrectionsCollection } from "../api/StudentsTestsCorrectionsCollection";
import toast from "react-hot-toast";
import { Button, Form, Segment, Select, Header, Grid } from "semantic-ui-react";

const StudentTestCorrection = () => {
  ///////SET VARIABLES///////
  //Use params
  const { testId }: any = useParams<string>();
  const { promoId }: any = useParams<string>();
  //Use states
  const [questionNumber, setQuestionNumber] = React.useState<number>(0);
  const [studentNumber, setStudentNumber] = React.useState<number>(0);
  const [criteriaSubmit, setCriteriaSubmit] = React.useState<boolean>(false);
  const [addCategory, setAddCategory] = React.useState<boolean>(false);
  const [newCategory, setNewCategory] = React.useState<any>({
    name: "",
  });
  const [selectedOption, setSelectedOption] = React.useState<number>();
  const [noteGraded, setNoteGraded] = React.useState<boolean>(false);
  const [dataCorrectionIndex, setDataCorrectionIndex] =
    React.useState<number>(0);
  const [executed, setExecuted] = React.useState<boolean>(false);
  const [totalBarem, setTotalBarem] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>("");
  //Is loading
  const isLoadingPromo = useSubscribe("findPromo", promoId);
  const isLoadingTest = useSubscribe("findTest", testId);
  const isLoadingCorrections = useSubscribe("findOneStudentTestsCorrections", {
    questionNumber,
    testId,
    studentNumber,
  });
  //DB results
  const dataTest: TestFormCollectionType = useFind(() => {
    return TestFormCollection.find({ _id: testId });
  })[0];
  const dataPromo: PromoStudentsCollectionType = useFind(() => {
    return PromoStudentsCollection.find({ _id: promoId });
  })[0];
  const dataCorrections = useFind(() => {
    return StudentsTestsCorrectionsCollection.find({
      testId: testId,
    });
  });

  ////////ON CLICK EVENT///////
  const changeQuestion = (next: boolean) => {
    setNewCategory({ name: "" });
    if (next) {
      setQuestionNumber(questionNumber + 1);
    } else {
      setQuestionNumber(questionNumber - 1);
    }
  };
  const changeStudent = (next: boolean) => {
    if (next) {
      setStudentNumber(studentNumber + 1);
    } else {
      setStudentNumber(studentNumber - 1);
    }
  };

  ////////ON KEY DOWN EVENT///////
  const keyDownFunction = (e: KeyboardEvent) => {
    if (dataTest && dataPromo) {
      switch (e.key) {
        case "ArrowDown":
          if (questionNumber < dataTest.questions.length - 1) {
            setTimeout(() => {
              setQuestionNumber(questionNumber + 1);
            }, 100);
            setNewCategory({ name: "" });
          }
          break;
        case "ArrowUp":
          if (questionNumber >= 1) {
            setTimeout(() => {
              setQuestionNumber(questionNumber - 1);
            }, 100);
            setNewCategory({ name: "" });
          }
          break;
        case "ArrowRight":
          if (studentNumber < dataPromo.students.length - 1) {
            setStudentNumber(studentNumber + 1);
          }
          break;
        case "ArrowLeft":
          if (studentNumber >= 1) {
            setStudentNumber(studentNumber - 1);
          }
          break;
        default:
          break;
      }
    }
  };

  ///////HANDLE CHANGE///////
  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
    setTimeout(() => {
      setNoteGraded(true);
    }, 500);
  };
  const handleCategoryChange = (e: any) => {
    const { id, value } = e.target;
    let newArr: GradingCriteriaType = { ...newCategory };
    if (id == "points") {
      newArr = {
        name: newArr.name,
        points: parseFloat(value),
      };
    } else {
      newArr = {
        name: value,
        points: newArr.points,
      };
    }
    setNewCategory(newArr);
  };

  ///////HANDLE SUBMIT///////
  const criteriaSubmitFunction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCriteriaSubmit(true);
  };
  const addNewCategory = () => {
    const newCriterias = [
      ...dataTest.questions[questionNumber]["gradingCriteria"],
      newCategory,
    ].sort((a, b) => {
      return a.points - b.points;
    });

    Meteor.call(
      "updateTestGradingCriteria",
      {
        _id: testId,
        questionNumber: questionNumber,
        newCriterias: newCriterias,
      },
      (err: any, result: any) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          setCriteriaSubmit(false);
          setAddCategory(false);
          setNewCategory({ name: "" });
        }
      }
    );
  };
  const addGrade = () => {
    toast.loading("Loading...");
    setTimeout(() => {
      Meteor.call(
        "insertGrade",
        {
          testId: testId,
          questionNumber: questionNumber,
          studentNumber: studentNumber,
          points: selectedOption,
        },
        (err: any, result: any) => {
          if (err) {
            toast.dismiss();
            toast.error("An error has occured while processing your request")
          }
          if (result) {
            toast.dismiss();
            toast.success("Grade has been added");
          }
        }
      );
    }, 500);
  };
  const updateGrade = () => {
    toast.loading("Loading...");
    setTimeout(()=> {
      Meteor.call(
        "updateStudentGrade",
        {
          _id: dataCorrections[dataCorrectionIndex]._id,
          points: selectedOption,
        },
        (err: any, result: any) => {
          if (err) {
            toast.dismiss();
            toast.error("An error has occured while processing your request")
          }
          if (result) {
            toast.dismiss();
            toast.success("Grade has been updated");
          }
        }
      );
    },500)
  };

  ///////USE EFFECT///////
  React.useEffect(() => {
    if (criteriaSubmit) {
      if (!newCategory.points) {
        setCriteriaSubmit(false);
        toast.error("please add points for your new grading criteria");
        return;
      }
      if (!newCategory.name) {
        setCriteriaSubmit(false);
        toast.error("please add a name for your new grading criteria");
        return;
      }
      addNewCategory();
    }
    if (noteGraded) {
      if (dataCorrections.length > 0) {
        if (dataCorrections[dataCorrectionIndex].points) {
          updateGrade();
          setNoteGraded(false);
        }
      } else {
        addGrade();
        setNoteGraded(false);
      }
    }

    return () => {
      document.removeEventListener("keydown", keyDownFunction);
    };
  }, [criteriaSubmit, noteGraded]);

  document.addEventListener("keydown", (e: any) => {
    if (e.repeat) {
      return;
    }
    keyDownFunction(e);
  });

  return (
    <>
      {isLoadingPromo() && isLoadingTest() && isLoadingCorrections() ? (
        <>Loading</>
      ) : (
        <>
          {dataTest ? (
            <>
              <Header as="h1">Student Test Correction : {dataTest.name}</Header>
              <Grid padded className="gridPage">
                <Grid.Row verticalAlign="bottom" centered>
                  {questionNumber > 0 ? (
                    <Button
                      secondary
                      onClick={() => {
                        changeQuestion(false);
                      }}
                      className="buttonHeight"
                    >
                      Previous Question
                    </Button>
                  ) : (
                    <Button secondary disabled className="buttonHeight">
                      Previous Question
                    </Button>
                  )}
                </Grid.Row>
                {dataPromo ? (
                  <Grid.Row centered>
                    <Grid.Column verticalAlign="middle" width="2">
                      {studentNumber > 0 ? (
                        <Button
                          secondary
                          onClick={() => {
                            changeStudent(false);
                          }}
                        >
                          Previous student
                        </Button>
                      ) : (
                        <Button disabled secondary>
                          Previous Student
                        </Button>
                      )}
                    </Grid.Column>
                    <Grid.Column
                      verticalAlign="middle"
                      textAlign="left"
                      width="7"
                    >
                      <Header as="h3">
                        {dataTest
                          ? dataTest.questions[questionNumber]["question"]
                          : "no questions"}
                      </Header>
                      <div className="largeText">
                        <p>
                          <b>Promo name :</b> {dataPromo.name}{" "}
                        </p>
                        {dataPromo.students[studentNumber].firstName &&
                        dataPromo.students[studentNumber].lastName ? (
                          <p>
                            <b>Student Name:</b> &nbsp;
                            {dataPromo.students[studentNumber].firstName} &nbsp;
                            {dataPromo.students[studentNumber].lastName}
                          </p>
                        ) : (
                          <p>
                            <b>Student Name:</b>
                            {dataPromo.students[studentNumber].firstAndLastName}
                          </p>
                        )}
                        {dataTest.questions[questionNumber].barem ? (
                          <p>
                            <b>Barem:</b>{" "}
                            {dataTest.questions[questionNumber].barem}
                          </p>
                        ) : (
                          <p> No barem has been set for this question</p>
                        )}

                        {dataCorrections.length > 0 ? (
                          <>
                            {dataCorrections.map((e, i = 0) => {
                              if (
                                e.questionNumber == questionNumber &&
                                e.studentNumber == studentNumber
                              ) {
                                if (!executed) {
                                  setExecuted(true);
                                  setDataCorrectionIndex(i);
                                }
                                if (dataTest.questions[questionNumber].barem) {
                                  return (
                                    <p>
                                      <b>Grade with barem :</b>
                                      {dataTest.questions[questionNumber]
                                        .barem! * e.points}
                                    </p>
                                  );
                                } else {
                                  return (
                                    <p>
                                      <b>Grade without barem :</b>{" "}
                                      {e.points || 0}
                                    </p>
                                  );
                                }
                              }
                            })}
                          </>
                        ) : (
                          <>
                            <p>No grade yet</p>
                          </>
                        )}
                      </div>
                    </Grid.Column>

                    <Grid.Column
                      verticalAlign="middle"
                      textAlign="right"
                      width="5"
                    >
                      <Header as="h3">Grading criteria</Header>
                      <div className="spaceOnY">
                        {dataTest.questions[questionNumber][
                          "gradingCriteria"
                        ] ? (
                          dataTest.questions[questionNumber][
                            "gradingCriteria"
                          ].map((criteria: GradingCriteriaType) => {
                            return (
                              <div
                                className="widthAll largeText"
                                key={criteria.name}
                              >
                                <label>
                                  <input
                                    type="radio"
                                    value={
                                      criteria.points ? criteria.points : 0
                                    }
                                    checked={
                                      dataCorrections[dataCorrectionIndex]
                                        ? String(
                                            dataCorrections[dataCorrectionIndex]
                                              .points
                                          ) === String(criteria.points) ||
                                          (dataCorrections[dataCorrectionIndex]
                                            .points == undefined &&
                                            criteria.points == 0)
                                        : undefined
                                    }
                                    onChange={handleOptionChange}
                                    className="textAlignLeft marginRight"
                                  />
                                  {criteria.name}
                                </label>
                                <p>{criteria.points}</p>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <p>No grading criterias</p>
                          </>
                        )}
                      </div>
                      {addCategory == false ? (
                        <Button
                          primary
                          type="button"
                          onClick={() => setAddCategory(true)}
                        >
                          Add category
                        </Button>
                      ) : (
                        <Form action="" onSubmit={criteriaSubmitFunction}>
                          <Form.Field>
                            <input
                              type="text"
                              id="criteria"
                              key="criteriaInput"
                              placeholder="criteria name"
                              onChange={(e) => {
                                handleCategoryChange(e);
                              }}
                              value={newCategory.name ? newCategory.name : ""}
                            />
                          </Form.Field>
                          <Form.Field>
                            <input
                              type="number"
                              id="points"
                              onChange={(e) => {
                                handleCategoryChange(e);
                              }}
                              value={
                                newCategory.points || newCategory.points == 0.0
                                  ? newCategory.points
                                  : ""
                              }
                              step=".01"
                              placeholder="0.00"
                            />
                          </Form.Field>
                          <Button primary type="submit">
                            Add
                          </Button>
                          <Button
                            secondary
                            type="button"
                            onClick={() => setAddCategory(false)}
                          >
                            Cancel
                          </Button>
                        </Form>
                      )}
                    </Grid.Column>
                    <Grid.Column
                      verticalAlign="middle"
                      textAlign="center"
                      width="2"
                    >
                      {studentNumber < dataPromo.students.length - 1 ? (
                        <Button
                          secondary
                          onClick={() => {
                            changeStudent(true);
                          }}
                        >
                          Next student
                        </Button>
                      ) : (
                        <Button secondary disabled>
                          Next student
                        </Button>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                ) : (
                  <>
                    <p>no promo found</p>
                  </>
                )}
                <Grid.Row verticalAlign="middle" centered>
                  {questionNumber < dataTest.questions.length - 1 ? (
                    <Button
                      className="buttonHeight"
                      secondary
                      onClick={() => {
                        changeQuestion(true);
                      }}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button secondary disabled className="buttonHeight">
                      Next Question
                    </Button>
                  )}
                </Grid.Row>
              </Grid>
            </>
          ) : (
            <>
              <p>No test found</p>
            </>
          )}
        </>
      )}
    </>
  );
};
export default StudentTestCorrection;
