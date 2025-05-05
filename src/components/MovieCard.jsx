import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
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
        },genres,userData,watchedFilter
    }) => {

    const [loggedUser, setLoggedUser ] = useState()
    const [movieInfo ,setMovieInfo] = useState({
        bookmarkList: null,
        likedList: null,
        watched:null,
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
            bookmarkList: userData.bookmarkList,
            likedList: userData.likedList,
            watched:userData.watched,
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
    const addTobookmarkList = async ({id,title}) => { 
        if (loggedUser){
            setIsDisabled(true)
            if (movieInfo.bookmarkList === true || movieInfo.bookmarkList === 1){
                try{
                    const res = await axios.post('http://localhost:3070/addToBookmarkList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path,"bookmarkList":false})
                    toast(`Successfully removed ${title} from the bookmarks list`)
                    setMovieInfo({...movieInfo, bookmarkList:null})
                    setTimeout(() => {
                        setIsDisabled(false)
                        
                    }, 2000)
                    return res.data
                    } catch (err){
                    console.log(err)
                    toast('Your movie was not added')
                    }
            }else if(movieInfo.bookmarkList === null ||movieInfo.bookmarkList === 0) {
                try{ 
                    const res = await axios.post('http://localhost:3070/addToBookmarkList',{"username":loggedUser, "movieId":id, "movieName":title,poster_path,"bookmarkList":true})
                    toast(`Successfully bookmarked ${title}`)
                    setMovieInfo({...movieInfo, bookmarkList:true})
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
    //Render Based on WatchedFilter //
    if (!watchedFilter && movieInfo.watched) {
        return null; 
      }

    return (
        <div className={`movie-card ${movieInfo.watched ? 'watched-card' : ''}`}>
            <div className="movie-content">
                <div className="movie-header">
                    <div className="header-left">
                        <BsBookmarkStarFill id="bookmarkIcon" className={`save-svg ${movieInfo.bookmarkList ? 'bookmarked': '' }`} onClick={()=> !isDisabled && addTobookmarkList({id,title})}/>
                        <BiHeartCircle id="likeIcon"className={`heart-svg ${movieInfo.likedList ? 'liked': '' }`} onClick={()=> !isDisabled && addToLikedList({id,title})}/>
                    </div>
                </div>
                    <Link to={`/moviePage/${id}`}>
                        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`: placeholder} alt="" className="movie-image" />
                    </Link>
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