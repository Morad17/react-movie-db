import placeholder from "../assets/images/poster-placeholder.png";

const UserMovieCard = ({ movie: { movieName, poster_path } }) => {
  return (
    <div className="user-movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : placeholder
        }
        alt=""
        className="user-movie-image"
      />
      <div className="user-movie-footer">
        <h3 className="user-movie-title">{movieName}</h3>
      </div>
    </div>
  );
};

export default UserMovieCard;
