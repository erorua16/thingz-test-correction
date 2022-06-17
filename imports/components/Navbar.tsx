import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const Navbar = () => {
  const [activeItem, setActiveItem] = React.useState("");
  const handleItemClick = (e: any, { name }: any) => setActiveItem(name);

  return (
    <Menu
    size="massive"
    fixed="top"
    >
      <Menu.Item
        header
        as={Link}
        to="/"
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        position="left"
      >
        Test Maker V0.002
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/all-tests"
        name="all-tests"
        active={activeItem === "all-tests"}
        onClick={handleItemClick}
      >
        All Tests
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/create-test"
        name="create-test"
        active={activeItem === "create-test"}
        onClick={handleItemClick}
      >
        Create test
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
