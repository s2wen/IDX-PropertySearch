import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';
import propertiesRouter from './routes/properties.js';



dotenv.config();
//require('dotenv').config;

const app = express();

const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());

//request logging middleware
app.use((req, res, next) =>{
    console.log("Middleware Executed");
    const start = Date.now();

    res.on('finish', () =>{
        const duration = Date.now()-start;
        const date = new Date();
        console.log(`${date}: ${req.method}, ${req.originalUrl}, ${duration}ms`);
    })

    next();
})

//health checkpoint
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

//properties router
app.use('/api/properties', propertiesRouter);

