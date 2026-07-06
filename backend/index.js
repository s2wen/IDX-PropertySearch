import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';
import propertiesRouter from './routes/properties.js';



dotenv.config();
//require('dotenv').config;

const app = express();

const PORT = process.env.PORT;

app.get('/api/health', async (req, res) => {
    try{
        await db.query('SELECT 1');

        return res.status(200).json({
            STATUS: "UP",
            database: "CONNECTED",
            timestamp: new Date()
        });
    }catch (error){
        return res.status(500).json({
            STATUS: "DOWN",
            database: "DISCONNECTED",
            timestamp: new Date()
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
});

app.use('/api/properties', propertiesRouter);