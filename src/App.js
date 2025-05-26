import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setLoggedUser(username);
  }, [loggedUser]);
  const currentWidth = window.innerWidth;
  const Layout = () => {
    return (
      <div className="main-layout">
        <AuthProvider>
          {currentWidth < 769 ? <MobileNav /> : <Navbar />}

          <Outlet />
          <Footer />
        </AuthProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
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
            currentWidth < 768 ? <MovieLibrary /> : <MobileMovieLibrary />,
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
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} draggable={false} />
    </div>
  );
}

export default App;
