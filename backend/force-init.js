import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDb = async () => {
    // Connect to the default 'postgres' database
    const client = new pg.Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'postgres',
    });

    try {
        await client.connect();

        // Check if database exists
        const checkRes = await client.query("SELECT 1 FROM pg_database WHERE datname='globetrotter'");

        if (checkRes.rowCount === 0) {
            console.log("Creating database 'globetrotter'...");
            await client.query('CREATE DATABASE globetrotter');
            console.log("✅ Database 'globetrotter' created successfully!");
        } else {
            console.log("Database 'globetrotter' already exists.");
        }

        await client.end();

        // Now connect to 'globetrotter' and run the schema
        const pool = new pg.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD,
            database: 'globetrotter',
        });

        console.log("Initializing schema...");
        const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log("✅ Schema initialized successfully!");

        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to create/initialize database:', err.message);
        process.exit(1);
    }
};

createDb();
