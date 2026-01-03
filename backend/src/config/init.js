import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize database by running schema.sql
 * WARNING: This will DROP all existing tables!
 */
export async function initDatabase() {
    try {
        console.log('🗄️  Initializing database...');

        // Read schema.sql file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        await pool.query(schema);

        console.log('✅ Database initialized successfully!');
        console.log('📊 Tables created:');
        console.log('   - users');
        console.log('   - trips');
        console.log('   - cities (with seed data)');
        console.log('   - trip_stops');
        console.log('   - activities (with seed data)');
        console.log('   - trip_activities');
        console.log('🔧 Triggers created for automatic budget calculation');

        return true;
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}

/**
 * Test database connection
 */
export async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful!');
        console.log('📅 Server time:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        try {
            await testConnection();

            console.log('\n⚠️  WARNING: This will DROP all existing tables!');
            console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

            await new Promise(resolve => setTimeout(resolve, 3000));

            await initDatabase();
            process.exit(0);
        } catch (error) {
            console.error('Failed to initialize database:', error);
            process.exit(1);
        }
    })();
}
