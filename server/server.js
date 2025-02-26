import mariadb from 'mariadb';
import mysql2 from 'mysql2';

import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = 3000;

// // Create a pool of connections
const pool = mariadb.createPool({
    host: process.env.MARIA_HOST, 
    user: process.env.MARIA_USERNAME, 
    password: process.env.MARIA_PASSWORD,
    port: 3307,
    database: 'test',
    connectionLimit: 5
});

// Function to get a connection from the pool
// async function getConnection() {
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const rows = await conn.query('SELECT 1 as val');
//         console.log("Connected to MariaDB!", rows);
//         return conn;
//     } catch (err) {
//         console.error("Error connecting to MariaDB:", err);
//         throw err; 
//     } finally {
//         if (conn) conn.end(); 
//       }
// }

//   getConnection().then(() => {
//     pool.end();
//   }).catch(err => {
//     console.error("Failed to connect to MariaDb",err); 
//   })

const mdb = mysql2.createConnection({
      host: process.env.MARIA_HOST, 
      user: process.env.MARIA_USERNAME, 
      password: process.env.MARIA_PASSWORD,
      database: 'test',
      port: 3307,
      connectionLimit: 5
});   
 
mdb.connect(function(err) {
    if (err) {
        console.error('Error connecting to MariaDB:', err);
        return;
    }
    console.log('Connected to MariaDB');
});

// Example query
mdb.query('SELECT 1', (err, results) => {
    if (err) throw err;
    console.log(results);
});  

// Get Movie List //



// Initialise Node App//

app.listen(port, () => {   
    console.log(`Server is running on http://localhost:${port}`);        
});   