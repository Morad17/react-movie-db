// filepath: src/hooks/useMovieActions.js
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useMovieActions = () => {
  //For Testing vs Production
  const baseUrl =
    process.env.REACT_APP_BASE_URL || "https://movie-binge.onrender.com";

  const [isDisabled, setIsDisabled] = useState(false);
  const addToBookmarked = async ({
    username,
    id,
    title,
    date,
    userActions,
    setUserActions,
  }) => {
    if (username) {
      setIsDisabled(true);
      if (userActions.bookmarked === true || userActions.bookmarked === 1) {
        try {
          const res = await axios.post(`${baseUrl}/addToBookmarked`, {
            username,
            movieId: id,
            movieName: title,
            date,
            bookmarked: 0,
          });
          toast(`Successfully removed ${title} from the bookmarks list`);
          setUserActions((prev) => ({ ...prev, bookmarked: null }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your movie was not removed");
        }
      } else if (
        userActions.bookmarked === null ||
        userActions.bookmarked === 0
      ) {
        try {
          const res = await axios.post(`${baseUrl}/addToBookmarked`, {
            username,
            movieId: id,
            movieName: title,
            date,
            bookmarked: 1,
          });
          toast(`Successfully bookmarked ${title}`);
          setUserActions((prev) => ({ ...prev, bookmarked: true }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your Movie Was not added");
        }
      }
    } else {
      toast("You must be logged in to add movies to lists");
    }
  };

  const addToLiked = async ({
    username,
    id,
    title,
    date,
    userActions,
    setUserActions,
  }) => {
    if (username) {
      setIsDisabled(true);
      if (userActions.liked === true || userActions.liked === 1) {
        try {
          const res = await axios.post(`${baseUrl}/addToLiked`, {
            username,
            movieId: id,
            movieName: title,
            date,
            liked: false,
          });
          toast(`Successfully removed ${title} from the Liked list`);
          setUserActions((prev) => ({ ...prev, liked: null }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your movie was not added");
        }
      } else if (userActions.liked === null || userActions.liked === 0) {
        try {
          const res = await axios.post(`${baseUrl}/addToLiked`, {
            username,
            movieId: id,
            movieName: title,
            date,
            liked: true,
          });
          toast(`Successfully Liked ${title}`);
          setUserActions((prev) => ({ ...prev, liked: true }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your Movie Was not added");
        }
      }
    } else {
      toast("You must be logged in to add movies to lists");
    }
  };
  const addToWatched = async ({
    username,
    id,
    title,
    date,
    userActions,
    setUserActions,
  }) => {
    if (username) {
      setIsDisabled(true);
      if (userActions.watched === true || userActions.watched === 1) {
        try {
          const res = await axios.post(`${baseUrl}/addToWatched`, {
            username,
            movieId: id,
            movieName: title,
            date,
            watched: false,
          });
          toast(`Successfully changed to not Watched`);
          setUserActions((prev) => ({ ...prev, watched: false }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your watched list was not updated");
        }
      } else if (
        userActions.watched === false ||
        userActions.watched === null ||
        userActions.watched === 0
      ) {
        try {
          const res = await axios.post(`${baseUrl}/addToWatched`, {
            username,
            movieId: id,
            movieName: title,
            date,
            watched: true,
          });
          toast(`Successfully Changed to Watched`);
          setUserActions((prev) => ({ ...prev, watched: true }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your Watched List was not updated");
        }
      }
    } else {
      toast("You must be logged in to edit watched list");
    }
  };
  // Make Rating and Reviews
  const createRatingReview = async ({
    id,
    username,
    profileImage,
    title,
    rating,
    review,
    poster_path,
    date,
    userActions,
    setUserActions,
  }) => {
    if (username) {
      try {
        const res = await axios.post(`${baseUrl}/createRatingReview`, {
          username,
          movieId: id,
          movieName: title,
          profileImage,
          rating,
          review,
          poster_path,
          date,
        });
        if (res.data && res.data.success) {
          toast(`Successfully rated ${title}`);
          setUserActions((prev) => ({
            ...prev,
            rated: true,
            reviewed: review ? true : null,
            rating: rating,
            review: review ? true : null,
          }));
        } else {
          toast("Rating unsuccessful");
        }
        return res.data;
      } catch (err) {
        console.log(err);
        toast("Rating unsuccessfull");
        return { success: false };
      }
    } else {
      toast("You must be logged in to leave a rating/review");
      return { success: false };
    }
  };

  return {
    addToBookmarked,
    addToLiked,
    addToWatched,
    createRatingReview,
    isDisabled,
  };
};

export default useMovieActions;
