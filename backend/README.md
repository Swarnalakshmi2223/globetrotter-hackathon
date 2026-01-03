# GlobeTrotter Backend

Express.js API server for the GlobeTrotter trip planning application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` and update with your PostgreSQL credentials
   - Update `JWT_SECRET` to a secure random string

3. Run development server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## API Health Check
```
GET /api/health
```

## Project Structure
- `src/config/` - Database and environment configuration
- `src/controllers/` - Request handlers
- `src/middleware/` - Auth and error handling
- `src/models/` - Database models
- `src/routes/` - API route definitions
- `src/utils/` - Helper functions
