import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import ReactCountryFlag from "react-country-flag";
import useMovieActions from "../hooks/useMovieActions";

import { BsBookmarkStarFill } from "react-icons/bs";
import { GiRoundStar } from "react-icons/gi";
import { BiHeartCircle } from "react-icons/bi";
import placeholder from "../assets/images/poster-placeholder.png";
import pgCertificate from "../assets/images/pg-certificate.png";
import twelveCertificate from "../assets/images/12a-certificate.png";
import fifteenCertificate from "../assets/images/15-certificate.png";
import axios from "axios";

const MoviePage = () => {
  ///UseStates///
  const [selectedMovieInfo, setSelectedMovieInfo] = useState();
  const [movieTrailer, setMovieTrailer] = useState();
  const [userActions, setUserActions] = useState({
    bookmarkList: null,
    likedList: null,
    watched: null,
  });

  ///Bookmark and Like ///
  const { addToBookmarkList, addToLikedList, isDisabled } = useMovieActions();

  const username = localStorage.getItem("username");
  const params = useParams();

  ///Find If User Bookmarked or Liked Movie
  const getUserMovieData = async () => {
    const { id } = params;
    if (username) {
      try {
        const res = await axios.post("http://localhost:3070/getUserTable", {
          username: username,
        });
        const movieInfo = res.data.find((movie) => movie.movieId == id);
        movieInfo &&
          setUserActions({
            bookmarkList: movieInfo.bookmarkList,
            likedList: movieInfo.likedList,
            watched: movieInfo.watched,
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  // Selected Movie Info
  const getSelectedMoveInfo = async () => {
    const { id } = params;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=release_dates`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`,
      },
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setSelectedMovieInfo(data);
    } catch (err) {
      console.log(err);
    }
  };

  //Get Trailer
  const getTrailer = async () => {
    const { id } = params;
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`,
      },
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      const trailer = data.results.find((movie) => movie.type == "Trailer");
      console.log(trailer);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserMovieData();
  }, []);

  useEffect(() => {
    getSelectedMoveInfo();
  }, []);

  useEffect(() => {
    getTrailer();
  });

  // Finds Age Rating and returns correct certificate //
  const ageRating = () => {
    const results = selectedMovieInfo?.release_dates?.results; // Safely access release_dates.results
    if (!results) return "N/A"; // Return 'N/A' if results are not available

    const gbRelease = results.find((release) => release.iso_3166_1 === "GB"); // Find the release for 'GB'
    if (!gbRelease) return ""; // Return 'N/A' if no 'GB' release is found

    const certification = gbRelease.release_dates?.[0]?.certification; // Get the certification
    switch (certification) {
      case "PG":
        return <img className="certification" src={pgCertificate} alt="" />;
      case "12A":
        return <img className="certification" src={twelveCertificate} alt="" />;
      case "15":
        return (
          <img className="certification" src={fifteenCertificate} alt="" />
        );
      default:
        break;
    }
  };

  return (
    <div className="movie-page-section">
      <div className="movie-section-left">{console.log(selectedMovieInfo)}</div>
      {selectedMovieInfo ? (
        <div className="movie-section-center">
          <section
            className="movie-page-card"
            style={{
              "--movie-bg-image": `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${selectedMovieInfo.backdrop_path})`,
            }}
          >
            <div className="backdrop-wrapper"></div>
            <div className="top-content">
              <div className="poster-image-div">
                <img
                  src={
                    selectedMovieInfo?.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${selectedMovieInfo.poster_path}`
                      : placeholder
                  }
                  alt=""
                  className="poster-image"
                />
              </div>
              <div className="movie-page-info-section">
                <h2 className="movie-info-title">
                  {selectedMovieInfo.title} (
                  {selectedMovieInfo.release_date.slice(0, 4)})
                  <ReactCountryFlag
                    countryCode={`${selectedMovieInfo.origin_country[0]}`}
                    svg
                    className="react-flag-icon"
                  />
                </h2>
                <div className="info-icons-row">
                  {selectedMovieInfo.genres.map((g, key) => {
                    return (
                      <p className="movie-genre" key={key}>
                        {g.name}
                      </p>
                    );
                  })}
                  <p className="age-rating">{ageRating()}</p>

                  <p className="vote-number">
                    <GiRoundStar />
                    {selectedMovieInfo.vote_average?.toFixed(1)}
                  </p>
                </div>
                <div className="action-icons-row">
                  <BsBookmarkStarFill
                    id="bookmarkIcon"
                    className={`save-svg ${
                      userActions.bookmarkList ? "bookmarked" : ""
                    }`}
                    onClick={() =>
                      !isDisabled &&
                      addToBookmarkList({
                        id: selectedMovieInfo.id,
                        title: selectedMovieInfo.title,
                        username: username,
                        poster_path: selectedMovieInfo.poster_path,
                        userActions,
                        setUserActions,
                      })
                    }
                  />
                  <BiHeartCircle
                    id="likeIcon"
                    className={`heart-svg ${
                      userActions.likedList ? "liked" : ""
                    }`}
                    onClick={() =>
                      !isDisabled &&
                      addToLikedList({
                        id: selectedMovieInfo.id,
                        title: selectedMovieInfo.title,
                        username: username,
                        poster_path: selectedMovieInfo.poster_path,
                        userActions: userActions,
                        setUserActions: setUserActions,
                      })
                    }
                  />
                </div>
                <div className="overview-section">
                  <h3 className="section-title">Overview</h3>
                  <p className="overview-text">{selectedMovieInfo.overview}</p>
                </div>
              </div>
            </div>

            <div className="cast-section"></div>
            <div className="trailer-section"></div>
            <div className="reviews-section"></div>
          </section>
          <section className="movie-page-content">
            <div className="trailer-section">
              <h3 className="section-title">Trailer</h3>
            </div>
            <div className="cast-section">
              <h3 className="section-title">Top Cast</h3>
            </div>
            <div className="reviews-ratings-section">
              <h3 className="section-title">Reviews & Ratings</h3>
            </div>
          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="movie-section-right"></div>
    </div>
  );
};

export default MoviePage;
