// filepath: src/hooks/useMovieActions.js
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useMovieActions = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const addToBookmarkList = async ({
    username,
    id,
    title,
    poster_path,
    bookmarkList,
    userActions,
    setUserActions,
  }) => {
    if (username) {
      setIsDisabled(true);
      if (userActions.bookmarkList === true || userActions.bookmarkList === 1) {
        try {
          const res = await axios.post(
            "http://localhost:3070/addToBookmarkList",
            {
              username,
              movieId: id,
              movieName: title,
              poster_path,
              bookmarkList: false,
            }
          );
          toast(`Successfully removed ${title} from the bookmarks list`);
          setUserActions((prev) => ({ ...prev, bookmarkList: null }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your movie was not added");
        }
      } else if (
        userActions.bookmarkList === null ||
        userActions.bookmarkList === 0
      ) {
        try {
          const res = await axios.post(
            "http://localhost:3070/addToBookmarkList",
            {
              username,
              movieId: id,
              movieName: title,
              poster_path,
              bookmarkList: true,
            }
          );
          toast(`Successfully bookmarked ${title}`);
          setUserActions((prev) => ({ ...prev, bookmarkList: true }));
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

  const addToLikedList = async ({
    username,
    id,
    title,
    poster_path,
    userActions,
    setUserActions,
  }) => {
    if (username) {
      setIsDisabled(true);
      if (userActions.likedList === true || userActions.likedList === 1) {
        try {
          const res = await axios.post("http://localhost:3070/addToLikedList", {
            username,
            movieId: id,
            movieName: title,
            poster_path,
            likedList: false,
          });
          toast(`Successfully removed ${title} from the Liked list`);
          setUserActions((prev) => ({ ...prev, likedList: null }));
          setTimeout(() => {
            setIsDisabled(false);
          }, 2000);
          return res.data;
        } catch (err) {
          console.log(err);
          toast("Your movie was not added");
        }
      } else if (
        userActions.likedList === null ||
        userActions.likedList === 0
      ) {
        try {
          const res = await axios.post("http://localhost:3070/addToLikedList", {
            username,
            movieId: id,
            movieName: title,
            poster_path,
            likedList: true,
          });
          toast(`Successfully Liked ${title}`);
          setUserActions((prev) => ({ ...prev, likedList: true }));
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

  return { addToBookmarkList, addToLikedList, isDisabled };
};

export default useMovieActions;
