import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

const MoviePage = () => {

    const [movieInfo, setMovieInfo] = useState()

    const params = useParams()
    const getMoveInfo = async () => {
        const id = params
        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
        console.log(url)
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
        console.log(movieInfo)
    },[])
  return (
    <div>MoviePage</div>
  )
}

export default MoviePage