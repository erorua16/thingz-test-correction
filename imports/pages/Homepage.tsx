import React from "react";
import { Link } from "react-router-dom";
import PromoImport from "../components/PromoImport";

const Homepage = () => {
  return (
    <>
      <div className="flex flex-col justify-between">
        <h1 className="text-3xl mb-8"> Homepage </h1>
        <div className="flex flex-row w-[20%]">
          <Link to="/create-test">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 mr-8 rounded focus:outline-none focus:shadow-outline">
              Create new test
            </button>
          </Link>

          <PromoImport />
        </div>
      </div>
    </>
  );
};

export default Homepage;
