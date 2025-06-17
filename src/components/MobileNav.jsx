import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/Authprovider";

import { RxHamburgerMenu } from "react-icons/rx";
import { RiFilmAiFill, RiLogoutBoxRFill } from "react-icons/ri";
import { FaChartPie } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { TbLogin } from "react-icons/tb";

import LogoSvg2 from "./LogoSvg2";
import placeholder from "../assets/images/profile-image-placeholder.png";

const MobileNav = () => {
  const [loggedUser, setLoggedUser] = useState("");
  const [burgerClicked, setBurgerClicked] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const profileImage = localStorage.getItem("profileImage") || placeholder;
    if (username) {
      setLoggedUser({
        username,
        profileImage,
      });
    }
  }, [auth.user]);

  const logout = () => {
    auth.logout();
    setLoggedUser("");
  };

  return (
    <div className="mobile-navbar">
      <div className="closed-mobile-nav">
        <div className="section-left">
          <RxHamburgerMenu onClick={() => setBurgerClicked(!burgerClicked)} />
        </div>
        <div className="section-center">
          <NavLink to="/">
            <LogoSvg2 />
          </NavLink>
        </div>
        <div className="section-right">
          {loggedUser ? (
            <ul className="mobile-nav-links">
              <li>
                <NavLink to="/">
                  <img
                    className="profile-image-link"
                    src={loggedUser.profileImage}
                    alt=""
                  />
                </NavLink>
              </li>
              <li>
                <NavLink to="/library">
                  <RiFilmAiFill />
                </NavLink>
              </li>
              <li>
                <NavLink to="/">
                  <FaChartPie />
                </NavLink>
              </li>

              <li>
                <NavLink to="/" onClick={() => logout()}>
                  <RiLogoutBoxRFill />
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="mobile-nav-links">
              <li>
                <NavLink to="/">
                  <FaHome />
                </NavLink>
              </li>

              <li>
                <NavLink to="/library">
                  <RiFilmAiFill />
                </NavLink>
              </li>

              <li>
                <NavLink to="/login">
                  <TbLogin />
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
      {burgerClicked && (
        <nav className="main-mobile-nav">
          {loggedUser.username ? (
            <ul className="logged-in-nav-links">
              <hr />
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/userPage"
                >
                  <img
                    className="profile-image-link"
                    src={loggedUser.profileImage}
                    alt=""
                  />
                  {loggedUser.username}
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/library"
                >
                  <RiFilmAiFill />
                  All Movies
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/"
                >
                  <FaChartPie />
                  Stats
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink className="link" onClick={() => logout()}>
                  <RiLogoutBoxRFill />
                  Logout
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="logged-out-nav-links">
              <hr />
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/"
                >
                  <FaHome />
                  Home
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/library"
                >
                  {" "}
                  <RiFilmAiFill />
                  All Movies
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/login"
                >
                  <TbLogin />
                  Login
                </NavLink>
              </li>
            </ul>
          )}
        </nav>
      )}
    </div>
  );
};

export default MobileNav;
