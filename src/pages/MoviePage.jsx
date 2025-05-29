import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Rating } from "react-simple-star-rating";
import useMovieActions from "../hooks/useMovieActions";
import ReactCountryFlag from "react-country-flag";
//Css
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
//Icons
import { BsBookmarkStarFill } from "react-icons/bs";
import { GiRoundStar } from "react-icons/gi";
import { BiHeartCircle } from "react-icons/bi";
import { PiNotePencilLight } from "react-icons/pi";
import { TbCheckbox } from "react-icons/tb";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { MdTv } from "react-icons/md";
import VoteIcon from "../components/VoteIcon";
//Files
import placeholder from "../assets/images/poster-placeholder.png";
import ProfileImage from "../assets/images/profile-image-placeholder.png";
import pgCertificate from "../assets/images/pg-certificate.png";
import twelveCertificate from "../assets/images/12a-certificate.png";
import fifteenCertificate from "../assets/images/15-certificate.png";
import { IoIosHelpCircle } from "react-icons/io";

const MoviePage = () => {
  ///UseStates///
  const [selectedMovieInfo, setSelectedMovieInfo] = useState();
  const [movieTrailer, setMovieTrailer] = useState();
  const [cast, setCast] = useState();
  const [userActions, setUserActions] = useState({
    bookmarked: null,
    liked: null,
    watched: false,
    rated: false,
    reviewed: null,
    rating: false,
    review: null,
  });
  const [metrics, setMetrics] = useState({
    totalBookmarked: 0,
    totalLiked: 0,
    totalRated: 0,
    totalReviewed: 0,
    totalWatched: 0,
  });
  const [loggedUser, setLoggedUser] = useState(null);
  const [allReviews, setAllReviews] = useState();
  const [createReview, setCreateReview] = useState(false);
  const [averageRating, setAverageRating] = useState();
  const [helpClicked, setHelpClicked] = useState(false);
  ///Bookmark and Like ///
  const {
    addToBookmarked,
    addToLiked,
    addToWatched,
    createRatingReview,
    isDisabled,
  } = useMovieActions();
  const params = useParams();
  const profileImage = localStorage.getItem("profileImage");

  //Chcked Is Users Logged in
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setLoggedUser(username);
  }, [loggedUser]);
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
      const trailerObj = ytVideos?.find((movie) => movie.type === "Trailer");
      if (trailerObj && trailerObj.key) {
        setMovieTrailer(`https://www.youtube.com/embed/${trailerObj.key}`);
      }
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

  ////Get user Actions details///
  const getUserRR = async () => {
    const { id } = params;
    try {
      const res = await axios.get(
        `http://localhost:3070/getUserRatingReview?movieId=${id}&username=${loggedUser}`
      );
      // Set users Review
      const data = res.data && Array.isArray(res.data) ? res.data[0] : null;
      setUserActions((prev) => ({
        ...prev,
        rating: data && data.rating,
        review: data && data.review,
        rated: data && typeof data.rating === "number" && data.rating,
        reviewed: data && typeof data.review === "string" && data.review,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  //user bookmark & like
  const getUserBookmarkLiked = async () => {
    const { id } = params;
    try {
      const res = await axios.get(
        `http://localhost:3070/getUserBookmarkLiked?movieId=${id}&username=${loggedUser}`
      );
      // Set users Review
      const data = res.data && Array.isArray(res.data) ? res.data[0] : null;
      console.log(data);
      setUserActions((prev) => ({
        ...prev,
        bookmarked:
          data && typeof data.bookmarked === "number" ? data.bookmarked : null,
        liked: data && typeof data.liked === "number" ? data.liked : null,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  //user watched
  const getUserWatched = async () => {
    const { id } = params;
    try {
      const res = await axios.get(
        `http://localhost:3070/getUserWatched?movieId=${id}&username=${loggedUser}`
      );
      // Set users Review
      const data = res.data && Array.isArray(res.data) ? res.data[0] : null;
      setUserActions((prev) => ({
        ...prev,
        watched:
          data && typeof data.watched === "number" ? data?.watched : null,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  /////Get Metrics
  const getAllRR = async () => {
    const { id } = params;
    try {
      const res = await axios.get(
        `http://localhost:3070/getAllRatingReviews?movieId=${id}`
      );
      const data = res.data;
      //Set All Movie Reviews
      setAllReviews(data.review.all);
      setAverageRating(data.averageRating);
      setMetrics((prev) => ({
        ...prev,
        rated: data.rating,
        reviewed: data.review.total,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalBookmarkedLiked = async () => {
    const { id } = params;
    try {
      const res = await axios.get(
        `http://localhost:3070/getBookmarkedLikedTotalMovie?movieId=${id}`
      );
      setMetrics((prev) => ({
        ...prev,
        bookmarked: res.data.totalBookmarked,
        liked: res.data.totalLiked,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  const getTotalWatched = async () => {
    const { id } = params;
    try {
      const res = await axios.get(
        `http://localhost:3070/getWatchedTotalMovie?movieId=${id}`
      );
      setMetrics((prev) => ({
        ...prev,
        watched: res.data.totalWatched,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (loggedUser) {
      getUserRR();
      getUserBookmarkLiked();
      getUserWatched();
    }
  }, [loggedUser]);

  useEffect(() => {
    getSelectedMoveInfo();
  }, []);

  useEffect(() => {
    getTrailer();
  }, []);
  useEffect(() => {
    getAllRR();
  }, [userActions.rating]);

  useEffect(() => {
    getCast();
  }, []);

  useEffect(() => {
    getTotalBookmarkedLiked();
  }, [userActions.bookmarked, userActions.liked]);

  useEffect(() => {
    getTotalWatched();
  }, [userActions.watched]);
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
    } else return "$" + selectedMovieInfo.budget.toLocaleString();
  };
  const revenue = () => {
    if (selectedMovieInfo.revenue === 0) {
      return "N/A";
    } else return "$" + selectedMovieInfo.revenue.toLocaleString();
  };

  //Handle Ratig and Review Submissiion//

  const handleRR = async (e) => {
    const { id } = params;
    e.preventDefault();
    const { title, poster_path } = selectedMovieInfo;
    const { rating, review } = userActions;
    if (userActions.rating) {
      const res = await createRatingReview({
        id,
        username: loggedUser,
        profileImage,
        title,
        rating,
        review,
        poster_path,
        date: new Date().toISOString().slice(0, 10),
      });
      if (res && res.success) {
        setUserActions((prev) => ({
          ...prev,
          rated: true,
          rating,
          review,
        }));
        setCreateReview(false);
      }
    } else {
      toast("Please add your Rating /10");
    }
  };

  return (
    <div className="movie-page-section">
      {/*-------------Left Hand Quick Actions-----------*/}
      <div className="movie-section-left">
        <div className="help-section">
          <div
            className={`help-btn ${helpClicked && "btn-active"}`}
            onClick={() => setHelpClicked(!helpClicked)}
          >
            <IoIosHelpCircle />
            Help
          </div>
        </div>

        {helpClicked && (
          <div className="info-div">
            <h3 className="info-div-title">Get Started</h3>
            <p className="info-div-text">Click on the movie for more info </p>
            <p className="info-div-text">
              <strong>You Must Be Logged In to Perform User Actions</strong>
            </p>
            <p className="info-div-text">
              <BsBookmarkStarFill
                style={{ fontSize: "1.3em", color: "gold" }}
              />{" "}
              Click The Bookmark Icon to add movie to bookmark list. Click again
              to remove from list
            </p>
            <p className="info-div-text">
              <BiHeartCircle style={{ fontSize: "1.5em", color: "gold" }} />
              Click the Like icon to add movie to liked list. Click again to
              remove.
            </p>
            <p className="info-div-text">
              If You have watched the film, tick the CheckBox.
            </p>
            <div className="info-div-text">
              If Rated ,a Rated Button will appear at the top. You can only rate
              once.
            </div>
            <div className="info-div-text">
              If not Rated, a Rate and Review Button will appear and you can
              rate and review movie. Reviews are Optional.
            </div>
          </div>
        )}
        {loggedUser && (
          <div className="logged-user-actions">
            <div
              className={`quick-action-bookmark quick-action-btn ${
                userActions.bookmarked ? "btn-active" : ""
              }`}
              onClick={() =>
                !isDisabled &&
                addToBookmarked({
                  id: selectedMovieInfo.id,
                  title: selectedMovieInfo.title,
                  username: loggedUser,
                  poster_path: selectedMovieInfo.poster_path,
                  date: new Date().toISOString().slice(0, 10),
                  userActions,
                  setUserActions,
                })
              }
            >
              <BsBookmarkStarFill id="bookmarkIcon" />
              {userActions.bookmarked ? "Bookmarked" : "Bookmark"}
            </div>
            <div
              className={`quick-action-like quick-action-btn ${
                userActions.liked ? "btn-active" : ""
              }`}
              onClick={() =>
                !isDisabled &&
                addToLiked({
                  id: selectedMovieInfo.id,
                  title: selectedMovieInfo.title,
                  username: loggedUser,
                  poster_path: selectedMovieInfo.poster_path,
                  date: new Date().toISOString().slice(0, 10),
                  userActions,
                  setUserActions,
                })
              }
            >
              <BiHeartCircle id="likeIcon" />
              {userActions.liked ? "Liked" : "Like"}
            </div>
            <div
              className={`quick-action-watched quick-action-btn ${
                userActions.watched ? "btn-active" : ""
              }`}
              onClick={() =>
                !isDisabled &&
                addToWatched({
                  id: selectedMovieInfo.id,
                  title: selectedMovieInfo.title,
                  username: loggedUser,
                  poster_path: selectedMovieInfo.poster_path,
                  date: new Date().toISOString().slice(0, 10),
                  userActions,
                  setUserActions,
                })
              }
            >
              <MdTv id="watchedIcon" />
              {userActions.watched ? "Watched" : "Mark As Watched"}
            </div>
            {userActions.rated ? (
              <div className="quick-action-rated ">
                <PiNotePencilLight />
                Rated
              </div>
            ) : (
              <div
                className={`quick-action-rate-review quick-action-btn ${
                  userActions.rated ? "btn-active" : ""
                }`}
                onClick={() => {
                  setCreateReview(!createReview);
                }}
              >
                <PiNotePencilLight />
                Rate & Review
              </div>
            )}
            {createReview && (
              <div className="create-review">
                <form onSubmit={handleRR}>
                  <div className="rating-group">
                    <p className="group-label">Rating /10</p>
                    <hr />
                    <Rating
                      onClick={(e) => {
                        setUserActions((prev) => ({
                          ...prev,
                          rating: e * 2,
                        }));
                      }}
                      initialValue={userActions.rating || 0}
                      allowFraction={true}
                      tooltipArray={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      showTooltip
                      size={30}
                      tooltipDefaultText="0/10"
                    />
                  </div>
                  <div className="review-group">
                    <p className="group-label">(Optional) Leave A Review</p>
                    <hr />
                    <textarea
                      className="review-textarea"
                      name="review"
                      minLength="4"
                      value={userActions.review || ""}
                      onChange={(e) =>
                        setUserActions((prev) => ({
                          ...prev,
                          review: e.target.value,
                        }))
                      }
                    ></textarea>
                  </div>

                  <button className="submit-btn" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      {/*-------------Movie Banner, Quick Info & Actions----------*/}
      {selectedMovieInfo ? (
        <div className="movie-section-center">
          <section
            className="movie-page-card"
            style={{
              "--movie-bg-image": `url(http://image.tmdb.org/t/p/w1920_and_h800_multi_faces${selectedMovieInfo.backdrop_path})`,
            }}
          >
            <div className="backdrop-wrapper"></div>
            <div className="top-content">
              <div className="poster-image-div">
                <img
                  src={
                    selectedMovieInfo?.poster_path
                      ? `http://image.tmdb.org/t/p/w500${selectedMovieInfo.poster_path}`
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
                {loggedUser && (
                  <div className="action-icons-row">
                    <VoteIcon vote={selectedMovieInfo.vote_average} />
                    <BsBookmarkStarFill
                      id="bookmarkIcon"
                      className={`save-svg ${
                        userActions.bookmarked ? "bookmarked" : ""
                      }`}
                      onClick={() =>
                        !isDisabled &&
                        addToBookmarked({
                          id: selectedMovieInfo.id,
                          title: selectedMovieInfo.title,
                          username: loggedUser,
                          poster_path: selectedMovieInfo.poster_path,
                          date: new Date().toISOString().slice(0, 10),
                          userActions,
                          setUserActions,
                        })
                      }
                    />
                    <BiHeartCircle
                      id="likeIcon"
                      className={`heart-svg ${
                        userActions.liked ? "liked" : ""
                      }`}
                      onClick={() =>
                        !isDisabled &&
                        addToLiked({
                          id: selectedMovieInfo.id,
                          title: selectedMovieInfo.title,
                          username: loggedUser,
                          poster_path: selectedMovieInfo.poster_path,
                          date: new Date().toISOString().slice(0, 10),
                          userActions,
                          setUserActions,
                        })
                      }
                    />

                    <div
                      className="watched-action pointer"
                      style={
                        userActions.watched
                          ? { backgroundColor: "#501218" }
                          : { backgroundColor: "gray" }
                      }
                      onClick={() =>
                        !isDisabled &&
                        addToWatched({
                          id: selectedMovieInfo.id,
                          title: selectedMovieInfo.title,
                          username: loggedUser,
                          date: new Date().toISOString().slice(0, 10),
                          userActions,
                          setUserActions,
                        })
                      }
                    >
                      {userActions.watched ? (
                        <div className="watched-svg pointer">
                          <TbCheckbox />
                        </div>
                      ) : (
                        <div className="watched-svg pointer">
                          <MdOutlineCheckBoxOutlineBlank />
                        </div>
                      )}

                      <p className="watched-btn pointer">
                        {userActions.watched ? "Watched" : "Mark As Watched"}
                      </p>
                    </div>
                    {userActions.rated ? (
                      <div
                        className="rate-and-review-action"
                        style={{ background: "#501218" }}
                      >
                        <p className="rate-and-review-label">Rated</p>
                      </div>
                    ) : (
                      <div className="rate-and-review-action pointer">
                        <div className="rate-svg">
                          <PiNotePencilLight />
                        </div>
                        <p
                          className="rr-btn pointer"
                          onClick={() => setCreateReview(!createReview)}
                        >
                          Rate & Review
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="overview-section">
                  <h3 className="section-title">Overview</h3>
                  <p className="overview-text">{selectedMovieInfo.overview}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="metrics-section">
            <div className="bookmark-metric">
              <BsBookmarkStarFill />
              <p>Total Bookmarked: {metrics?.totalBookmarked}</p>
            </div>
            <div className="like-metric">
              <BiHeartCircle />
              <p>Total Liked: {metrics?.totalLiked}</p>
            </div>
            <div className="watched-metric">
              <MdTv />
              <p>Total Watched: {metrics?.totalWatched}</p>
            </div>
            <div className="rated-metric">
              <PiNotePencilLight />
              <p>Total Ratings:{metrics?.totalRated}</p>
            </div>
            <div className="rated-metric">
              <PiNotePencilLight />
              <p>Total Reviews:{metrics?.totalReviewed}</p>
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
                                ? `http://media.themoviedb.org/t/p/w138_and_h175_face${cast.profile_path}`
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
                <section className="all-rating-reviews">
                  <div className="my-rating-review">
                    {userActions.rated ? (
                      <div className="">{userActions.rating}</div>
                    ) : (
                      <div className="">
                        <h3>You Havent Rated This Movie Yet</h3>
                        <div
                          id="create-rating-review"
                          className="create-rating-review"
                        ></div>
                      </div>
                    )}
                  </div>
                  <div className="user-rating-reviews">
                    <div className="rating">
                      {averageRating ? (
                        <h3>Average Score:{averageRating}</h3>
                      ) : (
                        <h3>This Movie hasn't been Rated yet</h3>
                      )}
                    </div>
                  </div>
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
                <p className="section-text-right">{budget()}</p>
                <h3 className="section-title-right">Revenue</h3>
                <p className="section-text-right">{revenue()}</p>
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
