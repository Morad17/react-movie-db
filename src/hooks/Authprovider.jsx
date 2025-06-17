import { useContext, createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  //For Testing vs Production
  const baseUrl =
    process.env.REACT_APP_BASE_URL || "https://movie-binge.onrender.com";

  const loginAction = async ({ username, password }) => {
    try {
      const res = await axios.post(`${baseUrl}/login`, {
        username: username,
        password: password,
      });

      if (res.data.length > 0) {
        const user = res.data[0];
        console.log(user);
        setUser({ username: username, profileImage: user.profileImage });
        setToken(user.username);
        localStorage.setItem("username", user.username);
        localStorage.setItem("profileImage", user.profileImage);
        return navigate("/userPage");
      } else {
        return 400;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("username");
    console.log("successfully logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
