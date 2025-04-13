import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

import { TiStarFullOutline } from "react-icons/ti";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BiHeartCircle } from "react-icons/bi";

const MovieCard = ({
    movie:{
        id,
        backdrop_path,
        genre_ids,
        IdleDeadline,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
        video,
        vote_average,
        vote_count,
        },genres,userData
    }) => {

    const [loggedUser, setLoggedUser ] = useState()

    const checkUser = () => {
        setLoggedUser(localStorage.getItem("username"))
    }    
    useEffect(()=> 
        {checkUser()},[])


    const displayGenres = () => {
        const genreNames = genre_ids.map(id => {
            const genre = genres.find(gen => gen.id === id);
            return genre ? genre.name : null;
        }).filter(name => name !== null); // Filter out any null values
        return genreNames.join(', '); // Join the genre names with a comma
    };

    const addToWatchList = async ({id,title}) => {
        if (loggedUser){
           try{ 
             const res = await axios.post('http://localhost:3070/addToWatchList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path})
             toast('Successfully Added To Watch List')
             return res.data
           } catch (err){
            console.log(err)
            toast('Your Movie Was not added')
           }
        }
        
    }
    const addToLikedList = async ({id,title}) => {
        if (loggedUser){
           try{ 
             const res = await axios.post('http://localhost:3070/addToLikedList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path})
             toast('Successfully Added To Liked List')
             return res.data
           } catch (err){
            console.log(err)
           }
        }
        
    }

  return (

    <div className="movie-card">
        <div className="movie-header">
            <div className="header-left">
                <BsBookmarkStarFill className={`save-svg ${userData && userData.watchList ? 'bookmarked': '' }`} onClick={()=> addToWatchList({id,title})}/>
                <BiHeartCircle className={`heart-svg ${userData && userData.likedList ? 'liked': '' }`} onClick={()=> addToLikedList({id,title})}/>
            </div>
            <div className="header-right">
                <p>Test</p>
            </div>
           
        </div>
        <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="" className="movie-image" />
        <div className="movie-footer">
            <h3 className="movie-title">{title}</h3>
            <div className="vote-group">
                <p className="vote-number">{vote_average.toFixed(1)}/10</p>
            </div>
            <div className="genre-group">
                <p className="movie-genres">{displayGenres()}</p>                    
            </div>
        </div>
        <ToastContainer autoClose={3000} draggable={false} />
    </div>
    
  )
}

export default MovieCard