import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  let [ showNav, setShowNav] = useState(false);
  
    return (
      <>
        <div className="bg-primary lg:bg-white sticky shadow z-50">
            <div className="flex items-center justify-between py-4 z-50">
              <div>
                <Link to="/"><h3 className="hidden sm:block text-xl font-semibold uppercase ml-7">Test maker V 0.00001</h3></Link>
              </div>
              <div className="hidden sm:flex sm:items-center ">

                  <Link to="/" className="px-4">Home </Link>
                  <Link to="/all-tests" className="px-4">All Tests</Link>
                  <Link to="/create-test" className="px-4">New test</Link>
              </div>
                <h3 className="sm:hidden md:hidden lg:hidden font-semibold  text-center text-xl uppercase ">we are hiring</h3>
              {showNav ? (
                <button className="sm:hidden cursor-pointer " onClick={() => setShowNav(!showNav)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : ( 
                <button className="sm:hidden cursor-pointer " onClick={() => setShowNav(!showNav)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </button>
              )}
            </div>
            <div className={(showNav ? "absolute" : "hidden") + " bg-primary z-5 w-screen"}>
              <div className="flex flex-col sm:hidden">
                <Link to="/" className="px-6 py-3 text-xl" onClick={() => setShowNav(!showNav)}>Home</Link>
                <Link to="/all-tests" className="px-6 py-3 text-xl" onClick={() => setShowNav(!showNav)}>Tests</Link>
                <Link to="/create-test" className="px-6 py-3 text-xl" onClick={() => setShowNav(!showNav)}>New test</Link>
              </div>
            </div>
          </div>
      </>
    )
}

export default Navbar;