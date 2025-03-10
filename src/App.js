import React from "react";
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import MovieLibrary from "./pages/MovieLibrary";
import User from "./pages/User";

function App() {

  const Layout = () => {
    return(
      <div className="main-layout">
        <Navbar />
        <Outlet />
        <Footer />
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
        element: <Home />
      },
      {
        path:'/library',
        element:<MovieLibrary />,
      },
      {
        path: '/user',
        element: <User />
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
