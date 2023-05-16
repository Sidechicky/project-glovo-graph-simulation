import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { prerender } from './cola_prerender.mjs';
import { initialise, find_all, insert_many } from './database_handler.mjs';


const app = express();
const PORT = 10000; 

// for serverless (Cyclic), connections should be established before listening
let database_client = await initialise();

app.get('/', async (req, res) => {
    console.log('GET request');
    const prev_database_name = req.query.prevDatabaseName;
    const new_database_name = req.query.newDatabaseName;

    console.log(prev_database_name, new_database_name);

    const edges = await find_all(database_client, prev_database_name);
    const coordinates = await prerender(edges);

    insert_many(database_client, new_database_name, coordinates);

    res.status(200).send(coordinates);
});

app.listen(PORT, ()=>{
    console.log('listening on port')
});