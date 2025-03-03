import React from 'react'

const MovieCard = ({
    movie:{
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
},genres}) => {

    const displayGenres = () => {
        console.log(genre_ids);
        const genreNames = genre_ids.map(id => {
            const genre = genres.find(gen => gen.id === id);
            return genre ? genre.name : null;
        }).filter(name => name !== null); // Filter out any null values
        return genreNames.join(', '); // Join the genre names with a comma
    };

  return (

    <div className="movie-card">
        <div className="movie-header">
            <p>{vote_average}</p>
        </div>
        <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="" className="movie-image" />
        <div className="movie-footer">
                <h3 className="movie-title">{title}</h3>
                <p className="movie-genres">{displayGenres()}</p>
                <div className="movie-links">
                    <a href=""className="movie-trailer">Watch Trailer</a>  
                </div>

        </div>
    </div>
    
  )
}

export default MovieCard