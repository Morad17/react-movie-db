import React,{useEffect, useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import Select from 'react-select' 

import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SearchMovie from '../components/SearchMovie';
import GenreColors  from '../components/GenreColors';

import { BsBookmarkStarFill } from 'react-icons/bs';
import { BiHeartCircle } from 'react-icons/bi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const MovieLibrary = () => {

////Use States////
  const [movies, setMovies ] = useState([])
  const [genres, setGenres ] = useState([])
  const [userMovieData, setUserMovieData ] = useState([])
  // Search Sort & Filter //
  const [searchQuery, setSearchQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [sortOption, setSortOption ] = useState('popularity.desc')
  const [sorting, setSorting] = useState(false)
  const [filters, setFilters] = useState(false)
  const [allFilters, setAllFilters] = useState({
    year:'',cast:'',genres:''
  })
  const [genreSearch, setGenreSearch] = useState('')
  const [yearSearch, setYearSearch] = useState()
  //Pagination
  const [currentPage,setCurrentPage ] = useState(1)
  const [totalPages, setTotalPages] = useState()

  // Get All Movies//
  const fetchMovies = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
      }
    };
    const url = searchQuery
        ? `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${currentPage}`
        : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&primary_release_year=${allFilters.year}&sort_by=${sortOption}&with_cast=${allFilters.cast}&with_genres=${allFilters.genres}`
    try{
      const res = await fetch(url , options)
      const data = await res.json()
      console.log(data, url)
      setMovies(data.results)
      setTotalPages(data.total_pages)
     if(searchQuery){
      toast(`Your Search For ${searchQuery} returned ${data.total_pages} Pages from ${data.total_results} results`,{position: "top-center",autoClose: 5000,
        hideProgressBar: false,})
     }
    } catch (err) {
      console.log(err) 
    }
  }
  useEffect(() => {
  fetchMovies()
  },[searchQuery, currentPage, sortOption, filterQuery])

  // Get Genre Name from Genre Id //
  const fetchGenres = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
      }
    };
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
    try{
      const res = await fetch(url , options)
      const data = await res.json()
      setGenres(data.genres)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
  fetchGenres()
  },[])

  // Get User Liked and Bookmarked data //
  const getUserMovieData = async () => {
    const user = localStorage.getItem("username")
    if (user) {
      try {
      const res = await axios.post('http://localhost:3070/getUserTable', {"username":user})
      setUserMovieData(res.data)
      } catch (err) {
        console.log(err)
      }
      }
  
  }
  useEffect(() => {
    getUserMovieData()
  }, [])

  const paginate = (number) => setCurrentPage(number)
  const handleMovieSearch = (query) => {
    setSearchQuery(query); // Update the search query
    setCurrentPage(1); // Reset to the first page
  };

  const filterSearch = () => {
    if () {
      setFilterQuery(true)
    }
  }

  ///Style Components for Select /// 
  const selectOptions = [
    { label: "Popularity Ascending", value: "popularity.asc" },
    { label: "Popularity Descending", value: "popularity.desc" },
    { label: "Vote Average Ascending", value: "vote_average.asc" },
    { label: "Vote Average Descending", value: "vote_average.desc" },
    { label: "Release Date Ascending", value: "releas_-date.asc" },
    { label: "Release Data Descending", value: "release_date.desc" },
    { label: "Title (A-Z)", value: "title.desc" },
    { label: "Title (Z -A)", value: "title.asc" },
  ];
  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: '#c3c3c3',
      margin: '0',
      cursor: 'pointer',
      borderColor: state.isFocused ? '#12504A' : baseStyles.borderColor,
      boxShadow: state.isFocused ? 'none' : 'none',
    '&:hover': {
      borderColor: '#12504A', 
    },
      outlineColor: state.isFocused && '#12504A',
      '&:hover':{backgroundColor: '12504A'},
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? '#12504A' : '#c3c3c3',
      '&:hover': {backgroundColor: '12504A'},
      cursor: 'pointer',
      color: 'black'
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#c3c3c3',
      color: 'black',
      zIndex: 5,
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: 'black',
    })
  };

  return (
    <div className="movie-library">
      <section className="movie-library-header">
        <div className="movie-header-left">
          <div className="info-div">
            <h3>Get Started</h3>
            <p>Click on the movie for more info </p>
            <p>
              <BsBookmarkStarFill /> Click The Bookmark Icon to add movie to
              watch list. Click again to remove from list
            </p>
            <p>
              <BiHeartCircle /> Click the Like icon to add movie to liked list.
              Click again to remove.
            </p>
          </div>
          <a onClick={()=> setFilters(!filters)} className="filter-btn">
            Filter
          </a>
        </div>
        <div className="movie-header-center">
          <h2>All Movies</h2>
          <div className="search-div">
            <SearchMovie movieSearch={handleMovieSearch} />
          </div>
        </div>
        <div className="movie-header-right">
          <a onClick={()=> setSorting(!sorting)} className="sort-btn">
            Sort
          </a>
        </div>
      </section>
      <section className="movie-library-content">
{/*-------------Filters---------*/}
      <div className="movie-content-left">
        {
          filters && 
          <div className="filters-function">
            <div className="genre-filter">
              <p className="filter-title">By Genre:</p>
              <div className="all-genres">
                {
                  genres.map((g, key)=> {
                  return <p className="movie-genre" onClick={() => setGenreSearch(g.id)} key={key}>{g.name}</p>
                })
              }
              </div>
              
            </div>
            <div className="year-filter">
              <p className="filter-title">By Year:</p>
            <DatePicker
            placeholderText="yyyy"
              selected={yearSearch}
              onChange={(date) => setYearSearch(date)}
              showYearPicker
              dateFormat="yyyy"
            />

            </div>
            <div className="seen-filter">
              <p className="filter-title">
                By Seen Movies:
              </p>
              <a className="seen-filter-btn" href="">Filter</a>
            </div>
            <div className="actor-filter">
              <div className="filter-title">
                By Actor / Actress 
              </div>
            </div>
            <div className="filter-btn-div">
              <a className="filter-btn" onClick={()=> filterSearch()}>Add Filters</a>
            </div>
            
          </div>
              }
        </div>
        <div className="all-movies">
          {movies.map((movie, key) => {
            const userMovie =
              userMovieData?.find(
                (userMovie) => userMovie.movieName === movie.title
              ) || null;
            return (
              <MovieCard
                userData={userMovie}
                key={key}
                movie={movie}
                genres={genres}
              />
            );
          })}

          <Pagination paginate={paginate} totalPages={totalPages} />
        </div>
{/*--------------Sort---------*/}
        <div className="movie-content-right">
          {
            sorting && 
            <div className="sort-function">
            <p>Sort Results By:</p>
              <Select 
                options={selectOptions}
                classNamePrefix={"react-select"}
                styles={selectStyles}
                value={selectOptions.find((option) => option.value === sortOption)}
                onChange={(selectedOption) => setSortOption(selectedOption.value)}
              />
          </div>
          }
          
        </div>
      </section>
    </div>
  );
}

export default MovieLibrary 