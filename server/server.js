import mariadb from 'mariadb';
import express from 'express';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

// Create a pool of connections
const mdb = mariadb.createPool({
    host: process.env.mariaHost , 
    user: process.env.mariaUsername, 
    password: process.env.mariaPassword,
    database: 'test',
    connectionLimit: 5
});

// Function to get a connection from the pool
async function getConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Connected to MariaDB!");
        return conn;
    } catch (err) {
        throw err;
    }
}

// // Example route to test the connection
// app.get('/test-connection', async (req, res) => {
//     let conn;
//     try {
//         conn = await getConnection();
//         const rows = await conn.query("SELECT 1 as val");
//         res.send(rows);
//     } catch (err) {
//         res.status(500).send("Error connecting to the database");
//     } finally {
//         if (conn) conn.end();
//     }
// });

// mdb.query(`SELECT * from test`, (err, res) => {
//     if (err) {
//         return console.log(err)
//     } else {
//         return console.log(res + "success")
//     }
// })
console.log(process.env.TEST)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});