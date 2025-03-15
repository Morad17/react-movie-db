import mysql2 from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config()

const app = express();
app.use(express.json())
app.use(cors())
const port = 3070;

/// Connection String ///
const mdb = mysql2.createConnection({
      host: process.env.MARIA_HOST, 
      user: process.env.MARIA_USERNAME, 
      password: process.env.MARIA_PASSWORD,
      database: process.env.MARIA_DATABASE,
      port: 3307,
      connectionLimit: 5
});   
 
    mdb.connect(
        function(err) {
        if (err) {
            console.error('Error connecting to MariaDB:', err);
            return;
        }
        console.log('Connected to MariaDB');
    });


/// Get usernames and emails
app.get('/get-existing-users',(req,res)=> {
    const q = "SELECT * FROM users"
    mdb.query(q, (err,data)=> {
        if (err) console.log(err)
        else return res.json(data)
    })
})
/// Create user
app.post('/create-user',(req,res)=> {
    const uniqueId = req.body.username.replace(/[^a-zA-Z0-9_]/g, '')+'_'+ Date.now()
    const createUserQuery = "INSERT into users (`username`,`name`,`email`, `password`,`tableName`)VALUES (?)"
    const createUserVal = [
        req.body.username,
        req.body.name,
        req.body.email,
        req.body.password,
        uniqueId
    ]

    const createUserTable = `CREATE TABLE ${uniqueId}(
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT UNIQUE,
        watchList BOOLEAN DEFAULT FALSE,
        likedList BOOLEAN DEFAULT FALSE,
        review TEXT,
        rating INT CHECK (rating >= 1 AND rating <= 10)
    )`

   // Execute the first query to create the user
   mdb.query(createUserQuery, [createUserVal], (err, data) => {
    if (err) {
        console.error('Error executing createUserQuery:', err);
        return res.json(err);
    } else {
        console.log('successfully added user data:', data);

        // Execute the second query to create the user's table
        mdb.query(createUserTable, (err, data) => {
            if (err) {
                console.error('Error executing createUserTable:', err);
                return res.json(err);
            } else {
                console.log('createUserTable executed successfully:', data);
                return res.json("success");
            }
        });
    }
})})
/// Login
app.post('/login',(req,res)=> {
    const q = "SELECT * FROM users WHERE `username` = ? AND `password` = ?"
    const val = [
        req.body.username,
        req.body.password,
    ]
    mdb.query(q,[...val], (err,data)=> {
        if (err) return res.json("login unsuccessfull, try again")
        if (data.length > 0){
            return res.json(data)
        } else return res.json(0)
        
    })
})
    

// Initialise Node App//

app.listen(port, () => {   
    console.log(`Server is running on http://localhost:${port}`);        
});   