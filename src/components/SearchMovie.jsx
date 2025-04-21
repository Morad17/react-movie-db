import React, { useEffect, useState } from 'react'


const SearchMovie = () => {

    useEffect(()=>{},[])

    const [searchQuery, setSearchQuery] = useState('')


    return (
        <div className="search-movie">
            <input className="search-input" type="text" value={searchQuery} onChange={()=> setSearchQuery()} />
            <button onClick={()=> {searchFunction()}} className="search-btn" type="submit">Search</button>
        </div>
    )}

export default SearchMovie