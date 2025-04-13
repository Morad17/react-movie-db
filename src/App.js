import React, { useEffect, useState } from "react";
import { Outlet, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import MovieLibrary from "./pages/MovieLibrary";
import User from "./pages/User";

import AuthProvider from "./hooks/Authprovider";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {

  const [loggedUser, setLoggedUser ] = useState(null)

  useEffect(()=> {
    const username = localStorage.getItem("username")
    if (username) setLoggedUser(username)
    },[loggedUser])

  const Layout = () => {
    return(
      <div className="main-layout">
        <AuthProvider>
          <Navbar />
          <Outlet />
          <Footer />
        </AuthProvider>
        
      </div>
    
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
        path: '/',
        element: <ProtectedRoute />
      },
      {
        path:'/library',
        element:<MovieLibrary />,
      },
      {
        path: '/userPage',
        element: <UserPage />
      }
    ]
    }
  ])

  return (
    <div className="App">
     <RouterProvider  router={router} />
     <ToastContainer autoClose={2000} draggable={false} />
    </div>
  );
}

export default App;
