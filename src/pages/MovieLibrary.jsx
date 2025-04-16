import React,{useEffect, useState} from 'react'
import MovieCard from '../components/MovieCard';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';


const MovieLibrary = () => {

////Use States////
const [movieData, setMovieData ] = useState([])
const [genres, setGenres ] = useState([])
const [userMovieData, setUserMovieData ] = useState({})
//Pagination
const [currentPage,getCurrentPage ] = useState(1)
const [cardsPerPage, setCardsPerPage] = useState(21)

// Get All Movies//
const fetchMovies = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
    }
  };
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
  try{
    const res = await fetch(url , options)
    const data = await res.json()
    let arr = []
    data.results.forEach ( movie =>{
      arr.push(movie)
    })
    setMovieData(arr)
  } catch (err) {
    console.log(err)
  }
}
useEffect(() => {
 fetchMovies()
},[])

// Get Genre Name from Genre Id //
const fetchGenres = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
    }
  };
  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
  try{
    const res = await fetch(url , options)
    const data = await res.json()
    setGenres(data.genres)
  } catch (err) {
    console.log(err)
  }
}
useEffect(() => {
 fetchGenres()
},[])

// Get User Liked and Bookmarked data //
const getUserMovieData = async () => {
  const user = localStorage.getItem("username")
  if (user) {
     try {
    const res = await axios.post('http://localhost:3070/getUserTable', {"username":user})
    setUserMovieData(res.data)
    } catch (err) {
      console.log(err)
    }
    }
 
}
useEffect(() => {
  getUserMovieData()
}, [])

//Pagination
const indexOfLastCard = currentPage * cardsPerPage
const indexOfFirstCard = indexOfLastCard - cardsPerPage
// const currentCards 


  return (
    <div className="movie-library-section">
      { movieData && movieData.map((movie, key)=> {
        const userMovie = userMovieData?.filter((userMovie)=> userMovie.movieName === movie.title)[0] || null
        return <MovieCard userData={userMovie} key={key} movie={movie} genres={genres}/>
        })
      }
    </div>
  )
}

export default MovieLibrary 