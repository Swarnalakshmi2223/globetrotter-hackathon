-- GlobeTrotter Database Schema
-- PostgreSQL 12+
-- Run this file to create all tables and relationships

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS trip_activities CASCADE;
DROP TABLE IF EXISTS trip_stops CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookups during login
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. TRIPS TABLE
-- ============================================
CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  total_budget DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user trip lookups
CREATE INDEX idx_trips_user_id ON trips(user_id);

-- ============================================
-- 3. CITIES TABLE (Master Reference)
-- ============================================
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, country)
);

-- Index for fast city lookups
CREATE INDEX idx_cities_name_country ON cities(name, country);

-- ============================================
-- 4. TRIP_STOPS TABLE
-- ============================================
CREATE TABLE trip_stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  stop_order INTEGER NOT NULL,
  arrival_date DATE,
  departure_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(trip_id, stop_order)
);

-- Indexes for fast queries
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_trip_stops_trip_order ON trip_stops(trip_id, stop_order);

-- ============================================
-- 5. ACTIVITIES TABLE (Master Reference)
-- ============================================
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  default_cost DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for category filtering
CREATE INDEX idx_activities_category ON activities(category);

-- ============================================
-- 6. TRIP_ACTIVITIES TABLE
-- ============================================
CREATE TABLE trip_activities (
  id SERIAL PRIMARY KEY,
  trip_stop_id INTEGER NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  custom_name VARCHAR(200),
  description TEXT,
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category VARCHAR(50) NOT NULL,
  date DATE,
  time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast queries
CREATE INDEX idx_trip_activities_stop_id ON trip_activities(trip_stop_id);
CREATE INDEX idx_trip_activities_category ON trip_activities(category);

-- ============================================
-- TRIGGERS FOR BUDGET AUTO-CALCULATION
-- ============================================

-- Function to update trip total_budget
CREATE OR REPLACE FUNCTION update_trip_budget()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the trip_id from the stop
  UPDATE trips
  SET total_budget = (
    SELECT COALESCE(SUM(ta.cost), 0)
    FROM trip_stops ts
    LEFT JOIN trip_activities ta ON ta.trip_stop_id = ts.id
    WHERE ts.trip_id = (
      SELECT trip_id FROM trip_stops WHERE id = NEW.trip_stop_id
    )
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE id = (
    SELECT trip_id FROM trip_stops WHERE id = NEW.trip_stop_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update trip budget on activity deletion
CREATE OR REPLACE FUNCTION update_trip_budget_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the trip_id from the stop
  UPDATE trips
  SET total_budget = (
    SELECT COALESCE(SUM(ta.cost), 0)
    FROM trip_stops ts
    LEFT JOIN trip_activities ta ON ta.trip_stop_id = ts.id
    WHERE ts.trip_id = (
      SELECT trip_id FROM trip_stops WHERE id = OLD.trip_stop_id
    )
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE id = (
    SELECT trip_id FROM trip_stops WHERE id = OLD.trip_stop_id
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update budget when activity is inserted or updated
CREATE TRIGGER trigger_update_budget_insert_update
AFTER INSERT OR UPDATE ON trip_activities
FOR EACH ROW
EXECUTE FUNCTION update_trip_budget();

-- Trigger: Update budget when activity is deleted
CREATE TRIGGER trigger_update_budget_delete
AFTER DELETE ON trip_activities
FOR EACH ROW
EXECUTE FUNCTION update_trip_budget_on_delete();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample cities
INSERT INTO cities (name, country, latitude, longitude) VALUES
('Paris', 'France', 48.8566, 2.3522),
('London', 'United Kingdom', 51.5074, -0.1278),
('Tokyo', 'Japan', 35.6762, 139.6503),
('New York', 'United States', 40.7128, -74.0060),
('Barcelona', 'Spain', 41.3851, 2.1734),
('Dubai', 'United Arab Emirates', 25.2048, 55.2708),
('Rome', 'Italy', 41.9028, 12.4964),
('Bangkok', 'Thailand', 13.7563, 100.5018),
('Sydney', 'Australia', -33.8688, 151.2093),
('Amsterdam', 'Netherlands', 52.3676, 4.9041);

-- Insert sample activity types
INSERT INTO activities (name, category, description, default_cost) VALUES
-- Food
('Breakfast at local cafe', 'food', 'Traditional local breakfast', 15.00),
('Lunch at restaurant', 'food', 'Mid-range restaurant meal', 25.00),
('Dinner at fine dining', 'food', 'Upscale dining experience', 75.00),
('Street food tour', 'food', 'Local street food experience', 30.00),

-- Lodging
('Hotel night', 'lodging', '3-star hotel accommodation', 100.00),
('Hostel night', 'lodging', 'Budget hostel accommodation', 30.00),
('Airbnb night', 'lodging', 'Private apartment rental', 80.00),

-- Transport
('Airport transfer', 'transport', 'Taxi or shuttle to/from airport', 40.00),
('Metro/subway ticket', 'transport', 'Public transportation', 3.00),
('Train ticket', 'transport', 'Inter-city train', 50.00),
('Flight', 'transport', 'Domestic or international flight', 200.00),
('Rental car (day)', 'transport', 'Daily car rental', 60.00),

-- Entertainment
('Museum entry', 'entertainment', 'Museum or gallery admission', 20.00),
('Concert/show', 'entertainment', 'Live performance or event', 80.00),
('Theme park', 'entertainment', 'Amusement park entry', 100.00),
('Movie theater', 'entertainment', 'Cinema ticket', 15.00),

-- Sightseeing
('Guided city tour', 'sightseeing', 'Walking or bus city tour', 45.00),
('Landmark entry', 'sightseeing', 'Famous landmark admission', 25.00),
('Boat cruise', 'sightseeing', 'River or harbor cruise', 35.00),

-- Shopping
('Souvenirs', 'shopping', 'Local souvenirs and gifts', 50.00),
('Shopping spree', 'shopping', 'Clothes or luxury items', 200.00),

-- Other
('Travel insurance', 'other', 'Trip coverage', 50.00),
('Emergency fund', 'other', 'Buffer for unexpected costs', 100.00);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check triggers
-- SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers;

-- ============================================
-- GRANT PERMISSIONS (if using specific user)
-- ============================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO globetrotter_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO globetrotter_user;
