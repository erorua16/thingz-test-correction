import React from "react";
import { TestFormCollection } from "../api/TestFormCollection";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import AddQuestions from "../components/AddQuestions";
import { Meteor } from "meteor/meteor";
import { QuestionType } from "/imports/types/TestFormCollectionType";

const IdvTest = (): React.ReactElement => {
  ///////SET VARIABLES///////
  //Use params
  const { testId }: any = useParams();
  //Use state
  const [questionsNumber, setQuestionsNumber] = React.useState<number>(0);
  const [questions, setQuestions] = React.useState<any>([]);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [isData, setIsData] = React.useState<boolean>(false);
  const [totalBarem, setTotalBarem] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>("");
  //Subscribtion and data
  const isLoading = useSubscribe("findTest", testId);
  const data: any = useFind(() => {
    setIsData(true);
    return TestFormCollection.find({ _id: testId });
  })[0];

  ///////USE EFFECTS///////
  React.useEffect(() => {
    if (submit) {
      updateCollection();
    }
  }, [submit, questions, data, isData]);

  ///////SET INITIAL QUESTIONS IF THEY EXIST///////
  const messageFunction = () => {
    let sum = 0;
    for (let i = 0; i < data.questions.length; i++) {
      if (data.questions[i].barem) {
        sum += parseFloat(data.questions[i].barem);
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
  const setQuestionData = () => {
    if (isData) {
      if (data.questions.length > 0) {
        setQuestions(data.questions);
      }
      setIsData(false);
      messageFunction();
    }
  };
  ///////HANDLE CHANGE///////
  const handleChangeQuestion = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { id, value, name } = e.target;
    let newArr: QuestionType[] = [...questions]; // copying the old datas array
    if (id.includes("barem")) {
      newArr[parseInt(name)] = {
        question: newArr[parseInt(name)].question,
        barem: parseFloat(value),
        gradingCriteria: [
          { name: "All answers are wrong", points: 0 },
          { name: "Answers are mostly wrong", points: 0.25 },
          { name: "Answers are mostly right", points: 0.75 },
          { name: "All answers are right", points: 1 },
        ],
      };
    } else {
      newArr[parseInt(name)] = {
        question: value,
        gradingCriteria: [
          { name: "All answers are wrong", points: 0 },
          { name: "Answers are mostly wrong", points: 0.25 },
          { name: "Answers are mostly right", points: 0.75 },
          { name: "All answers are right", points: 1 },
        ],
      };
    }
    setQuestions(newArr);
  };

  ///////HANDLE SUBMIT///////
  const handleSubmit = (e: any): void => {
    //Won't submit if there is no value
    e.preventDefault();
    setSubmit(true);
  };

  ////////UPDATE COLLECTION///////
  const updateCollection = (): any => {
    Meteor.call(
      "updateTest",
      { _id: testId, questions: questions },
      (err: any, result: any) => {
        if (err) console.log(err);
        if (result) {
          setSubmit(false);
          setQuestionsNumber(0);
          setQuestions([]);
          setIsData(true);
        }
      }
    );
  };

  return (
    <>
      {isLoading() ? (
        <>
          <p>Loading...</p>
        </>
      ) : (
        <>
          {data ? (
            <>
              {setQuestionData()}
              {message ? (
                <p className="text-red-600"> {message}</p>
              ) : (
                <p> Your total barem is {totalBarem}</p>
              )}
              <h1 className="text-3xl "> Test name : {data.name}</h1>
              <form action="" onSubmit={handleSubmit}>
                {data.questions.length == 0 ? (
                  <p> No questions</p>
                ) : (
                  <>
                    {data.questions.map(
                      (
                        question: { question: string; barem: number },
                        i = 0
                      ) => {
                        return (
                          <div
                            className="bg-gray-200 py-1 my-3 px-5 flex flex-col justify-center"
                            key={`question ${i}`}
                          >
                            <div className="flex flex-row items-center">
                              <p className="text-xl mr-10">
                                Question Title : {question.question}
                              </p>
                              {/* <input
                            className="my-5 shadow border rounded w-full py-2 px-3 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                            id={`question${i}`}
                            key={`question${i}`}
                            name={`${i}`}
                            type="text"
                            placeholder="New question title"
                            value={questions[i] ? questions[i].question : ""}
                            onChange={handleChangeQuestion}
                          /> */}
                            </div>
                            <div className="flex flex-row items-center">
                              <p className="text-xl mr-10">
                                Question barem :{question.barem}
                              </p>
                              <input
                                className="shadow border rounded py-2 px-3 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                                id={`barem${i}`}
                                key={`barem${i}`}
                                name={`${i}`}
                                type="number"
                                step=".01"
                                placeholder="0.00"
                                value={questions[i] ? questions[i].barem : ""}
                                onChange={handleChangeQuestion}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </>
                )}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 mr-5 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    if (
                      questions[questions.length - 1].question !== "" &&
                      questions[questions.length - 1].question !== undefined
                    ) {
                      setQuestionsNumber(questionsNumber + 1);
                    }
                  }}
                  type="button"
                >
                  Add more questions
                </button>
                {console.log(questions)}
                <AddQuestions
                  questions={questions}
                  questionsNumber={questionsNumber}
                  handleChangeQuestion={handleChangeQuestion}
                  startingNumber={
                    data.questions ? data.questions.length - 1 : -1
                  }
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Update Test Info
                </button>
              </form>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};
export default IdvTest;
