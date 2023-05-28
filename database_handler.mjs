import { MongoClient } from 'mongodb';


const COLLECTION_EDGES = '_relations';
const COLLECTION_COORDINATES = 'coordinates'; 
let connection_string;

export async function initialise() {
    connection_string = process.env.MONGODB_URL
    console.log('Connection string', connection_string);
    const client = new MongoClient(connection_string);

    await client.connect();

    return client
}

export async function find_all(client, database_name) {
    console.log('finding ...');
    return await client
        .db(database_name)
        .collection(COLLECTION_EDGES)
        .find()
        .toArray();
}

export async function insert_many(client, database_name, docs) {
    console.log('inserting ...');
    console.log(docs[0]);
    await client
        .db(database_name)
        .collection(COLLECTION_COORDINATES)
        .insertMany(docs);
}

export async function drop_collection(client, database_name) {
    try {
        await client
            .db(database_name)
            .collection(COLLECTION_COORDINATES)
            .drop();
    } catch (error) {
        console.log('Collection doesn\'t exist');
    }
}