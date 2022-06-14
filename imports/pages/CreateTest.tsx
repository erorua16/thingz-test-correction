import React from "react";
import { PromoStudentsCollection } from "../api/PromoStudentsCollection";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import PromoImport from "../components/PromoImport";
import AddQuestions from "../components/AddQuestions";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { PromoStudentsCollectionType } from "/imports/types/PromoStudentsCollectionType";
import { QuestionType } from "/imports/types/TestFormCollectionType";
//@TODO
//Manage to do only one handle change and one set variables

const CreateTest = () => {
  ///////SET VARIABLES///////
  const navigate = useNavigate();
  const [name, setName] = React.useState<string>("");
  const [promoSelect, setPromoSelect] = React.useState<string>("");
  const [questionsNumber, setQuestionsNumber] = React.useState<number>(0);
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  //GET DATA //
  const isLoading = useSubscribe("findPromos");
  const studentPromos: PromoStudentsCollectionType[] = useFind(() =>
    PromoStudentsCollection.find({}, { sort: { createdAt: -1 } })
  );

  //////SUBMIT EVENT///////
  //GRADING FORM//
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    //Won't submit if there is no value
    e.preventDefault();
    //if Value
    if (!name) return;
    if (!promoSelect) return;
    insertCollection();
  };

  ///////ONCHANGE EVENT///////
  const handleChangeName = (e: React.FormEvent<HTMLInputElement>): void => {
    //Get user input
    setName(e.currentTarget.value);
  };
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
  const handleChangePromoSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setPromoSelect(e.target.value);
  };

  ///////SUBMIT EVENT///////
  const insertCollection = () => {
    Meteor.call(
      "insertTest",
      {
        name: name.trim(),
        promoId: promoSelect,
        createdAt: new Date(),
        questions: questions,
      },
      { returnStubValue: true },
      (err: Error, result: string) => {
        if (err) {
          console.log(err.message);
        }
        if (result) {
          navigate(`/test/${result}/${promoSelect}`);
          //reset
          setName("");
          setPromoSelect("");
          setQuestionsNumber(0);
          setQuestions([]);
        }
      }
    );
  };

  return (
    <>
    <h1 className="text-3xl mb-8"> New Test </h1>
      <form
        className="flex flex-col items-left shadow-md rounded w-full px-8 pt-6 pb-8"
        onSubmit={handleSubmit}
      >
        <input
          className="my-8 md:mr-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Test Name"
          value={name}
          onChange={handleChangeName}
        />
        <h1>Questions : {questionsNumber} questions</h1>

        <AddQuestions
          questions={questions}
          questionsNumber={questionsNumber}
          handleChangeQuestion={handleChangeQuestion}
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            setQuestionsNumber(questionsNumber + 1);
          }}
        >
          Add more questions
        </button>
        {isLoading() ? (
          "Loading..."
        ) : (
          <div className="flex flex-row justify-center my-10">
            {studentPromos.length == 0 ? (
              <p >No promos are available, please import a new promo</p>
            ) : (
              <select
                onChange={handleChangePromoSelect}
                id="promoSelect"
                defaultValue="default"
                className="w-1/3 mr-10"
              >
                <option
                  hidden
                  disabled
                  id="default"
                  key="default"
                  value="default"
                >
                  select a promo
                </option>
                {studentPromos.map((promo) => {
                  return (
                    <option
                      key={promo._id.toString()}
                      value={promo._id.toString()}
                    >
                      {promo.name}
                    </option>
                  );
                })}
              </select>
            )}
            <PromoImport />
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create Test
        </button>
      </form>
    </>
  );
};

export default CreateTest;
