import mysql2 from "mysql2";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

dotenv.config();

//Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8000;

/// Connection String ///
const mdb = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

//Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Upload Profile Image
app.post("/uploadProfileImage", upload.single("image"), (req, res) => {
  cloudinary.uploader
    .upload_stream({ folder: "movieBinge/profileImages" }, (error, result) => {
      if (error) return res.status(500).json({ error });
      return res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    })
    .end(req.file.buffer);
});

/// Get usernames and emails
app.get("/checkUserExists", (req, res) => {
  const { username, email } = req.query;
  const q = "SELECT username, email FROM users WHERE username = ? OR email = ?";
  mdb.query(q, [username, email], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    let errMsg = "";
    if (data.length > 0) {
      const foundUser = data[0];
      if (foundUser.username === username) errMsg = "That Username is taken";
      else if (foundUser.email === email)
        errMsg = "That Email is already in use";
    }
    return res.json({ exists: data.length > 0, errMsg });
  });
});
/// Create user
app.post("/createUser", (req, res) => {
  const createUserQuery =
    "INSERT into users (`username`,`name`,`profileImage`,`email`, `password`)VALUES (?)";
  const createUserVal = [
    req.body.username,
    req.body.name,
    req.body.profileImage,
    req.body.email,
    req.body.password,
  ];

  // Execute the first query to create the user
  mdb.query(createUserQuery, [createUserVal], (err, data) => {
    if (err) {
      console.error("Error executing createUserQuery:", err);
      return res.status(500).json({ success: false, error: err });
    } else {
      console.log("successfully added user data:", data);
      return res
        .status(201)
        .json({ success: true, message: "User created", data });
    }
  });
});
/// Login ///
app.post("/login", (req, res) => {
  const q = "SELECT * FROM users WHERE `username` = ? AND `password` = ?";
  const val = [req.body.username, req.body.password];
  mdb.query(q, [...val], (err, data) => {
    if (err) return res.json("login unsuccessfull, try again");
    if (data.length > 0) {
      return res.json(data);
    } else return res.json(0);
  });
});

