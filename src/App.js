import React, { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import MovieLibrary from "./pages/MovieLibrary";
import User from "./pages/User";

import AuthProvider from "./hooks/Authprovider";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MoviePage from "./pages/MoviePage";
import MobileNav from "./components/MobileNav";
import MobileMovieLibrary from "./pages/MobileMovieLibrary";

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    // Call once to set initial state
    handleResize();
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setLoggedUser(username);
  }, [loggedUser]);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: (
            <div className="main-layout">
              <AuthProvider>
                {isResponsive ? <MobileNav /> : <Navbar />}

                <Outlet />
                <Footer />
              </AuthProvider>
            </div>
          ),
          children: [
            {
              path: "/",
              element: <ProtectedRoute />,
            },
            {
              path: "/login",
              element: <Home />,
            },
            {
              path: "/library",
              element: isResponsive ? <MobileMovieLibrary /> : <MovieLibrary />,
            },
            {
              path: "/userPage",
              element: <UserPage />,
            },
            {
              path: "/moviePage/:id",
              element: <MoviePage />,
            },
          ],
        },
      ]),
    [isResponsive]
  );

  return (
    <div className="App">
      <RouterProvider
        router={router}
        key={isResponsive ? "mobile" : "desktop"}
      />
      <ToastContainer autoClose={2000} draggable={false} />
    </div>
  );
}

export default App;
