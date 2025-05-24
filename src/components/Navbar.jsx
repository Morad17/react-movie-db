import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/Authprovider";

import Logo from "../assets/images/movie-logo.svg";
import LogoSvg from "./LogoSvg";
import LogoSvg2 from "./LogoSvg2";

const Navbar = () => {
  const [loggedUser, setLoggedUser] = useState("");
  const auth = useAuth();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setLoggedUser(username);
    }
  }, [auth.user]);

  const logout = () => {
    auth.logout();
    setLoggedUser("");
  };

  return (
    <nav className="main-nav">
      {loggedUser ? (
        <div className="logged-in-nav">
          <div className="nav-logo">
            <LogoSvg2 fill={"#501218"} />
          </div>
          <ul className="main-nav-links">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active-link" : "link"
                }
                to="/userPage"
              >
                {loggedUser}
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
                to="/"
              >
                Stats
              </NavLink>
            </li>
            <li>
              <NavLink className="link" onClick={() => logout()}>
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <div className="logged-out-nav">
          <div className="nav-logo">
            <LogoSvg2 />
          </div>
          <ul className="main-nav-links">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
