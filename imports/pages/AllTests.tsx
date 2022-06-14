import React from "react";
import { TestFormCollectionType } from "../types/TestFormCollectionType";
import { TestFormCollection } from "/imports/api/TestFormCollection";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
// import {result} from '../api/Simpl-schemaCollection'
const AllTests = (): React.ReactElement => {
  ///////GET DATA///////
  const isLoading = useSubscribe("findTests");
  const tests: TestFormCollectionType[] = useFind(() =>
    TestFormCollection.find({}, { sort: { createdAt: -1 } })
  );

  return (
    <>
      {isLoading() ? (
        <>
          <h1 className="text-3xl mb-8"> All Tests </h1>
          <p>Test is loading</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl mb-8"> All Tests </h1>
          {tests.map((test) => {
            return (
              <div key={`test` + test._id} className="flex flex-col mb-8">
                <h1 key={test._id.toString()}>Test Name : {test.name}</h1>
                {test.questions.length == 0 ? (
                  <p> No questions</p>
                ) : (
                  <p>questions : {test.questions.length}</p>
                )}
                <Link to={`/test/${test._id}`}>Test details</Link>
                <Link to={`/test/${test._id}/${test.promoId}`}>
                  Individual student corrections
                </Link>
                <Link to={`/test-review/${test._id}/${test.promoId}`}>
                  Test results
                </Link>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default AllTests;
