import { CosmosClient } from "@azure/cosmos";
require("dotenv").config(); // Load environment variables

// Initialize the Cosmos DB client once
export const client = new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT || "https://halai-cosmosdb.documents.azure.com:443/",
    key: process.env.COSMOS_DB_KEY
});

// Export the database and container references
export const database = client.database(process.env.COSMOS_DB_DATABASE);
export const container = database.container(process.env.COSMOS_DB_CONTAINER);

