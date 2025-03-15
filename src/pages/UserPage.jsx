import React, { useEffect } from 'react'

const UserPage = () => {

const checkUser = () => {
    const user = localStorage.getItem("username")
    
}    

    useEffect(()=> {
        checkUser()
    },[])


  return (
    <div>UserPage</div>
  )
}

export default UserPage