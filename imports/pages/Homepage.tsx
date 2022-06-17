import React from "react";
import { Link } from "react-router-dom";
import PromoImport from "../components/PromoImport";
import { Button } from "semantic-ui-react";

const Homepage = () => {
  return (
    <>
      <h1> Homepage </h1>
      <div>
        <Link to="/create-test">
          <Button primary>Create new test</Button>
        </Link>
        <PromoImport />
      </div>
    </>
  );
};

export default Homepage;
