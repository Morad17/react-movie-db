import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";

import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import SearchMovie from "../components/SearchMovie";
import GenreColors from "../components/GenreColors";

import { IoIosHelpCircle } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BiHeartCircle } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Banner from "../assets/images/curtain-background.png";
import LogoSvg from "../components/LogoSvg";
const MobileMovieLibrary = () => {
  ////Use States////
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userMovieData, setUserMovieData] = useState([]);
  // Search Sort & Filter //
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popularity.desc");
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [sorting, setSorting] = useState(false);
  const [filtersBtn, setFiltersBtn] = useState(false);
  const [filtersUsed, setFiltersUsed] = useState(false);
  const [allFilters, setAllFilters] = useState({
    year: "",
    cast: "",
    genres: [],
  });
  const [genreSearch, setGenreSearch] = useState("");
  const [watchedFilter, setWatchedFilter] = useState(true);
  //DatePicker
  const [yearSearch, setYearSearch] = useState();
  const [yearChecked, SetYearChecked] = useState(false);
  const [castSearch, setCastSearch] = useState();
  //Help
  const [helpClicked, setHelpClicked] = useState(false);
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  // Get All Movies//
  const fetchMovies = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`,
      },
    };
    const url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${currentPage}`
      : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&primary_release_year=${allFilters.year}&sort_by=${sortOption}&with_genres=${allFilters.genres}`;
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      if (searchQuery) {
        toast(
          `Your Search For ${searchQuery} returned ${data.total_pages} Pages from ${data.total_results} results`,
          { position: "top-center", autoClose: 5000, hideProgressBar: false }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, [searchQuery, currentPage, sortOption, filterTrigger, watchedFilter]);

  // Get Genre Name from Genre Id //
  const fetchGenres = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`,
      },
    };
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setGenres(data.genres);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchGenres();
  }, []);

  // Get User Liked and Bookmarked data //
  const getUserMovieData = async () => {
    const user = localStorage.getItem("username");
    if (user) {
      try {
        const res = await axios.post("http://localhost:3070/getUserTable", {
          username: user,
        });
        setUserMovieData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    getUserMovieData();
  }, []);

  const paginate = (number) => setCurrentPage(number);
  const handleMovieSearch = (query) => {
    setSearchQuery(query); // Update the search query
    setCurrentPage(1); // Reset to the first page
  };
  const genreFilterHandler = (id) => {
    setAllFilters((prev) => {
      const updatedGenres = prev.genres.includes(id)
        ? prev.genres.filter((genreId) => genreId !== id)
        : [...prev.genres, id];
      return { ...prev, genres: updatedGenres };
    });
  };

  const filterSearch = () => {
    if (allFilters.year || allFilters.cast || allFilters.genres) {
      setFilterTrigger((prev) => prev + 1);
    }
  };

  ///Style Components for Select ///
  const selectOptions = [
    { label: "Popularity Descending", value: "popularity.desc" },
    { label: "Popularity Ascending", value: "popularity.asc" },
    { label: "Vote Average Descending", value: "vote_average.desc" },
    { label: "Vote Average Ascending", value: "vote_average.asc" },
    { label: "Release Data Descending", value: "release_date.desc" },
    { label: "Release Date Ascending", value: "releas_-date.asc" },
    { label: "Title (A-Z)", value: "title.desc" },
    { label: "Title (Z -A)", value: "title.asc" },
  ];
  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#c3c3c3",
      margin: "0",
      cursor: "pointer",
      borderColor: state.isFocused ? "#12504A" : baseStyles.borderColor,
      boxShadow: state.isFocused ? "none" : "none",
      "&:hover": {
        borderColor: "#12504A",
      },
      outlineColor: state.isFocused && "#12504A",
      "&:hover": { backgroundColor: "12504A" },
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? "#12504A" : "#c3c3c3",
      "&:hover": { backgroundColor: "12504A" },
      cursor: "pointer",
      color: "black",
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#c3c3c3",
      color: "black",
      zIndex: 5,
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: "black",
    }),
  };

  return (
    <div className="movie-library">
      <section className="movie-library-header">
        <div className="movie-header-left">
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
                <BsBookmarkStarFill
                  style={{ fontSize: "1.3em", color: "gold" }}
                />{" "}
                Click The Bookmark Icon to add movie to bookmark list. Click
                again to remove from list
              </p>
              <p className="info-div-text">
                <BiHeartCircle style={{ fontSize: "1.5em", color: "gold" }} />
                Click the Like icon to add movie to liked list. Click again to
                remove.
              </p>
              <p className="info-div-text">
                Watched Films will appear as grayed out.
              </p>
            </div>
          )}
        </div>
        <div className="movie-header-center">
          <div
            className="banner"
            style={{ "--movie-banner": `url(${Banner})` }}
          >
            <LogoSvg />
            <h2 className="banner-title">All Movies</h2>
          </div>

          <div className="search-div">
            <SearchMovie movieSearch={handleMovieSearch} />
          </div>
        </div>
        <div className="movie-header-right"></div>
      </section>
      <section className="movie-library-content">
        {/*-------------Filters---------*/}
        <div className="movie-content-left">
          <p
            onClick={() => setFiltersBtn(!filtersBtn)}
            className={`filter-btn ${filtersBtn && "btn-active"}`}
          >
            Filter
          </p>
          {filtersBtn && (
            <div className="filters-function">
              <div className="genre-filter">
                <p className="filter-title"> Genre:</p>
                <div className="all-genres">
                  {genres.map((g, key) => {
                    const isSelected = allFilters.genres.includes(g.id);
                    return (
                      <p
                        className={`movie-genre ${
                          isSelected ? "selectedGenre" : ""
                        }`}
                        onClick={() => genreFilterHandler(g.id)}
                        key={key}
                      >
                        {g.name}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="year-filter">
                <p className="filter-title"> Year:</p>
                <div className="year-picker">
                  <DatePicker
                    placeholderText="yyyy"
                    selected={yearSearch}
                    onChange={(date) => {
                      setYearSearch(date);
                      setAllFilters((prev) => ({
                        ...prev,
                        year: date ? date.getFullYear() : "",
                      }));
                      SetYearChecked(true);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    yearItemNumber={10}
                  />
                </div>
              </div>
              <div className="watched-filter">
                <p className="filter-title">Watched Movies:</p>
                <div className="watched-checkbox">
                  <label>Include Movies Watched</label>
                  <input
                    type="checkbox"
                    checked={watchedFilter}
                    onChange={() => setWatchedFilter(!watchedFilter)}
                  />
                </div>
              </div>
              <div className="filter-btn-div">
                <p
                  className={`filter-submit-btn ${filtersUsed && "btn-active"}`}
                  onClick={() => {
                    if (!filtersUsed) {
                      filterSearch();
                      setFiltersUsed(true);
                    } else {
                      setAllFilters({
                        year: "",
                        cast: "",
                        genres: [],
                      });
                      setYearSearch();
                      setGenreSearch && setGenreSearch(""); // Only if you have this state
                      setCastSearch && setCastSearch(""); // Only if you have this state
                      setFilterTrigger((prev) => prev + 1);
                      setFiltersUsed(false);
                    }
                  }}
                >
                  {filtersUsed ? "Filters On" : "Filters Off"}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="all-movies">
          {movies.map((movie, key) => {
            const userMovie = Array.isArray(userMovieData)
              ? userMovieData?.find(
                  (userMovie) => userMovie.movieName === movie.title
                )
              : null;
            return (
              <MovieCard
                userData={userMovie}
                key={key}
                movie={movie}
                genres={genres}
                watchedFilter={watchedFilter}
              />
            );
          })}

          <Pagination paginate={paginate} totalPages={totalPages} />
        </div>
        {/*--------------Sort---------*/}
        <div className="movie-content-right">
          <p
            onClick={() => setSorting(!sorting)}
            className={`sort-btn ${sorting && "btn-active"}`}
          >
            Sort
          </p>
          {sorting && (
            <div className="sort-function">
              <p>Sort Results :</p>
              <Select
                options={selectOptions}
                classNamePrefix={"react-select"}
                styles={selectStyles}
                value={selectOptions.find(
                  (option) => option.value === sortOption
                )}
                onChange={(selectedOption) =>
                  setSortOption(selectedOption.value)
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MobileMovieLibrary;
