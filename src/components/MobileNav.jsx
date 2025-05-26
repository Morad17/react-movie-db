import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/Authprovider";

import { RxHamburgerMenu } from "react-icons/rx";
import { RiFilmAiFill, RiLogoutBoxRFill } from "react-icons/ri";
import { FaChartPie } from "react-icons/fa6";

import Logo from "../assets/images/movie-logo.svg";
import LogoSvg from "./LogoSvg";
import LogoSvg2 from "./LogoSvg2";

const MobileNav = () => {
  const [loggedUser, setLoggedUser] = useState("");
  const [burgerClicked, setBurgerClicked] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const profileImage = localStorage.getItem("profileImage");
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
        </div>
      </div>
      {burgerClicked && (
        <nav className="main-mobile-nav">
          {loggedUser.username ? (
            <ul className="logged-in-nav-links">
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
              <li>
                <NavLink className="link" onClick={() => logout()}>
                  <RiLogoutBoxRFill />
                  Logout
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="logged-out-nav-links">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/library"
                >
                  Movies
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "link active-link" : "link"
                  }
                  to="/login"
                >
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
