import mysql2 from "mysql2";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3070;

/// Connection String ///
const mdb = mysql2.createConnection({
  host: process.env.MARIA_HOST,
  user: process.env.MARIA_USERNAME,
  password: process.env.MARIA_PASSWORD,
  database: process.env.MARIA_DATABASE,
  port: 3307,
  connectionLimit: 5,
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
  const uniqueId =
    req.body.username.replace(/[^a-zA-Z0-9_]/g, "") + "_" + Date.now();
  const createUserQuery =
    "INSERT into users (`username`,`name`,`profileImage`,`email`, `password`,`tableName`)VALUES (?)";
  const createUserVal = [
    req.body.username,
    req.body.name,
    req.body.profileImage,
    req.body.email,
    req.body.password,
    uniqueId,
  ];

  const createUserTable = `CREATE TABLE ${uniqueId}(
        id INT AUTO_INCREMENT PRIMARY KEY,
        movieId INT UNIQUE,
        movieName TEXT,
        bookmarkList BOOLEAN DEFAULT FALSE,
        likedList BOOLEAN DEFAULT FALSE,
        review TEXT,
        rating FLOAT CHECK (rating BETWEEN 1 AND 10),
        watched BOOLEAN DEFAULT FALSE,
        poster_path TEXT,
    )`;

  // Execute the first query to create the user
  mdb.query(createUserQuery, [createUserVal], (err, data) => {
    if (err) {
      console.error("Error executing createUserQuery:", err);
      return res.json(err);
    } else {
      console.log("successfully added user data:", data);

      // Execute the second query to create the user's table
      mdb.query(createUserTable, (err, data) => {
        if (err) {
          console.error("Error executing createUserTable:", err);
          return res.json(err);
        } else {
          console.log("createUserTable executed successfully:", data);
          return res.json("success");
        }
      });
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

/// Get User Personal Table
app.post("/getUserTable", (req, res) => {
  const queryTable = "SELECT tableName FROM users WHERE `username` = ?";
  const valTable = [req.body.username];
  mdb.query(queryTable, [...valTable], (err, data) => {
    ///Find Users Table base on users name (in user table)
    if (err) return res.json(err);
    if (data.length > 0) {
      const tableName = data[0].tableName;
      const qTable = `SELECT * FROM ${tableName}`;
      mdb.query(qTable, (err, data) => {
        if (err) {
          console.log(err, "error finding table info");
          return res.json({ fatal: true, error: err });
        }
        // Returns an array, even if empty
        return res.json(data);
      });
    } else return console.log(err, "table not found");
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
    if (data.length > 0) {
      return res.json(data);
    } else return res.json("no records found");
  });
});

////Add Movie To Database

//Watch List
app.post("/addToBookmarkList", (req, res) => {
  const queryTable = "SELECT tableName FROM users WHERE `username` = ?";
  const valTable = [req.body.username];
  mdb.query(queryTable, [...valTable], (err, data) => {
    ///Find Users Table base on users name (in user table)
    if (err) return res.json(err);
    if (data.length > 0) {
      const tableName = data[0].tableName;
      const bookmarkQuery = `INSERT into ${tableName} (movieId,movieName,poster_path,bookmarkList)VALUE (?, ?, ?,?)
                ON DUPLICATE KEY UPDATE
                bookmarkList = VALUES(bookmarkList)
                `;
      const valBookmark = [
        req.body.movieId,
        req.body.movieName,
        req.body.poster_path,
        req.body.bookmarkList,
      ];
      ///Add To Users Table bookmarkList
      mdb.query(bookmarkQuery, [...valBookmark], (err, data) => {
        if (err) return console.log(err, "error whilst pushing to table");
        if (data.length > 0) {
          return res.json(data);
        } else return res.json(err);
      });
    }
  });
});

//Like List
app.post("/addToLikedList", (req, res) => {
  const queryTable = "SELECT tableName FROM users WHERE `username` = ?";
  const valTable = [req.body.username];
  mdb.query(queryTable, [...valTable], (err, data) => {
    ///Find Users Table base on users name (in user table)
    if (err) return res.json(err);
    if (data.length > 0) {
      const tableName = data[0].tableName;
      const likeQuery = `INSERT into ${tableName} (movieId,movieName,poster_path,likedList)VALUE (?, ?, ?,?)
                ON DUPLICATE KEY UPDATE
                likedList = VALUES(likedList)
                `;
      const valLike = [
        req.body.movieId,
        req.body.movieName,
        req.body.poster_path,
        req.body.likedList,
      ];
      ///Add To Users Table Like List
      mdb.query(likeQuery, [...valLike], (err, data) => {
        if (err) return console.log(err, "error whilst pushing to table");
        if (data.length > 0) {
          return res.json(data);
        } else return res.json(err);
      });
    }
  });
});

//Watched List
app.post("/addToWatched", (req, res) => {
  const queryTable = "SELECT tableName FROM users WHERE `username` = ?";
  const valTable = [req.body.username];
  mdb.query(queryTable, [...valTable], (err, data) => {
    ///Find Users Table base on users name (in user table)
    if (err) return res.json(err);
    if (data.length > 0) {
      const tableName = data[0].tableName;
      const watchedQuery = `INSERT into ${tableName} (movieId,movieName,poster_path,watched)VALUE (?, ?, ?,?)
                ON DUPLICATE KEY UPDATE
                watched = VALUES(watched)
                `;
      const valWatched = [
        req.body.movieId,
        req.body.movieName,
        req.body.poster_path,
        req.body.watched,
      ];
      ///Add To Users Table Like List
      mdb.query(watchedQuery, [...valWatched], (err, data) => {
        if (err) return console.log(err, "error whilst pushing to table");
        if (data.length > 0) {
          return res.json(data);
        } else return res.json(err);
      });
    }
  });
});
//Create Review
app.post("/createRatingReview", (req, res) => {
  const queryTable = "SELECT tableName FROM users WHERE `username` = ?";
  const valTable = [req.body.username];
  mdb.query(queryTable, [...valTable], (err, data) => {
    ///Find Users Table base on users name (in user table)
    if (err) return res.json("error", err);
    if (data.length > 0) {
      const tableName = data[0].tableName;
      const queryTable = `INSERT into ${tableName} (movieId,movieName, poster_path,rating,review) VALUE (?,?,?,?, ?)
                ON DUPLICATE KEY UPDATE
                review = VALUES(review),
                rating = VALUES(rating)
                `;
      const valTable = [
        req.body.movieId,
        req.body.movieName,
        req.body.poster_path,
        req.body.rating,
        req.body.review,
      ];
      ///Add To Users Table Review
      mdb.query(queryTable, [...valTable], (err, data) => {
        if (err) return console.log(err, "error whilst pushing to user table");
        if (data.length > 0) {
          return res.send("Successfully added rating & review to user Table");
        } else return err;
      });
    }
  });
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
    if (err)
      return console.log(err, "error whilst pushing to ratingReview table");
    if (data.length > 0) {
      return res.send("Succesfully Rated and Reviewed Movie");
    } else return err;
  });
});

// Initialise Node App//

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
