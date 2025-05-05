import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import placeholder from '../assets/scss/images/poster-placeholder.png'
import { GiRoundStar } from 'react-icons/gi'

const MoviePage = () => {

    const [movieInfo, setMovieInfo] = useState()

    const params = useParams()
    const getMoveInfo = async () => {
        const { id } = params
        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
            }
          };
        try {
            const res = await fetch(url, options)
            const data = await res.json()
            setMovieInfo(data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=> {    
        getMoveInfo()
    },[])
  return ( 
    <div className="movie-page-section">
        {movieInfo ? 
            <div className="movie-page-card">
                <img src={movieInfo.poster_path ? `https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`: placeholder}  alt="" className="poster-image" />
                <div className="movie-page-info-section">
                <h2>{movieInfo.title} {movieInfo.release_date.slice(0,4)} {movieInfo.origin_country}</h2>
                <p className="vote-number"><GiRoundStar />{movieInfo.vote_average?.toFixed(1)}</p>
                <div className="genre-section">
                    {
                    movieInfo.genres.map((g,key) => {
                        return <p className="genre" key={key}>{g.name}</p>
                    }) 
                    }
                    
                </div>
                </div>
                <div className="overview-section">
                    <p className="overview">{movieInfo.overview}</p>
                </div>
                <div className="cast-section">

                </div>
                <div className="trailer-section">

                </div>
                <div className="reviews-section">

                </div> 
            </div>: 
            <p>Loading...</p>}
    </div>
        
  )
}

export default MoviePage