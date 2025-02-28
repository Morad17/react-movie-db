import React,{useEffect, useState} from 'react'


const Home = () => {

//Use States//
const [movieData, setMovieData ] = useState([])


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

const displayDescription = (id) => {
  const card = document.getElementById(id)
  card.style.display = "block"
  console.log(card)
}


  return (
    <div className="home-section">
      {
        movieData && movieData.map((movie, key)=> {
          return(<div className="movie-card">
            <h1>{movie.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
            <button onClick={() => displayDescription(`${movie.title}-card`)}>Description</button>
            <p className="movie-description" id={`${movie.title}-card`}>{movie.overview}</p>
          </div>)
        })
      } 
    </div>
  )
}

export default Home