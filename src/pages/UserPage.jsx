import React, { useEffect, useState } from 'react'

import { IoPersonCircleOutline } from "react-icons/io5";


const UserPage = () => {

  const [loggedUser, setLoggedUser ] = useState()

const checkUser = () => {
    setLoggedUser(localStorage.getItem("username"))
    
}    

    useEffect(()=> {
        checkUser()
    },[])


  return (
    <div className="user-page-section">
      <div className="top-row">
        <section className="liked-section">
          <p>Test</p>
        </section>
        <section className="user-overview-section">
          <div className="user-icon">
            <IoPersonCircleOutline />
          </div>
          <h3>{ loggedUser && loggedUser}</h3>
        </section>
        <section className="watch-list-section">
        </section>
      </div>
      <div className="bottom-row">
        <section className="reviewed-movies-section">
        </section> 
        <section className="stats-section">
        </section>
      </div>

     
    </div>
  )
}

export default UserPage