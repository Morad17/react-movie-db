import React,{useEffect, useState} from 'react'
import MovieCard from '../components/MovieCard';


const Home = () => {

//Use States//
const [movieData, setMovieData ] = useState([])
const [genres, setGenres ] = useState([])


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
    console.log(data)
    setGenres(data.genres)
    console.log(genres)
  } catch (err) {
    console.log(err)
  }
}
useEffect(() => {
 fetchGenres()
},[])

const displayDescription = (id) => {
  const card = document.getElementById(id)
  card.style.display = "block"
  console.log(card)
}


  return (
    <div className="home-section">
      { movieData && movieData.map((movie, key)=> {
        return <MovieCard movie={movie} genres={genres}/>
        })
      } 
    </div>
  )
}

export default Home