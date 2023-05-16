import { prerender } from './cola_prerender.mjs';
import { initialise, find_all, insert_many } from './database_handler.mjs';
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 10000; 

let database_client;

app.get('/', async (req, res) => {
    if (!database_client) database_client = await initialise();

    const prev_database_name = req.query.prevDatabaseName;
    const new_database_name = req.query.newDatabaseName;

    const edges = await find_all(database_client, prev_database_name);
    const coordinates = await prerender(edges, 6000);

    insert_many(database_client, new_database_name, coordinates);

    res.status(200).send(coordinates);
});

app.listen(PORT);