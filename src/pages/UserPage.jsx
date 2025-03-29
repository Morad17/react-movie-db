import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { IoPersonCircleOutline } from "react-icons/io5";
import MovieCard from '../components/MovieCard';
import UserMovieCard from '../components/UserMovieCard';


const UserPage = () => {

  const [loggedUser, setLoggedUser ] = useState()
  const [userInfo, setUserInfo] = useState([])

const checkUser = async () => {
    const username = localStorage.getItem("username")
    setLoggedUser(username)
    if (username) {
      try {
        const res = await axios.post("http://localhost:3070/getUserTable", {"username":username})
        console.log(res.data)
        setUserInfo(res.data)
      } catch (err) {
        console.log(err)
      }
      
    }
}    

    useEffect(()=> {
        checkUser()
    },[])


  return (
    <div className="user-page-section">
      <div className="top-row">
        <section className="liked-section">
          <h2>My Liked List</h2>
          
        </section>
        <section className="user-overview-section">
          <div className="user-icon">
            <IoPersonCircleOutline />
          </div>
          <h3>{ loggedUser && loggedUser}</h3>
        </section>
        <section className="watch-list-section">
        <h2>My Watch List</h2>
        <div className="watch-list-cards">
          {
            userInfo?.map((movie, key)=> {
              if (movie.watchList === 1){
                return <UserMovieCard key={key} movie={movie} />
              }
            })
          }
        </div>
        </section>
      </div>
      <div className="bottom-row">
        <section className="reviewed-movies-section">
          <h2>Reviewed Movies</h2>
        </section> 
        <section className="stats-section">
          <h2>Stats</h2>
        </section>
      </div>

     
    </div>
  )
}

export default UserPage