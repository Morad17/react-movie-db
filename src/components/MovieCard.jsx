import React, { useEffect, useState } from 'react'
import { TiStarFullOutline } from "react-icons/ti";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BiHeartCircle } from "react-icons/bi";
import axios from 'axios';



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
        },genres}) => {

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

    const watchList = async (id) => {
        if (loggedUser){
           try{
             const res = await axios.post('http://localhost:3070/addToWatchList',{"username":loggedUser})
             console.log(res.data)
           } catch (err){
            console.log(err)
           }
        }
        
    }

  return (

    <div className="movie-card">
        <div className="movie-header">
            <div className="header-left">
                <BsBookmarkStarFill className="save-svg" onClick={(id)=> watchList(id)}/>
                <BiHeartCircle className="heart-svg"/>
            </div>
            <div className="header-right">

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
    </div>
    
  )
}

export default MovieCard