import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import {Pagination,Navigation } from 'swiper/modules'

import { IoPersonCircleOutline } from "react-icons/io5";
import MovieCard from '../components/MovieCard';
import UserMovieCard from '../components/UserMovieCard';
import { Link } from 'react-router';


  const UserPage = () => {

    const [loggedUser, setLoggedUser ] = useState()
    const [userInfo, setUserInfo] = useState([])
    const [listToggle, setListToggle] = useState('watched')

  const checkUser = async () => {
      const username = localStorage.getItem("username")
      setLoggedUser(username)
      if (username) {
        try {
          const res = await axios.post("http://localhost:3070/getUserTable", {"username":username})
          setUserInfo(res.data)
        } catch (err) {
          console.log(err)
        }
        }}    
    useEffect(()=> {
        checkUser()
    },[])

    const checkIfEmpty = () => {
      const hasWatchList = userInfo.some((row) => row.watchList === 1);
      if (hasWatchList) {
        console.log("true");
      } else {
        console.log("testing");
      }
    };


  return (
    <div className="user-page-section">
      <div className="top-row">
        <section className="stats-left">

        </section>
        <section className="user-overview-section">
            <div className="user-icon">
              <IoPersonCircleOutline />
            </div>
            <h3>{ loggedUser && loggedUser}</h3>
        </section>
        <section className="stats-right">

        </section>
        
      </div>
      <div className="bottom-row">
        
        <section className="my-lists-section">
          <h2>My Lists</h2>
          <div className="list-name">
            <button 
              className={`list-button ${listToggle === 'watched' ? 'list-button-active' : ''}`} 
              onClick={() => setListToggle('watched')}>To Watch</button>
            <button 
              className={`list-button ${listToggle === 'like' ? 'list-button-active' : ''}`} 
              onClick={() => setListToggle('like')}>Liked</button>
            
          </div>
          <div className="list-slider">
            {
            listToggle === 'watched' ?           
                <div className="watch-list-section">
                  <div className="watch-list-cards">
                  {
                  userInfo &&
                    <Swiper
                      spaceBetween={1}
                      slidesPerView={6}
                      pagination={{
                        type: "progressbar",
                      }}
                      modules={[Pagination, Navigation]}
                      navigation={true}>
                    
                    {userInfo.map((movie, key)=> {
                    if (movie.watchList === 1){
                    return  <SwiperSlide className="swiper-slide" key={key}>
                              <UserMovieCard  movie={movie} />
                              <div className="watch-list-buttons">
                                <button className="watched-button">Watched</button>
                              </div>
                            </SwiperSlide>}})
                      }
                    </Swiper>
                    }
                    </div>
                </div>:
                <div className="liked-section">
                {
                  userInfo &&
                    <Swiper
                      spaceBetween={1}
                      slidesPerView={7}
                      pagination={{
                        type: "progressbar",
                      }}
                      modules={[Pagination, Navigation]}
                      navigation={true}>
                    
                    {
                      //  if{
                      //   return  <div className="empty-card-slide">
                      //             <h2>Your List is empty</h2>
                      //             <p>Click <Link to="/library">Here</Link> to add more Movies</p>
                      //           </div>
                      // }
                    
                    userInfo.map((movie, key)=> {
                    if (movie.likedList === 1)
                      { return  <SwiperSlide className="swiper-slide" key={key}>
                                  <UserMovieCard  movie={movie} />
                                  <div className="liked-list-buttons">
                                    <button className="liked-button">Watched</button>
                                  </div>
                                </SwiperSlide>
                      }
                    })} 
                    </Swiper>
                }
                {
                  checkIfEmpty()
                }
                </div>

                }
          </div>
          

          
        </section>
        <section className="review-section">
          <h2>Review A Movie</h2>
          <div className="review"></div>
        </section>
      </div>
    </div>
  )
}

export default UserPage