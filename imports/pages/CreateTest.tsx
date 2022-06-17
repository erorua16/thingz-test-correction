import React from "react";
import { PromoStudentsCollection } from "../api/PromoStudentsCollection";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import PromoImport from "../components/PromoImport";
import AddQuestions from "../components/AddQuestions";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { PromoStudentsCollectionType } from "/imports/types/PromoStudentsCollectionType";
import { QuestionType } from "/imports/types/TestFormCollectionType";
import toast from "react-hot-toast";
import { Button, Form, Segment, Select, Header, Grid } from "semantic-ui-react";
//@TODO
//Manage to do only one handle change and one set variables

const CreateTest = () => {
  ///////SET VARIABLES///////
  const navigate = useNavigate();
  const [name, setName] = React.useState<string>("");
  const [promoSelect, setPromoSelect] = React.useState<string>("");
  const [questionsNumber, setQuestionsNumber] = React.useState<number>(0);
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [submit, setSubmit] = React.useState<boolean>(false);
  //GET DATA //
  const isLoading = useSubscribe("findPromos");
  const studentPromos: PromoStudentsCollectionType[] = useFind(() =>
    PromoStudentsCollection.find({}, { sort: { createdAt: -1 } })
  );

  //////SUBMIT EVENT///////
  //GRADING FORM//
  const handleSubmit = (): void => {
    if (!name && !promoSelect) {
      toast.error("Please add a name and choose a promo");
      return;
    }
    if (!name) {
      toast.error("Please add a name");
      return;
    }
    if (!promoSelect) {
      toast.error("Please choose a promo");
      return;
    }
    setQuestions(
      questions.filter((e: any) => {
        return e != null;
      })
    );
    setSubmit(true);
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

  React.useEffect(() => {
    if (submit) {
      insertCollection();
    }
  }, [submit]);

  return (
    <>
      <Header as="h1"> New Test </Header>
      <Form
        id="formTest"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Form.Field className="largeText" inline width="4">
          <label>
            <Header as="h3">Test Name : </Header>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Test Name"
            value={name}
            onChange={handleChangeName}
          />
        </Form.Field>
        <Header as="h2">Questions : {questionsNumber} questions</Header>

        <AddQuestions
          questions={questions}
          questionsNumber={questionsNumber}
          handleChangeQuestion={handleChangeQuestion}
        />

        <Button
          onClick={() => {
            setQuestionsNumber(questionsNumber + 1);
          }}
          type="button"
        >
          Add more questions
        </Button>

        {isLoading() ? (
          "Loading..."
        ) : (
          <Grid centered columns="2">
            {studentPromos.length == 0 ? (
              <Grid.Column className="spaceOnY">
                <Header as="h4">No promos are available, please import a new promo</Header>
              </Grid.Column>
            ) : (
              <Grid.Column className="spaceOnY">
                <select
                  onChange={handleChangePromoSelect}
                  id="promoSelect"
                  defaultValue="default"
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
              </Grid.Column>
            )}
            <Grid.Column className="spaceOnY">
              <PromoImport />
            </Grid.Column>
          </Grid>
        )}

        <Button primary type="button" onClick={handleSubmit}>
          Create Test
        </Button>
      </Form>
    </>
  );
};

export default CreateTest;
