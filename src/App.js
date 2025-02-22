import React from "react";
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {

  const Layout = () => {
    return(
      <div className="main-layout">
        <Navbar />
        <Home />
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
