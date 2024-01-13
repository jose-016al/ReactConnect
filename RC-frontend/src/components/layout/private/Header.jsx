import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "./Nav";

export const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <header className="layout__navbar">
      <div className="title">
        <NavLink to="/" className="navbar__title">
          ReactConnect
        </NavLink>
      </div>

      <Nav isMenuOpen={isMenuOpen} closeMenu={closeMenu} />

      <div className="ham-menu-container" onClick={toggleMenu}>
        <div className={`ham-menu ${isMenuOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </header>
  );
};
