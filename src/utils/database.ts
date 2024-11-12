require("dotenv").config();
import { CosmosClient } from "@azure/cosmos";

console.log("process.env.COSMOS_DB_KEY")
console.log(process.env.COSMOS_DB_KEY)
// Initialize the Cosmos DB client once
export const client = new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY
});

// Export the database and container references
export const database = client.database(process.env.COSMOS_DB_DATABASE);
export const container = database.container(process.env.COSMOS_DB_CONTAINER);

