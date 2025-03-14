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
    const q = "INSERT into users (`username`,`name`,`email`, `password`)VALUES (?)"
    const val = [
        req.body.username,
        req.body.name,
        req.body.email,
        req.body.password,

    ]
    mdb.query(q,[val], (err,data)=> {
        if (err) return res.json(err)
        else return res.json("success")
    })
})
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