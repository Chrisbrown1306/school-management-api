-- sql/setup.sql
-- Run this file once to create the database and table.
-- Usage: mysql -u root -p < sql/setup.sql

-- 1. Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- 2. Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id        INT           NOT NULL AUTO_INCREMENT,
    name      VARCHAR(255)  NOT NULL,
    address   VARCHAR(255)  NOT NULL,
    latitude  FLOAT         NOT NULL,
    longitude FLOAT         NOT NULL,
    PRIMARY KEY (id)
);

-- 3. (Optional) Seed some sample data so /listSchools returns results immediately
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Delhi Public School',      'Mathura Road, New Delhi, Delhi 110022',          28.5518, 77.2678),
  ('Kendriya Vidyalaya No. 1', 'IIT Campus, Powai, Mumbai, Maharashtra 400076',  19.1334, 72.9133),
  ('St. Xavier''s High School','Park Street, Kolkata, West Bengal 700016',        22.5513, 88.3537),
  ('The Cathedral School',     'CST Road, Kalina, Mumbai, Maharashtra 400098',   19.0728, 72.8826),
  ('Ryan International School','Sector 40, Gurugram, Haryana 122003',            28.4373, 77.0281);

SELECT 'Setup complete! schools table created and seeded.' AS status;
