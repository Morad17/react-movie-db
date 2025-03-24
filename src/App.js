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

function App() {

  const [loggedUser, setLoggedUser ] = useState(null)

  useEffect(()=> {
    const username = localStorage.getItem("username")
    console.log(username)
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
    </div>
  );
}

export default App;
