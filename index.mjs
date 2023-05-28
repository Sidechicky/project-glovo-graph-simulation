import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';

import { prerender } from './cola_prerender.mjs';
import { initialise, find_all, insert_many, drop_collection } from './database_handler.mjs';

const app = express();
const PORT = 10000; 

// for serverless (Cyclic), connections should be established before listening
let database_client = await initialise();

async function start_process(
    raw_database_name, 
    rendered_database_name,
    webhook
) {
    if (raw_database_name && rendered_database_name && webhook) {
        const edges = await find_all(database_client, raw_database_name);
        const coordinates = await prerender(edges);

        drop_collection(database_client, rendered_database_name);
        insert_many(database_client, rendered_database_name, coordinates);

        // send to webhook to coordinate the change to new set of data
        console.log('Calling webhook: ' + webhook);
        fetch(webhook);
    }
}

app.get('/', async (req, res) => {
    const raw_database_name = req.query.dbraw;
    const rendered_database_name = req.query.dbrendered;
    const webhook = req.query.webhook;

    console.log('RAW DB:', raw_database_name)
    console.log('RENDERED DB:', rendered_database_name)
    console.log('WEBHOOK:', webhook);

    await start_process(
        raw_database_name, 
        rendered_database_name, 
        webhook
    );
    res.status(200).send('success');
});

app.listen(PORT, '0.0.0.0', ()=>{
    console.log('listening on port ' + PORT)
});
