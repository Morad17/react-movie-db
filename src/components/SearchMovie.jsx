import React, { useEffect, useState } from 'react'


const SearchMovie = () => {

    useEffect(()=>{},[])

    const [searchQuery, setSearchQuery] = useState('')
    const [searchRes, setSearchRes] = useState('')

    const searchFunction = async () => {
        const user = localStorage.getItem("username")
        if (user) {
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
                }
              };
              const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}include_adult=false&language=en-US&page=1`
              try{
                const res = await fetch(url , options)
                const data = await res.json()
                setSearchRes(data)
                console.log(searchQuery,data)
              } catch (err) {
                console.log(err)
              }
          }
       
      }

    return (
        <div className="search-movie">
            <input className="search-input" type="text" value={searchQuery} onChange={(e)=>  setSearchQuery(e.target.value)} />
            <button onClick={()=> {searchFunction()}} className="search-btn" type="submit">Search</button>
        </div>
    )}

export default SearchMovie