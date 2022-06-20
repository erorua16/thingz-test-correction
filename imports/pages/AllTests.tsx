import React from "react";
import { TestFormCollectionType } from "../types/TestFormCollectionType";
import { TestFormCollection } from "/imports/api/TestFormCollection";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button, Segment, Header, Breadcrumb } from "semantic-ui-react";

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
          <h1> All Tests </h1>
          <p>Test is loading</p>
        </>
      ) : (
        <>
          <h1> All Tests </h1>
          {tests.length > 0 ? (
            <>
              {tests.map((test) => {
                return (
                  <Segment key={`test` + test._id}>
                    <Header as="h3" key={test._id.toString()}>
                      Test Name : {test.name}
                    </Header>
                    {test.questions.length == 0 ? (
                      <p> No questions</p>
                    ) : (
                      <p>questions : {test.questions.length}</p>
                    )}
                    <Breadcrumb>
                      <Breadcrumb.Section
                        as={Link}
                        to={`/test/${test._id}`}
                        link
                      >
                        Test details
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider />
                      <Breadcrumb.Section
                        as={Link}
                        to={`/test/${test._id}/${test.promoId}`}
                        link
                      >
                        Individual student corrections
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider />
                      <Breadcrumb.Section
                        as={Link}
                        to={`/test-review/${test._id}/${test.promoId}`}
                        link
                      >
                        Test results
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Segment>
                );
              })}
            </>
          ) : (
            <>
              <Header as="h3">No tests are available</Header>{" "}
              <Link to="/create-test">
                <Button primary type="button">Create new test</Button>
              </Link>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AllTests;
