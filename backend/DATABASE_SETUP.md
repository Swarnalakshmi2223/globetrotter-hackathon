# Database Setup Guide

## Prerequisites

1. **PostgreSQL installed** (version 12 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name globetrotter-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres`

2. **Create database**:
   ```sql
   CREATE DATABASE globetrotter;
   ```

## Configuration

1. **Update `.env` file** in `/backend` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   DB_NAME=globetrotter
   ```

## Initialize Database

**From the `backend` directory**, run:

```bash
npm run db:init
```

This will:
- Drop all existing tables (if any)
- Create all 6 tables with proper relationships
- Create indexes for performance
- Set up triggers for automatic budget calculation
- Insert seed data for cities and activities

## What Gets Created

### Tables:
1. **users** - User accounts
2. **trips** - User trips with budget tracking
3. **cities** - Master city list (10 sample cities)
4. **trip_stops** - Cities in each trip
5. **activities** - Master activity types (25 sample activities)
6. **trip_activities** - Activities per stop with costs

### Seed Data:

**Cities** (10):
- Paris, France
- London, UK
- Tokyo, Japan
- New York, USA
- Barcelona, Spain
- Dubai, UAE
- Rome, Italy
- Bangkok, Thailand
- Sydney, Australia
- Amsterdam, Netherlands

**Activities** (25) across categories:
- Food (4 types)
- Lodging (3 types)
- Transport (5 types)
- Entertainment (4 types)
- Sightseeing (3 types)
- Shopping (2 types)
- Other (4 types)

## Verify Installation

Run these SQL queries to verify:

```sql
-- Check all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count cities
SELECT COUNT(*) FROM cities;

-- Count activities
SELECT COUNT(*) FROM activities;

-- Check triggers
SELECT trigger_name, event_object_table FROM information_schema.triggers;
```

## Test Connection

From backend directory:
```bash
node -e "import('./src/config/init.js').then(m => m.testConnection())"
```

## Troubleshooting

### Connection refused
- Ensure PostgreSQL is running
- Check `DB_HOST` and `DB_PORT` in `.env`

### Authentication failed
- Verify `DB_USER` and `DB_PASSWORD` in `.env`
- Check PostgreSQL user permissions

### Database does not exist
- Create database: `CREATE DATABASE globetrotter;`

### Permission denied
- Grant permissions:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE globetrotter TO postgres;
  ```

## Manual Setup (Alternative)

If `npm run db:init` doesn't work, you can manually run the SQL:

```bash
psql -U postgres -d globetrotter -f src/config/schema.sql
```

## Next Steps

✅ Database initialized
⏩ Start backend server: `npm run dev`
⏩ Create your first user via API
⏩ Start planning trips!
