import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import placeholder from "../assets/images/poster-placeholder.png";
import { GiRoundStar } from "react-icons/gi";
import ReactCountryFlag from "react-country-flag";

import pgCertificate from "../assets/images/pg-certificate.png";
import twelveCertificate from "../assets/images/12a-certificate.png";
import fifteenCertificate from "../assets/images/15-certificate.png";

const MoviePage = () => {
  const [movieInfo, setMovieInfo] = useState();

  const params = useParams();
  const getMoveInfo = async () => {
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
      setMovieInfo(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMoveInfo();
  }, []);

  const ageRating = () => {
    const results = movieInfo?.release_dates?.results; // Safely access release_dates.results
    if (!results) return "N/A"; // Return 'N/A' if results are not available

    const gbRelease = results.find((release) => release.iso_3166_1 === "GB"); // Find the release for 'GB'
    if (!gbRelease) return "N/A"; // Return 'N/A' if no 'GB' release is found

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
      <div className="movie-section-left">{console.log(movieInfo)}</div>
      {movieInfo ? (
        <div className="movie-page-card">
          <section className="top-content">
            <div className="poster-image">
              <img
                src={
                  movieInfo.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`
                    : placeholder
                }
                alt=""
                className="poster-image"
              />
            </div>
            <div className="movie-page-info-section">
              <h2>
                {movieInfo.title} {movieInfo.release_date.slice(0, 4)}
                <ReactCountryFlag
                  countryCode={`${movieInfo.origin_country[0]}`}
                  svg
                />
              </h2>
              <p className="vote-number">
                <GiRoundStar />
                {movieInfo.vote_average?.toFixed(1)}
              </p>
              <div className="genre-section">
                {movieInfo.genres.map((g, key) => {
                  return (
                    <p className="movie-genre" key={key}>
                      {g.name}
                    </p>
                  );
                })}
              </div>
              <p className="age-rating">
                {ageRating()} <img src="" alt="" />
              </p>
              <div className="overview-section">
                <p className="overview">{movieInfo.overview}</p>
              </div>
            </div>
          </section>
          <div className="backdrop">
            <img
              src={
                movieInfo.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movieInfo.backdrop_path}`
                  : placeholder
              }
              alt=""
              className="backdrop-image"
            />
          </div>

          <div className="cast-section"></div>
          <div className="trailer-section"></div>
          <div className="reviews-section"></div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="movie-section-right"></div>
    </div>
  );
};

export default MoviePage;
