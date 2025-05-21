import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/Authprovider";
import { Link, useNavigate } from "react-router";

const Home = () => {
  //Hooks
  const navigate = useNavigate();
  const auth = useAuth();

  // Check if users already logged in
  const [user, setUser] = useState(null);
  const checkUser = () => {
    setUser(localStorage.getItem("username"));
  };

  /////////Registration///////////
  useEffect(() => {
    checkUser();
  }, [user]);

  //Get Existing User Data //
  const getExistingUserData = async () => {
    try {
      const res = await axios.get("http://localhost:3070/get-existing-users");
      const data = res.data;
      const usernames = [];
      const emails = [];
      data.map((user, key) => {
        usernames.push(user.username);
        emails.push(user.email);
      });
      setExistingUserData({
        usernames,
        emails,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getExistingUserData();
  }, []);

  const [existingUserData, setExistingUserData] = useState({});
  const inputHandler = (val) => {
    setRegister((prev) => ({ ...prev, [val.target.name]: val.target.value }));
  };
  const [register, setRegister] = useState({
    username: "",
    name: "",
    profileImage: "",
    email: "",
    password: "",
    confirm: "",
  });
  ///Runs checks then submits user form ///
  const registerHandler = async (e) => {
    // Checks for Existing users error and length error //
    e.preventDefault();
    if (register.username.length < 6 || register.username.length > 15) {
      return statusCodeHandler(401);
    } else if (register.password.length < 8) {
      return statusCodeHandler(402);
    } else if (register.password !== register.confirm) {
      return statusCodeHandler(403);
    } else if (existingUserData.usernames.includes(register.username)) {
      return statusCodeHandler(501);
    } else if (existingUserData.emails.includes(register.email)) {
      return statusCodeHandler(502);
    }
    try {
      const { confirm, ...userData } = register;
      await axios.post("http://localhost:3070/createUser", userData);
      statusCodeHandler(201);
    } catch (err) {
      console.log(err);
    }
  };

  ///////Logging In/////////
  const loginInputHandler = (val) => {
    setLoginForm((prev) => ({ ...prev, [val.target.name]: val.target.value }));
  };
  const [statusCode, setStatusCode] = useState("");

  /// Login input
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const loginHandler = async (e) => {
    e.preventDefault();
    const result = await auth.loginAction(loginForm);
    if (result === 400) {
      statusCodeHandler(400);
    }
  };
  ///Form Changer
  const [loginButton, setLoginButton] = useState(true);

  // Status Codes for error messages
  const statusCodeHandler = (statusCode) => {
    switch (statusCode) {
      case 501:
        setStatusCode("Username Already Exists");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      case 502:
        setStatusCode("Email is Alreading in use");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      case 400:
        setStatusCode("Incorrect login details, Please try again");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      case 401:
        setStatusCode("Username must be between 6 and 15 characters long");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      case 402:
        setStatusCode("Password must contain at least 8 characters");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      case 403:
        setStatusCode("Passwords Do Not Match");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      case 201:
        setStatusCode("You have successfully registered!");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);

        break;
      case 101:
        setStatusCode("Only Alphabetical Characters Aloud");
        setTimeout(() => {
          setStatusCode(null);
        }, 3000);
        break;
      default:
        break;
    }
  };

  const setLoginButtonLogic = (e) => {
    const button = e.target.id;
    if (button === "loginBtn") {
      const register = document.getElementById("registerBtn");
      register.disabled = false;
      register.style.backgroundColor = "#c3c3c3";
      e.target.style.backgroundColor = "#12504A";
      e.target.disabled = true;
      setLoginButton(true);
    } else {
      const login = document.getElementById("loginBtn");
      login.disabled = false;
      login.style.backgroundColor = "#c3c3c3";
      e.target.style.backgroundColor = "#12504A";
      e.target.disabled = true;
      setLoginButton(false);
    }
  };

  return (
    <div className="home-section">
      <h1>Movie Database</h1>
      <div className="header-section"></div>
      {user ? (
        <div className="">
          <h2>Click on the Button To Get Started</h2>
          <div className="navigate-link">
            <Link to="/userPage">Get Started</Link>
          </div>
        </div>
      ) : (
        <div className="forms-container">
          <div className="login-and-register">
            <p className="login-heading">Login To Get Started</p>
            <button
              className="btn"
              id="loginBtn"
              onClick={(e) => setLoginButtonLogic(e)}
            >
              Login
            </button>
            <button
              className="btn"
              id="registerBtn"
              onClick={(e) => setLoginButtonLogic(e)}
            >
              Register
            </button>
          </div>

          {loginButton ? (
            <div className="login-form">
              <form onSubmit={loginHandler}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    required
                    type="text"
                    name="username"
                    value={loginForm.username}
                    onChange={loginInputHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={loginInputHandler}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : (
            <div className="register-form">
              <form onSubmit={registerHandler}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    required
                    type="text"
                    name="username"
                    value={register.username}
                    onChange={inputHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={register.name}
                    onChange={inputHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image</label>
                  <input
                    required
                    type="file"
                    name="name"
                    value={register.name}
                    onChange={inputHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={register.email}
                    onChange={inputHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={register.password}
                    onChange={inputHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Re-Type Password</label>
                  <input
                    required
                    type="password"
                    name="confirm"
                    value={register.confirm}
                    onChange={inputHandler}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
          {statusCode && (
            <div className="status-code-message">{statusCode}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
