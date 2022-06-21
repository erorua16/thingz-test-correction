import React from "react";
import { Segment, Header, Form, TextArea } from "semantic-ui-react";

type AddQuestionsProp = {
  questionsNumber: number;
  startingNumber?: number;
  questions: any;
  handleChangeQuestion: React.ChangeEventHandler<HTMLInputElement>;
};
const AddQuestions = ({
  questionsNumber,
  startingNumber,
  questions,
  handleChangeQuestion,
}: AddQuestionsProp): React.ReactElement => {
  //RENDER QUESTIONS//
  const renderDivs = () => {
    let count = questionsNumber,
      uiItems = [],
      i = startingNumber || startingNumber == 0 ? startingNumber : -1;
    while (count--) {
      i++;
      uiItems.push(
        <Segment key={"addQuestion" + i}>
            <Form.Field className="largeText" inline >
              <label ><Header as="h3">Question Title :</Header></label>
              <TextArea
                id={`question${i}`}
                key={`question${i}`}
                name={`${i}`}
                placeholder="Question title"
                value={questions[i] ? questions[i].question : ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  handleChangeQuestion(e);
                }}
              />
            </Form.Field >
            {questions[i] ? (
              <>
                <Form.Field className="largeText" inline>
                  <label htmlFor={`barem${i}`}>
                    <Header as="h3">Question grading scale :</Header>
                  </label>
                  <input
                    id={`barem${i}`}
                    key={`barem${i}`}
                    type="number"
                    step=".01"
                    name={`${i}`}
                    value={
                      questions[i].barem || questions[i].barem == 0
                        ? questions[i].barem
                        : ""
                    }
                    onChange={handleChangeQuestion}
                  />
                </Form.Field>
              </>
            ) : (
              <></>
            )}
        </Segment>
      );
    }
    return uiItems;
  };

  return <>{renderDivs()}</>;
};

export default AddQuestions;
