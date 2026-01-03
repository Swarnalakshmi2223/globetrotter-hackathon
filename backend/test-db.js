import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'globetrotter',
});

async function testConnection() {
    try {
        console.log('Testing connection to:', process.env.DB_NAME || 'globetrotter');
        const res = await pool.query('SELECT current_database()');
        console.log('SUCCESS: Connected to', res.rows[0].current_database);
        await pool.end();
    } catch (err) {
        console.error('FAILURE: Could not connect to database');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
}

testConnection();
