import React, { useEffect } from 'react'

const UserPage = () => {

const checkUser = () => {
    const user = localStorage.getItem("username")
    
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
        <section className="watch-list-section">
        </section>
      </div>
      <div className="middle-row">
        <section className="user-overview-section">
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