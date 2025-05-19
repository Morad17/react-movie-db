import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

import ReactCountryFlag from "react-country-flag";
import useMovieActions from "../hooks/useMovieActions";

import { BsBookmarkStarFill } from "react-icons/bs";
import { GiRoundStar } from "react-icons/gi";
import { BiHeartCircle } from "react-icons/bi";

import placeholder from "../assets/images/poster-placeholder.png";
import ProfileImage from "../assets/images/profile-image-placeholder.png";
import pgCertificate from "../assets/images/pg-certificate.png";
import twelveCertificate from "../assets/images/12a-certificate.png";
import fifteenCertificate from "../assets/images/15-certificate.png";
import VoteIcon from "../components/VoteIcon";

const MoviePage = () => {
  ///UseStates///
  const [selectedMovieInfo, setSelectedMovieInfo] = useState();
  const [movieTrailer, setMovieTrailer] = useState();
  const [cast, setCast] = useState();
  const [userActions, setUserActions] = useState({
    bookmarkList: null,
    likedList: null,
    watched: false,
    rated: false,
    reviewed: null,
    rating: false,
    review: null,
  });

  ///Bookmark and Like ///
  const {
    addToBookmarkList,
    addToLikedList,
    addToWatched,
    createRating,
    createReview,
    isDisabled,
  } = useMovieActions();

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
            review: movieInfo.review,
            rating: movieInfo.rating,
            rated:
              movieInfo.rating && movieInfo.rating.length > 1 ? true : false,
            reviewed:
              movieInfo.review && movieInfo.review.length > 1 ? true : false,
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
      const ytVideos = data.results.filter((video) => video.site === "YouTube");
      const trailer = ytVideos.find((movie) => movie.type == "Trailer").key;
      setMovieTrailer(`https://www.youtube.com/embed/${trailer}`);
    } catch (err) {
      console.log(err);
    }
  };

  //Get Cast
  const getCast = async () => {
    const { id } = params;
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
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
      setCast(data.cast);
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

  useEffect(() => {
    getCast();
  }, []);
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

  const budget = () => {
    if (selectedMovieInfo.budget === 0) {
      return "N/A";
    } else return selectedMovieInfo.budget.toLocaleString();
  };
  const revenue = () => {
    if (selectedMovieInfo.revenue === 0) {
      return "N/A";
    } else return selectedMovieInfo.revenue.toLocaleString();
  };

  //Handle Ratig and Review Submissiion//

  const handleRR = (e) => {
    e.preventDefault();
    console.log(userActions);
    if (userActions.rating && userActions.review) {
      createRating({
        id: selectedMovieInfo.id,
        username,
        userProfileImage:
          "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png",
        title: selectedMovieInfo.title,
        rating: userActions.rating,
        poster_path: selectedMovieInfo.poster_path,
        userActions,
        setUserActions,
      });
      createReview({
        id: selectedMovieInfo.id,
        username,
        userProfileImage:
          "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png",
        title: selectedMovieInfo.title,
        review: userActions.review,
        poster_path: selectedMovieInfo.poster_path,
        userActions: userActions,
        setUserActions: setUserActions,
      });
    } else if (userActions.rating && !userActions.review) {
      createRating({
        id: selectedMovieInfo.id,
        username,
        userProfileImage:
          "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png",
        title: selectedMovieInfo.title,
        poster_path: selectedMovieInfo.poster_path,
        rating: userActions.rating,
        userActions,
        setUserActions,
      });
    } else {
      toast("Please fully fill in the form");
    }
  };

  return (
    <div className="movie-page-section">
      <div className="movie-section-left"></div>
      {selectedMovieInfo ? (
        <div className="movie-section-center">
          <section
            className="movie-page-card"
            style={{
              "--movie-bg-image": `url(http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${selectedMovieInfo.backdrop_path})`,
            }}
          >
            <div className="backdrop-wrapper"></div>
            <div className="top-content">
              <div className="poster-image-div">
                <img
                  src={
                    selectedMovieInfo?.poster_path
                      ? `http://image.tmdb.org/t/p/w500/${selectedMovieInfo.poster_path}`
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
                </div>
                <div className="action-icons-row">
                  <VoteIcon vote={selectedMovieInfo.vote_average} />
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
                        username,
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
                        username,
                        poster_path: selectedMovieInfo.poster_path,
                        userActions,
                        setUserActions,
                      })
                    }
                  />
                  <div className="watched-action">
                    <label className="watched-action-label">Watched</label>
                    <input
                      type="checkbox"
                      className="watched-checkbox"
                      checked={userActions.watched}
                      onChange={() =>
                        !isDisabled &&
                        addToWatched({
                          id: selectedMovieInfo.id,
                          title: selectedMovieInfo.title,
                          username,
                          poster_path: selectedMovieInfo.poster_path,
                          userActions,
                          setUserActions,
                        })
                      }
                    />
                  </div>
                  <div className="rate-and-review">
                    <a href="" className="rr-btn">
                      Rate & Review
                    </a>
                  </div>
                </div>
                <div className="overview-section">
                  <h3 className="section-title">Overview</h3>
                  <p className="overview-text">{selectedMovieInfo.overview}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="movie-page-content">
            <div className="left-content">
              {movieTrailer && (
                <div className="trailer-section">
                  <h3 className="section-title">Trailer</h3>
                  <div className="trailer-video-div">
                    <iframe
                      className="trailer-video"
                      src={movieTrailer}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video"
                      width="560"
                      height="315"
                    />
                  </div>
                </div>
              )}
              <div className="cast-section">
                <h3 className="section-title">Top Cast</h3>
                {cast && (
                  <div className="cast-group">
                    {cast.slice(0, 10).map((cast, key) => {
                      return (
                        <div className="cast-card" key={key}>
                          <img
                            className="cast-card-img"
                            src={
                              cast.profile_path
                                ? `http://media.themoviedb.org/t/p/w138_and_h175_face/${cast.profile_path}`
                                : placeholder
                            }
                            alt=""
                          />
                          <div className="cast-card-text">
                            <h4 className="cast-name-text">{cast.name}</h4>
                            <p className="cast-character-text">
                              {cast.character}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="reviews-ratings-section">
                <h3 className="section-title">Ratings & Reviews</h3>
                <section className="all-rating-reviews"></section>
                <section className="create-rating-reviews">
                  <form onSubmit={handleRR}>
                    <div className="rating-group">
                      <label>Rating /100</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={userActions.rating || ""}
                        onChange={(e) =>
                          setUserActions((prev) => ({
                            ...prev,
                            rating: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="review-group">
                      <label>(Optional) Leave A Review</label>
                      <textarea
                        name="review"
                        minLength="4"
                        maxLength="500"
                        value={userActions.review || ""}
                        onChange={(e) =>
                          setUserActions((prev) => ({
                            ...prev,
                            review: e.target.value,
                          }))
                        }
                      ></textarea>
                    </div>

                    <button type="submit">Submit</button>
                  </form>
                </section>
              </div>
            </div>
            <div className="right-content">
              <div className="movie-facts">
                <hr className="content-hr" />
                <h3 className="section-title-right">Status</h3>
                <p className="section-text-right">{selectedMovieInfo.status}</p>
                <h3 className="section-title-right">Release Date</h3>
                <p className="section-text-right">
                  {new Date(selectedMovieInfo.release_date).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
                <h3 className="section-title-right">Budget</h3>
                <p className="section-text-right">${budget()}</p>
                <h3 className="section-title-right">Revenue</h3>
                <p className="section-text-right">${revenue()}</p>
                <h3 className="section-title-right">Runtime</h3>
                <p className="section-text-right">
                  {selectedMovieInfo.runtime} Minutes
                </p>
                <h3 className="section-title-right">Spoken Language</h3>
                {selectedMovieInfo.spoken_languages?.map((movie, key) => {
                  return (
                    <p className="section-text-right" key={key}>
                      {movie.english_name}
                    </p>
                  );
                })}
                <hr className="content-hr" />
              </div>
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
