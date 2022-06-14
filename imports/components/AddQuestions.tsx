import React from "react";
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
        <div key={"addQuestion" + i} className="my-5">
          <div>
            <label className="text-xl mr-10" htmlFor={`question${i}`}>
              Question Title :
            </label>
            <input
              className="md:mr-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
              id={`question${i}`}
              key={`question${i}`}
              name={`${i}`}
              type="text"
              placeholder="Question title"
              value={questions[i] ? questions[i].question : ""}
              onChange={handleChangeQuestion}
            />
          </div>
          {questions[i] ? (
            <>
              <div className="">
                <label className="text-xl mr-10" htmlFor={`barem${i}`}>
                  Question barem :
                </label>
                <input
                  className="md:mr-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
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
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      );
    }
    return uiItems;
  };

  return <>{renderDivs()}</>;
};

export default AddQuestions;
