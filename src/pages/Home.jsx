import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/Authprovider";
import { Link, useNavigate } from "react-router";
import Banner from "../components/Banner";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import placeholder from "../assets/images/profile-image-placeholder.png";

const Home = () => {
  //For Testing vs Production
  const baseUrl =
    process.env.REACT_APP_BASE_URL || "https://movie-binge.onrender.com";

  //Hooks
  const navigate = useNavigate();
  const auth = useAuth();
  //-----Use States -----//
  const [user, setUser] = useState(null);
  const [register, setRegister] = useState({
    username: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginButton, setLoginButton] = useState(true);
  // Check if users already logged in
  const checkUser = () => {
    setUser(localStorage.getItem("username"));
  };
  //Profile Image Upload
  const [previewUrl, setPreviewUrl] = useState(null);
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
        `${baseUrl}/checkUserExists?username=${encodeURIComponent(
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
      toast(existsResult.errMsg, {
        className: "toast-warning",
      });
      return;
    }
    // Check Image Upload
    let imageUrl = register.profileImage;
    if (imageUrl) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return;
    } else {
      toast("You must upload a Profile Image", {
        className: "toast-warning",
      });
      return;
    }
    //All Form validation Checks //
    const errors = [];
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(register.firstName)) {
      toast(
        "First name can only contain letters, spaces, apostrophes, or hyphens.",
        {
          className: "toast-warning",
        }
      );
      return;
    }
    if (!nameRegex.test(register.lastName)) {
      toast(
        "Last name can only contain letters, spaces, apostrophes, or hyphens.",
        {
          className: "toast-warning",
        }
      );
      return;
    }
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
      toast(errors[0], {
        className: "toast-warning",
      });
      return;
    }
    try {
      const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      // In your registerHandler:
      const name =
        capitalize(register.firstName.trim()) +
        " " +
        capitalize(register.lastName.trim());
      const { firstName, lastName, confirm, ...rest } = register;
      const userData = { ...rest, name };
      userData.profileImage = imageUrl;
      await axios.post(`${baseUrl}/createUser`, userData);
      toast("You have successfully registered!", {
        className: "toast-success",
      });
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 1500);
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
      toast("Incorrect login details, Please try again", {
        className: "toast-warning",
      });
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
  // Handle Profile Image Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      // 2MB in bytes
      alert("File size must be less than 2MB");
      e.target.value = ""; // Clear the input
    } else {
      setRegister((prev) => ({ ...prev, profileImage: file }));
      //Image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };
  const handleImageUpload = async () => {
    const profileImage = register.profileImage;
    if (!profileImage) return;
    const formData = new FormData();
    formData.append("image", profileImage);
    try {
      const res = await axios.post(`${baseUrl}/uploadProfileImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.url;
    } catch (err) {
      alert("Upload failed");
      console.error(err);
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
              className="login-btn"
              id="loginBtn"
              onClick={(e) => setLoginButtonLogic(e)}
            >
              Login
            </button>
            <button
              className="register-btn"
              id="registerBtn"
              onClick={(e) => setLoginButtonLogic(e)}
            >
              Register
            </button>
          </div>

          {loginButton ? (
            <div className="login-form-div">
              <h3 className="login-title">Login</h3>
              <form className="login-form" onSubmit={loginHandler}>
                <div className="login-image-div">
                  <img className="login-image" src={placeholder} alt="" />
                </div>
                <div className="form-group login-group">
                  <label>Username</label>
                  <input
                    required
                    type="text"
                    name="username"
                    value={loginForm.username}
                    onChange={loginInputHandler}
                  />
                </div>
                <div className="form-group login-group">
                  <label>Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={loginInputHandler}
                  />
                </div>
                <button className="submit-btn" type="submit">
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <div className="register-form-div">
              <h2 className="registration-title">Registration</h2>
              <form className="registration-form" onSubmit={registerHandler}>
                <div className="form-left">
                  <img
                    className="upload-image"
                    src={previewUrl ? previewUrl : placeholder}
                    alt="Profile"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="upload-image-label"
                  >
                    Upload Profile Image
                    <input
                      id="profile-upload"
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      className="upload-input"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="form-right">
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
                    <div className="form-name">
                      <span className="form-group-name">
                        <input
                          required
                          type="text"
                          name="firstName"
                          value={register.firstName}
                          onChange={inputHandler}
                        />
                        <label>First</label>
                      </span>
                      <span className="form-group-name">
                        <input
                          required
                          type="text"
                          name="lastName"
                          value={register.lastName}
                          onChange={inputHandler}
                        />
                        <label>Last</label>
                      </span>
                    </div>
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
                  <div className="submit-btn-group">
                    <button className="submit-btn" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
