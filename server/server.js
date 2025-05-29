import mysql from "mysql";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3070;

/// Connection String ///
const mdb = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

mdb.connect(function (err) {
  if (err) {
    console.error("Error connecting to MariaDB:", err);
    return;
  }
  console.log("Connected to MariaDB");
});

/// Get usernames and emails
app.get("/get-existing-users", (req, res) => {
  const q = "SELECT * FROM users";
  mdb.query(q, (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
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
      return res.json(err);
    } else {
      console.log("successfully added user data:", data);
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
  const groupQuery = `INSERT INTO bookmarkedLiked (username, movieId,movieName, bookmarked,date) VALUES (?,?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    bookmarked = VALUES(bookmarked)
    `;

  const valGroupTable = [
    req.body.username,
    req.body.movieId,
    req.body.movieName,
    req.body.bookmarked,
    req.body.date,
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
  const groupQuery = `INSERT INTO bookmarkedLiked (username, movieId,movieName, liked,date) VALUES (?,?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    liked = VALUES(liked)
    `;
  const valGroupTable = [
    req.body.username,
    req.body.movieId,
    req.body.movieName,
    req.body.liked,
    req.body.date,
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
  const groupQuery = `INSERT INTO watched (username, movieId,movieName, watched,date) VALUES (?,?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    watched = VALUES(watched)
    `;

  const valGroupTable = [
    req.body.username,
    req.body.movieId,
    req.body.movieName,
    req.body.watched,
    req.body.date,
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
    "INSERT IGNORE INTO ratingReview (username, profileImage, movieId,movieName,rating, review,date) VALUES (?,?, ?, ?, ?, ?,?)";
  const valRevTable = [
    req.body.username,
    req.body.profileImage,
    req.body.movieId,
    req.body.movieName,
    req.body.rating,
    req.body.review,
    req.body.date,
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
  console.log(`Server is running on http://localhost:${port}`);
});