//////////Fetching Movie Data from TMDB///////////////
app.get("/fetchMovies", async (req, res) => {
  const { currentPage, yearFilter, genres, sortOption } = req.query;
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&primary_release_year=${yearFilter}&sort_by=${sortOption}&with_genres=${genres}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});
app.get("/fetchSearchedMovies", async (req, res) => {
  const { currentPage, searchQuery } = req.query;
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${currentPage}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});
app.get("/fetchGenres", async (req, res) => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});
app.get("/fetchSelectedMovie", async (req, res) => {
  const { id } = req.query;
  const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=release_dates%2Cvideos%2Ccredits&language=en-US`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

// Get All Ratings & Reviews
app.get("/getAllRatingReviews", (req, res) => {
  const movieId = req.query.movieId;
  const queryTable = `
  SELECT *
  FROM ratingReview
  WHERE ratingReview.movieId = ?
`;
  mdb.query(queryTable, [movieId], (err, data) => {
    if (err) return res.json(err);
    // Filter ratings and reviews
    const ratings = data.filter(
      (row) => typeof row.rating === "number" && row.rating !== null
    );
    const reviews = data.filter(
      (row) => typeof row.review === "string" && row.review.trim().length > 0
    );
    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, row) => sum + row.rating, 0) / ratings.length
        : null;

    return res.json({
      rating: ratings.length,
      averageRating,
      review: {
        total: reviews.length,
        all: reviews,
      },
    });
  });
});
// Get All User Bookmark Liked Movies /////
app.get("/getAllUserBookmarkLiked", (req, res) => {
  const { username } = req.query;
  const queryTable = `
  SELECT * FROM bookmarkedLiked WHERE username = ?
`;
  mdb.query(queryTable, [username], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json(data);
    } else return res.json("no records found");
  });
});
// Get All User Bookmark Liked Movies /////
app.get("/getAllUserWatched", (req, res) => {
  const { username } = req.query;
  const queryTable = `
  SELECT * FROM watched WHERE username = ?
`;
  mdb.query(queryTable, [username], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json(data);
    } else return res.json("no records found");
  });
});
//////////Get All User Details for Single Movie ///////////////

// Get User Bookmark Liked
app.get("/getUserBookmarkLiked", (req, res) => {
  const { movieId, username } = req.query;
  const queryTable = `
  SELECT bookmarked, liked
  FROM bookmarkedLiked
  WHERE movieId = ? AND username = ?
`;
  mdb.query(queryTable, [movieId, username], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json(data);
    } else return res.json(false);
  });
});
// Get User Watched
app.get("/getUserWatched", (req, res) => {
  const { movieId, username } = req.query;
  const queryTable = `
  SELECT *
  FROM watched
  WHERE watched.movieId = ? AND username = ?
`;
  mdb.query(queryTable, [movieId, username], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json(data);
    } else return res.json(false);
  });
});
// Get User Ratings & Reviews
app.get("/getUserRatingReview", (req, res) => {
  const { movieId, username } = req.query;
  const queryTable = `
  SELECT *
  FROM ratingReview
  WHERE ratingReview.movieId = ? AND username = ?
`;
  mdb.query(queryTable, [movieId, username], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json(data);
    } else return res.json(false);
  });
});

////Add Movie To Database

//Bookmark List
app.post("/addToBookmarked", (req, res) => {
  const groupQuery = `INSERT INTO bookmarkedLiked (username, movieId,movieName, bookmarked) VALUES (?,?, ?, ?)
    ON DUPLICATE KEY UPDATE
    bookmarked = VALUES(bookmarked)
    `;

  const valGroupTable = [
    req.body.username,
    req.body.movieId,
    req.body.movieName,
    req.body.bookmarked,
  ];
  mdb.query(groupQuery, [...valGroupTable], (err, data) => {
    if (!err) {
      return res.send({
        success: true,
        message: "Successfully Updated Bookmarked List",
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: "Error Updating Bookmarked List" });
    }
  });
});

//Like List
app.post("/addToLiked", (req, res) => {
  const groupQuery = `INSERT INTO bookmarkedLiked (username, movieId,movieName, liked) VALUES (?,?, ?, ?)
    ON DUPLICATE KEY UPDATE
    liked = VALUES(liked)
    `;
  const valGroupTable = [
    req.body.username,
    req.body.movieId,
    req.body.movieName,
    req.body.liked,
  ];
  mdb.query(groupQuery, [...valGroupTable], (err, data) => {
    if (!err) {
      return res.send({
        success: true,
        message: "Successfully Updating Like List",
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: "Error Updating Like List" });
    }
  });
});

//Watched List
app.post("/addToWatched", (req, res) => {
  const groupQuery = `INSERT INTO watched (username, movieId,movieName, watched) VALUES (?,?, ?, ?)
    ON DUPLICATE KEY UPDATE
    watched = VALUES(watched)
    `;

  const valGroupTable = [
    req.body.username,
    req.body.movieId,
    req.body.movieName,
    req.body.watched,
  ];
  mdb.query(groupQuery, [...valGroupTable], (err, data) => {
    if (!err) {
      return res.send({
        success: true,
        message: "Successfully Updating Watched List",
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: "Error Updating Watched List" });
    }
  });
});
//Create Review
app.post("/createRatingReview", (req, res) => {
  const revTableQuery =
    "INSERT IGNORE INTO ratingReview (username, profileImage, movieId,movieName,rating, review) VALUES (?,?, ?, ?, ?,?)";
  const valRevTable = [
    req.body.username,
    req.body.profileImage,
    req.body.movieId,
    req.body.movieName,
    req.body.rating,
    req.body.review,
  ];
  mdb.query(revTableQuery, [...valRevTable], (err, data) => {
    if (!err) {
      return res.send({
        success: true,
        message: "Successfully Created Rating/Review",
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: "Error Rating Movie" });
    }
  });
});

////////Get Total Metrics for movie ///////
//Bookmarks Likes
app.get("/getBookmarkedLikedTotalMovie", (req, res) => {
  const { movieId } = req.query;
  const query = `
    SELECT
      SUM(CASE WHEN bookmarked = 1 THEN 1 ELSE 0 END) AS totalBookmarked,
      SUM(CASE WHEN liked = 1 THEN 1 ELSE 0 END) AS totalLiked
    FROM bookmarkedLiked
    WHERE movieId = ?
  `;
  mdb.query(query, [movieId], (err, data) => {
    if (err) {
      console.log(err, "error getting totals from bookmarkedLiked");
      return res.status(500).json({ error: err });
    }
    return res.json(data[0]);
  });
});

//Watched
app.get("/getWatchedTotalMovie", (req, res) => {
  const { movieId } = req.query;
  const query = `
    SELECT
      SUM(CASE WHEN watched = 1 THEN 1 ELSE 0 END) AS totalWatched
    FROM watched
    WHERE movieId = ?
  `;
  mdb.query(query, [movieId], (err, data) => {
    if (err) {
      console.log(err, "error getting totals from watched");
      return res.status(500).json({ error: err });
    }
    return res.json(data[0]);
  });
});

// Initialise Node App//
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
