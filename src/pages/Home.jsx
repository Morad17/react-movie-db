import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/Authprovider";
import { Link, useNavigate } from "react-router";
import Banner from "../components/Banner";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  //For Testing vs Production
  const baseUrl =
    process.env.REACT_APP_BASE_URL || "https://movie-binge.onrender.com";

  //Hooks
  const navigate = useNavigate();
  const auth = useAuth();
  //-----Use States -----//
  const [user, setUser] = useState(null);
  const [existingUserData, setExistingUserData] = useState({});
  const [register, setRegister] = useState({
    username: "",
    name: "",
    profileImage: "https:fakepath",
    email: "",
    password: "",
    confirm: "",
  });
  const [statusCode, setStatusCode] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginButton, setLoginButton] = useState(true);
  // Check if users already logged in
  const checkUser = () => {
    setUser(localStorage.getItem("username"));
  };

  /////////Registration///////////
  useEffect(() => {
    checkUser();
  }, [user]);

  const inputHandler = (val) => {
    setRegister((prev) => ({ ...prev, [val.target.name]: val.target.value }));
  };

  ///Runs checks then submits user form ///
  const registerHandler = async (e) => {
    e.preventDefault();
    // Checking for existing matches
    const checkUserExists = async (username, email) => {
      const res = await axios.get(
        `${baseUrl}/check-user-exists?username=${encodeURIComponent(
          username
        )}&email=${encodeURIComponent(email)}`
      );
      return res.data;
    };
    const existsResult = await checkUserExists(
      register.username,
      register.email
    );
    if (existsResult.exists) {
      toast(existsResult.message);
      return;
    }
    //Checking username and password //
    const errors = [];
    if (register.username.length < 6 || register.username.length > 15) {
      errors.push("Username must be between 6 and 15 characters long");
    }
    if (register.password.length < 8) {
      errors.push("Password must contain at least 8 characters");
    }
    if (register.password !== register.confirm) {
      errors.push("Passwords Do Not Match");
    }

    if (errors.length > 0) {
      toast(errors[0]); // or loop through errors to show all
      return;
    }
    try {
      const { confirm, ...userData } = register;
      await axios.post(`${baseUrl}/createUser`, userData);
      toast("You have successfully registered!");
    } catch (err) {
      console.log(err);
    }
  };

  ///////Logging In/////////
  const loginInputHandler = (val) => {
    setLoginForm((prev) => ({ ...prev, [val.target.name]: val.target.value }));
  };

  /// Login input

  const loginHandler = async (e) => {
    e.preventDefault();
    const result = await auth.loginAction(loginForm);
    if (result === 400) {
      toast("Incorrect login details, Please try again");
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
      <div className="header-section">
        <Banner title={"Home"} />
      </div>
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
            <p className="login-heading">Login or Register To Get Started</p>
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
                    name="profileImage"
                    value={register.profileImage}
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
                <button className="submit-btn" type="submit">
                  Submit
                </button>
              </form>
            </div>
          )}
          <ToastContainer autoClose={2000} draggable={false} />
        </div>
      )}
    </div>
  );
};

export default Home;
