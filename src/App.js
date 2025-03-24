import React, { useEffect, useState } from "react";
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import MovieLibrary from "./pages/MovieLibrary";
import User from "./pages/User";

import AuthProvider from "./hooks/Authprovider";
import UserPage from "./pages/UserPage";

function App() {

  const [loggedUser, setLoggedUser ] = useState('')

  useEffect(()=> {
     const username = setLoggedUser(localStorage.getItem("username"))
    if(username) setLoggedUser(username)
    },[])

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
        element: loggedUser ? <UserPage /> :<Home />
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
     <RouterProvider router={router} />
    </div>
  );
}

export default App;
