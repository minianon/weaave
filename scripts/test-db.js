const { Client } = require('pg');
require('dotenv').config();

console.log("Testing connection to:", process.env.DATABASE_URL?.split('@')[1] || "URL not found");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        await client.connect();
        console.log("✅ Successfully connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log("Database time:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("❌ Connection failed:", err);
    }
}

testConnection();
