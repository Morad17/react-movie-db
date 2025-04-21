import React,{useEffect, useState} from 'react'
import MovieCard from '../components/MovieCard';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import Pagination from '../components/Pagination';
import { BsBookmarkStarFill } from 'react-icons/bs';
import { BiHeartCircle } from 'react-icons/bi';
import SearchMovie from '../components/SearchMovie';


const MovieLibrary = () => {

////Use States////
const [movieData, setMovieData ] = useState([])
const [genres, setGenres ] = useState([])
const [userMovieData, setUserMovieData ] = useState([])
const [movieSearchRes, setMovieSearchRes] = useState(null)
//Pagination
const [currentPage,setCurrentPage ] = useState(1)
const [totalPages, setTotalPages] = useState()

// Get All Movies//
const fetchMovies = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
    }
  };
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage || 1 }`
  try{
    const res = await fetch(url , options)
    const data = await res.json()
    let arr = []
    data.results.forEach ( movie =>{
      arr.push(movie)
    })
    setMovieData(arr)
    setTotalPages(data.total_pages)
  } catch (err) {
    console.log(err)
  }
}
useEffect(() => {
 fetchMovies()
},[currentPage])

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

const paginate = (number) => setCurrentPage(number)
const movieSearch = (movieRes) => setMovieSearchRes(movieRes)


  return (
    <div className="movie-library-section">
      <section className="movie-library-header">
        <div className="movie-left">
          <div className="info-div">
            <h3>Get Started</h3>
            <p>Click on the movie for more info </p>
            <p> <BsBookmarkStarFill /> Click The Bookmark Icon to add movie to watch list.
             Click again to remove from list</p>
            <p><BiHeartCircle /> Click the Like icon to add movie to liked list. Click again to 
            remove.</p>
           
          
          </div>
        </div>
        <div className="movie-center">
          <h2>All Movies</h2>
          <div className="search-div">
            <SearchMovie movieSearch={movieSearch}/>
          </div>
        </div>
        <div className="movie-right">
          <a href="" className="sort-btn">Sort</a>
          <a href="" className="filter-btn">Filter</a>
        </div>
      </section>
      <div className="all-movies">
        { movieSearchRes ? movieSearchRes.map((movie, key)=> {
          const userMovie = userMovieData?.filter((userMovie)=> userMovie.movieName === movie.title)[0] || null
          return <MovieCard userData={userMovie} key={key} movie={movie} genres={genres}/>
        })
          : movieData && movieData.map((movie, key)=> {
          const userMovie = userMovieData?.filter((userMovie)=> userMovie.movieName === movie.title)[0] || null
          return <MovieCard userData={userMovie} key={key} movie={movie} genres={genres}/>
          })}
      <Pagination paginate={paginate} totalPages={totalPages}/>
      </div>
      
    </div>
  )
}

export default MovieLibrary 