import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar"
import Homepage from "../pages/Homepage"
import CreateTest from "../pages/CreateTest"
import AllTests from "../pages/AllTests"
import IdvTest from "../pages/IdvTest"
import StudentTestCorrection from "../pages/StudentTestCorrection";
import IdvTestGrades from "../pages/IdvTestGrades"
export const App = () => (
  <div>
    <Router>
      <Navbar />
      <div className="mt-12 mx-12">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/all-tests" element={<AllTests />} />
        <Route path="/test/:testId" element={<IdvTest />} />
        <Route path="/test/:testId/:promoId" element = {<StudentTestCorrection/>}/>
        <Route path="/test-review/:testId/:promoId" element = {<IdvTestGrades/>}/>
      </Routes>
      </div>
    </Router>
  </div>
);
