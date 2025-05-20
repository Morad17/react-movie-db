import React, { useEffect, useState } from "react";
import { Link } from "react-router";
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
  userData,
  watchedFilter,
}) => {
  const [userActions, setUserActions] = useState({
    bookmarkList: null,
    likedList: null,
    watched: null,
  });

  ///Bookmark and Like ///
  const { addToBookmarkList, addToLikedList, isDisabled } = useMovieActions();

  const username = localStorage.getItem("username");

  const checkMovieData = () => {
    userData &&
      setUserActions({
        bookmarkList: userData.bookmarkList,
        likedList: userData.likedList,
        watched: userData.watched,
      });
  };
  useEffect(() => {
    checkMovieData();
  }, []);

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
    <div className={`movie-card $userActionso.watched ? "watched-card" : ""}`}>
      <div className="movie-content">
        <div className="movie-header">
          <div className="header-left">
            <BsBookmarkStarFill
              id="bookmarkIcon"
              className={`save-svg ${
                userActions.bookmarkList ? "bookmarked" : ""
              }`}
              onClick={() =>
                !isDisabled &&
                addToBookmarkList({
                  id,
                  title,
                  username,
                  poster_path,
                  userActions,
                  setUserActions,
                })
              }
            />
            <BiHeartCircle
              id="likeIcon"
              className={`heart-svg ${userActions.likedList ? "liked" : ""}`}
              onClick={() =>
                !isDisabled &&
                addToLikedList({
                  id,
                  title,
                  username,
                  poster_path,
                  userActions,
                  setUserActions,
                })
              }
            />
          </div>
        </div>
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
      </div>
      <div className="movie-footer">
        <div className="group-row">
          <h3 className="movie-title">{title}</h3>
          <div className="vote-group">
            <VoteIcon vote={vote_average} />
          </div>
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
