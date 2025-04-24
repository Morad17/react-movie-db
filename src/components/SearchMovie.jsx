import React, { useEffect, useState } from 'react'


const SearchMovie = ({movieSearch}) => {

    useEffect(()=>{},[])

    const [searchQuery, setSearchQuery] = useState('')
    const [searchRes, setSearchRes] = useState('')

    const handleSearch = () => {
      movieSearch(searchQuery); // Send the search query to MovieLibrary
    };

    return (
        <div className="search-movie">
            <input className="search-input"placeholder="Search A Movie" type="text" value={searchQuery} onChange={(e)=>  setSearchQuery(e.target.value)} />
            <button onClick={handleSearch} className="search-btn" type="submit">Search</button>
        </div>
    )}

export default SearchMovie