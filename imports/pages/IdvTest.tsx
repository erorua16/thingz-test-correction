import React from "react";
import { TestFormCollection } from "../api/TestFormCollection";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import AddQuestions from "../components/AddQuestions";
import { Meteor } from "meteor/meteor";
import { QuestionType } from "/imports/types/TestFormCollectionType";
import toast from "react-hot-toast";
import { Button, Segment, Header, Form } from "semantic-ui-react";

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
  }, [submit]);

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
      return toast.error(
        `Your total barem of ${sum.toFixed(2)} is bigger than 20`
      );
    }
    if (sum < 20) {
      return toast.error(
        `Your total barem of ${sum.toFixed(2)} is smaller than 20`
      );
    }
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
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
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
    setQuestions(
      questions.filter((e: any) => {
        return e != null;
      })
    );
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
          toast.success("Test has been successfully updated");
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
              <Header as="h1" className="text-3xl ">
                Test name : {data.name}
              </Header>
              <Header as="h4"> Your total barem is {totalBarem}</Header>
              <Form action="" id="formTest" onSubmit={handleSubmit}>
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
                          <Segment key={`question ${i}`}>
                            <Form.Field>
                              <Header as="h3">
                                Question : {question.question}
                              </Header>
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
                            </Form.Field>
                            <Form.Field className="largeText" inline>
                              <label>
                                <Header as="h3">
                                  Barem : {question.barem}
                                </Header>
                              </label>
                              <input
                                id={`barem${i}`}
                                key={`barem${i}`}
                                name={`${i}`}
                                type="number"
                                step=".01"
                                placeholder="0.00"
                                value={questions[i] ? questions[i].barem : ""}
                                onChange={handleChangeQuestion}
                              />
                            </Form.Field>
                          </Segment>
                        );
                      }
                    )}
                  </>
                )}
                <Button
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
                </Button>
                <AddQuestions
                  questions={questions}
                  questionsNumber={questionsNumber}
                  handleChangeQuestion={handleChangeQuestion}
                  startingNumber={
                    data.questions ? data.questions.length - 1 : -1
                  }
                />
                <Button primary type="submit">
                  Update Test Info
                </Button>
              </Form>
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
