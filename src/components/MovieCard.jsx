import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { TiStarFullOutline } from "react-icons/ti";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BiHeartCircle } from "react-icons/bi";
import { GiRoundStar } from "react-icons/gi";

import placeholder from '../assets/scss/images/poster-placeholder.png'

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
    const [movieInfo ,setMovieInfo] = useState({
        watchList: null,
        likedList: null
    })
    const [isDisabled, setIsDisabled] = useState(false); // State to disable buttons

    const checkUser = () => {
        setLoggedUser(localStorage.getItem("username"))
    }
    useEffect(() => {
      checkUser()
    }, [])
    

    const checkMovieData = () => {
        userData && setMovieInfo({
            watchList: userData.watchList,
            likedList: userData.likedList
        })
    }    
    useEffect(()=> 
        {checkMovieData()},[])


    const displayGenres = () => {
        const genreNames = genre_ids?.map(id => {
            const genre = genres.find(gen => gen.id === id);
            return genre ? genre.name : null;
        }).filter(name => name !== null); // Filter out any null values
        return genreNames?.join(', '); // Join the genre names with a comma
    };
    const addToWatchList = async ({id,title}) => { 
        if (loggedUser){
            setIsDisabled(true)
            if (movieInfo.watchList === true || movieInfo.watchList === 1){
                try{
                    const res = await axios.post('http://localhost:3070/addToWatchList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path,"watchList":false})
                    toast(`Successfully removed ${title} from watch list`)
                    setMovieInfo({...movieInfo, watchList:null})
                    setTimeout(() => {
                        setIsDisabled(false)
                        
                    }, 2000)
                    return res.data
                    } catch (err){
                    console.log(err)
                    toast('Your movie was not added')
                    }
            }else if(movieInfo.watchList === null ||movieInfo.watchList === 0) {
                try{ 
                    const res = await axios.post('http://localhost:3070/addToWatchList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path,"watchList":true})
                    toast(`Successfully added ${title} to watch list`)
                    setMovieInfo({...movieInfo, watchList:true})
                    setTimeout(() => {
                        setIsDisabled(false)
                        
                    }, 2000)
                    return res.data
                } catch (err){
                    console.log(err)
                    toast('Your Movie Was not added')
                }
            }
            
            } else {
                toast('You must be logged in to add movies to lists')
            }
    }
    const addToLikedList = async ({id,title}) => {
        if (loggedUser){
            setIsDisabled(true)
            if (movieInfo.likedList === true || movieInfo.likedList === 1){
                try{
                    const res = await axios.post('http://localhost:3070/addToLikedList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path,"likedList":false})
                    toast(`Successfully removed ${title} from liked list`)
                    setMovieInfo({...movieInfo, likedList:null})
                    setTimeout(() => {
                        setIsDisabled(false)
                        
                    }, 2000)
                    return res.data
                    } catch (err){
                    console.log(err)
                    toast('Your movie was not added')
                    }
            }else if(movieInfo.likedList === null ||movieInfo.likedList === 0) {
                try{ 
                    const res = await axios.post('http://localhost:3070/addTolikedList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path,"likedList":true})
                    toast(`Successfully added ${title} to liked list`)
                    setMovieInfo({...movieInfo, likedList:true})
                    setTimeout(() => {
                        setIsDisabled(false)
                    }, 2000)
                    return res.data
                } catch (err){
                    console.log(err)
                    toast('Your Movie Was not added')
                }
            }
            
            } else {
                toast('You must be logged in to add movies to lists')
            }
        
    }

  return (
    <div className="movie-card">
        <div className="movie-content">
            <div className="movie-header">
                <div className="header-left">
                    <BsBookmarkStarFill id="bookmarkIcon" className={`save-svg ${movieInfo.watchList ? 'bookmarked': '' }`} onClick={()=> !isDisabled && addToWatchList({id,title})}/>
                    <BiHeartCircle id="likeIcon"className={`heart-svg ${movieInfo.likedList ? 'liked': '' }`} onClick={()=> !isDisabled && addToLikedList({id,title})}/>
                </div>
            </div>
                <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`: placeholder} alt="" className="movie-image" />
            </div>
            <div className="movie-footer">
            <div className="group-row">
               <h3 className="movie-title">{title}</h3>
                <div className="vote-group">
                    <p className="vote-number"><GiRoundStar />{vote_average?.toFixed(1)}</p>
                </div>
            </div>
            <p className="year-release">
                {release_date?.slice(0,4)}
            </p>
             <div className="genre-group">
                    <p className="movie-genres">{displayGenres()}</p>                    
                </div>
    </div>
    
 </div>
  )
}

export default MovieCard