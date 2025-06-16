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
            bookmarked: 0,
          });
          toast(`Successfully removed ${title} from the bookmarks list`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({ ...prev, bookmarked: null }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your movie was not removed", {
            className: "toast-warning",
          });
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
            bookmarked: 1,
          });
          toast(`Successfully bookmarked ${title}`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({ ...prev, bookmarked: true }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your Movie Was not added", {
            className: "toast-warning",
          });
        }
      }
    } else {
      toast("You must be logged in to add movies to lists", {
        className: "toast-warning",
      });
    }
  };

  const addToLiked = async ({
    username,
    id,
    title,
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
            liked: false,
          });
          toast(`Successfully removed ${title} from the Liked list`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({ ...prev, liked: null }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your movie was not added", {
            className: "toast-warning",
          });
        }
      } else if (userActions.liked === null || userActions.liked === 0) {
        try {
          const res = await axios.post(`${baseUrl}/addToLiked`, {
            username,
            movieId: id,
            movieName: title,
            liked: true,
          });
          toast(`Successfully Liked ${title}`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({ ...prev, liked: true }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your Movie Was not added", {
            className: "toast-warning",
          });
        }
      }
    } else {
      toast("You must be logged in to add movies to lists", {
        className: "toast-warning",
      });
    }
  };
  const addToWatched = async ({
    username,
    id,
    title,
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
            watched: false,
          });
          toast(`Successfully changed to not Watched`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({ ...prev, watched: false }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your watched list was not updated", {
            className: "toast-warning",
          });
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
            watched: true,
          });
          toast(`Successfully Changed to Watched`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({ ...prev, watched: true }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your Watched List was not updated", {
            className: "toast-warning",
          });
        }
      }
    } else {
      toast("You must be logged in to edit watched list", {
        className: "toast-warning",
      });
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
        });
        if (res.data && res.data.success) {
          toast(`Successfully rated ${title}`, {
            className: "toast-success",
          });
          setUserActions((prev) => ({
            ...prev,
            rated: true,
            reviewed: review ? true : null,
            rating: rating,
            review: review ? true : null,
          }));
        } else {
          toast("Rating unsuccessful", {
            className: "toast-warning",
          });
        }
        return res.data;
      } catch (err) {
        console.log(err);
        toast("Rating unsuccessfull", {
          className: "toast-warning",
        });
        return { success: false };
      }
    } else {
      toast("You must be logged in to leave a rating/review", {
        className: "toast-warning",
      });
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
