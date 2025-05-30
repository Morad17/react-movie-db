import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMovieActions from "../hooks/useMovieActions";

import { TiStarFullOutline } from "react-icons/ti";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BiHeartCircle } from "react-icons/bi";
import { GiRoundStar } from "react-icons/gi";
import placeholder from "../assets/images/poster-placeholder.png";
import VoteIcon from "./VoteIcon";

const MovieCard = ({
  movie: {
    id,
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
  },
  genres,
  bLMovie,
  wMovie,
  watchedFilter,
  loggedUser,
}) => {
  const [userActions, setUserActions] = useState({
    bookmarked: null,
    liked: null,
    watched: null,
  });

  ///Bookmark and Like ///
  const { addToBookmarked, addToLiked, isDisabled } = useMovieActions();

  const checkMovieData = () => {
    bLMovie &&
      setUserActions((prev) => ({
        ...prev,
        bookmarked: bLMovie.bookmarked,
        liked: bLMovie.liked,
      }));
    wMovie &&
      setUserActions((prev) => ({
        ...prev,
        watched: wMovie.watched,
      }));
  };
  useEffect(() => {
    checkMovieData();
  }, [bLMovie, wMovie]);

  const displayGenres = () => {
    const genreNames = genre_ids
      ?.map((id) => {
        const genre = genres.find((gen) => gen.id === id);
        return genre ? genre.name : null;
      })
      .filter((name) => name !== null); // Filter out any null values
    return genreNames?.join(", "); // Join the genre names with a comma
  };

  //Render Based on WatchedFilter //
  if (!watchedFilter && userActions.watched) {
    return null;
  }

  return (
    <div className={`movie-card $userActions.watched ? "watched-card" : ""}`}>
      <div className="movie-content-card">
        {loggedUser && (
          <div className="movie-header">
            <div className="header-left">
              <BsBookmarkStarFill
                id="bookmarkIcon"
                className={`save-svg ${
                  userActions.bookmarked ? "bookmarked" : ""
                }`}
                onClick={() =>
                  !isDisabled &&
                  addToBookmarked({
                    id,
                    title,
                    username: loggedUser,
                    poster_path,
                    date: new Date().toISOString().slice(0, 10),
                    userActions,
                    setUserActions,
                  })
                }
              />
              <BiHeartCircle
                id="likeIcon"
                className={`heart-svg ${userActions.liked ? "liked" : ""}`}
                onClick={() =>
                  !isDisabled &&
                  addToLiked({
                    id,
                    title,
                    username: loggedUser,
                    poster_path,
                    date: new Date().toISOString().slice(0, 10),
                    userActions,
                    setUserActions,
                  })
                }
              />
            </div>
          </div>
        )}

        <Link to={`/moviePage/${id}`}>
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : placeholder
            }
            alt=""
            className="movie-image"
          />
        </Link>
        <div className="movie-rating">
          <VoteIcon vote={vote_average} />
        </div>
      </div>
      <div className="movie-footer">
        <div className="group-row">
          <h3 className="movie-title">{title}</h3>
        </div>
        <p className="year-release">{release_date?.slice(0, 4)}</p>
        <div className="genre-group">
          <p className="movie-genres">{displayGenres()}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
