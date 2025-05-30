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
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setCurrentWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
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
                {currentWidth < 769 ? <MobileNav /> : <Navbar />}

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
              element:
                currentWidth < 769 ? <MobileMovieLibrary /> : <MovieLibrary />,
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
    [currentWidth]
  );

  return (
    <div className="App">
      <RouterProvider
        router={router}
        key={currentWidth < 769 ? "mobile" : "desktop"}
      />
      <ToastContainer autoClose={2000} draggable={false} />
    </div>
  );
}

export default App;
