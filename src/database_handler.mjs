import { MongoClient } from 'mongodb';


const COLLECTION_EDGES = 'relations';
const COLLECTION_COORDINATES = 'coordinates'; 

export async function initialise() {
    const client = new MongoClient(process.env.MONGODB_URL);

    await client.connect();

    return client
}

export async function find_all(client, database_name) {
    return await client
        .db(database_name)
        .collection(COLLECTION_EDGES)
        .find()
        .toArray();
}

export async function insert_many(client, database_name, docs) {
    await client
        .db(database_name)
        .collection(COLLECTION_COORDINATES)
        .insertMany(docs);
}