
const UserMovieCard = ({
  movie:{movieName,poster_path}}) => {

  return (

    <div className="user-movie-card">
        <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt="" className="user-movie-image" />
        <div className="user-movie-footer">
            <h3 className="user-movie-title">{movieName}</h3>
        </div>
    </div>
    
  )
}

export default UserMovieCard