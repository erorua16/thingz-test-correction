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
            setTimeout(() => {setQuestionNumber(questionNumber + 1)}, 100);
            setNewCategory({ name: "" });
          }
          break;
        case "ArrowUp":
          if (questionNumber >= 1) {
            setTimeout(() => {setQuestionNumber(questionNumber - 1)}, 100);
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
          console.log(err);
        }
        if (result) {
          console.log(result);
        }
      }
    );
  };
  const updateGrade = () => {
    Meteor.call(
      "updateStudentGrade",
      {
        _id: dataCorrections[dataCorrectionIndex]._id,
        points: selectedOption,
      },
      (err: any, result: any) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
        }
      }
    );
  };

  ///////USE EFFECT///////
  React.useEffect(() => {
    if (criteriaSubmit) {
      if (!newCategory.points) {
        setCriteriaSubmit(false);
        return alert("please add points for your new grading criteria");
      }
      if (!newCategory.name) {
        setCriteriaSubmit(false);
        return alert("please add a name for your new grading criteria");
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
  }, [
    newCategory,
    criteriaSubmit,
    noteGraded,
  ]);
  
  document.addEventListener("keydown", (e: any) => {
    if (e.repeat) {
      return;
    }
    keyDownFunction(e);
  });

  const messageFunction = () => {
    let sum = 0;
    for (let i = 0; i < dataTest.questions.length; i++) {
      if (dataTest.questions[i].barem) {
        sum += dataTest.questions[i].barem!;
      }
    }
    setTotalBarem(sum);
    if (sum > 20) {
      return setMessage(`{!!WARNING!! Your total barem of ${sum.toFixed(2)} is bigger than 20}`);
    }
    if (sum < 20) {
      return setMessage(`{!!Warning!! Your total barem of ${sum.toFixed(2)} is smaller than 20}`);
    }
    return setMessage("")
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      {isLoadingPromo() && isLoadingTest() && isLoadingCorrections() ? (
        <>Loading</>
      ) : (
        <>
          {message? <p className="text-red-600 text-xl">{message}</p> : <p>Your total barem is {totalBarem}</p>}
          {dataTest ? (
            <>
              <div>
                <h1 className="text-4xl">Student Test Correction</h1>
                <h2 className="text-3xl"> Test Name : {dataTest.name}</h2>
              </div>
              <>
                {questionNumber > 0 ? (
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        changeQuestion(false);
                      }}
                      onKeyDown={() => {
                        changeQuestion(false);
                      }}
                    >
                      Previous
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center">
                    <p>No previous questions</p>
                  </div>
                )}
                {dataPromo ? (
                  <div className="flex flex-row items-center justify-center justify-between">
                    {studentNumber > 0 ? (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                          changeStudent(false);
                        }}
                      >
                        Previous student
                      </button>
                    ) : (
                      <div className="flex items-center justify-center">
                        <p>No previous student</p>
                      </div>
                    )}
                    <div className="flex flex-row justify-between px-8">
                      <div className="flex flex-col w-full]">
                        <h1 className="text-lg">
                          Question :
                          {dataTest
                            ? dataTest.questions[questionNumber]["question"]
                            : "no questions"}
                        </h1>
                        <p>Promo name : {dataPromo.name} </p>
                        <p>Current Student : </p>
                        {dataPromo.students[studentNumber].firstName &&
                        dataPromo.students[studentNumber].lastName ? (
                          <>
                            <p>Student Name:</p>
                            <p>
                              {dataPromo.students[studentNumber].firstName}{" "}
                              &nbsp;
                              {dataPromo.students[studentNumber].lastName}
                            </p>
                          </>
                        ) : (
                          <>
                            <>
                              <p>Student Name:</p>
                              <p>
                                {
                                  dataPromo.students[studentNumber]
                                    .firstAndLastName
                                }
                              </p>
                            </>
                          </>
                        )}
                        {dataTest.questions[questionNumber].barem ? (
                          <p>
                            Barem: {dataTest.questions[questionNumber].barem}
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
                                      Grade with barem :
                                      {dataTest.questions[questionNumber]
                                        .barem! * e.points}
                                    </p>
                                  );
                                } else {
                                  return (
                                    <p>Grade without barem : {e.points || 0}</p>
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

                      <div className="px-8 w-full">
                        <p>Grading criteria</p>
                        <div className="flex flex-col">
                          {dataTest.questions[questionNumber][
                            "gradingCriteria"
                          ] ? (
                            dataTest.questions[questionNumber][
                              "gradingCriteria"
                            ].map((criteria: GradingCriteriaType) => {
                              return (
                                <div
                                  className="flex flex-row justify-between"
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
                                              dataCorrections[
                                                dataCorrectionIndex
                                              ].points
                                            ) === String(criteria.points) ||
                                            (dataCorrections[
                                              dataCorrectionIndex
                                            ].points == undefined &&
                                              criteria.points == 0)
                                          : undefined
                                      }
                                      onChange={handleOptionChange}
                                      className="mx-3"
                                    />
                                    {criteria.name}
                                  </label>
                                  <p className="mx-8">{criteria.points}</p>
                                </div>
                              );
                            })
                          ) : (
                            <>
                              <p>No grading criterias</p>
                            </>
                          )}
                          {addCategory == false ? (
                            <button
                              type="button"
                              onClick={() => setAddCategory(true)}
                            >
                              Add category
                            </button>
                          ) : (
                            <form
                              action=""
                              className="flex flex-col items-left shadow-md rounded w-full px-8 pt-6 pb-8"
                              onSubmit={criteriaSubmitFunction}
                            >
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
                              <input
                                type="number"
                                id="points"
                                onChange={(e) => {
                                  handleCategoryChange(e);
                                }}
                                value={
                                  newCategory.points ||
                                  newCategory.points == 0.0
                                    ? newCategory.points
                                    : ""
                                }
                                step=".01"
                                placeholder="0.00"
                              />
                              <button type="submit">Add</button>
                              <button
                                type="button"
                                onClick={() => setAddCategory(false)}
                              >
                                Cancel
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                    {studentNumber < dataPromo.students.length - 1 ? (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                          changeStudent(true);
                        }}
                      >
                        Next student
                      </button>
                    ) : (
                      <div className="flex items-center justify-center">
                        <p>No more students</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <p>no promo found</p>
                  </>
                )}
                {questionNumber < dataTest.questions.length - 1 ? (
                  <div className="flex items-center  justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        changeQuestion(true);
                      }}
                      onKeyDown={() => {
                        changeQuestion(true);
                      }}
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <p>No more questions</p>
                  </div>
                )}
              </>
            </>
          ) : (
            <>
              <p>No test found</p>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default StudentTestCorrection;
