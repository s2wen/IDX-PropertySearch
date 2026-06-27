//const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
//require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true
});

export default pool;