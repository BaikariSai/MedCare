-- ========================================
-- MedCare Multi-Speciality Hospital
-- Supabase Database Schema
-- ========================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Navigate to: SQL Editor
-- 3. Copy and paste this ENTIRE file
-- 4. Click "RUN" to execute
-- ========================================

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  services JSONB DEFAULT '[]'::jsonb
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  department_id TEXT,
  department TEXT,
  qualification TEXT,
  experience INTEGER DEFAULT 0,
  bio TEXT,
  gender TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  availability JSONB DEFAULT '{}'::jsonb,
  consultation_fee INTEGER DEFAULT 0
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  department_id TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  department TEXT,
  date TEXT,
  time_slot TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  category TEXT,
  author TEXT,
  excerpt TEXT,
  content TEXT,
  date TEXT,
  read_time TEXT,
  featured BOOLEAN DEFAULT false
);

-- Create contact queries table
CREATE TABLE IF NOT EXISTS contact_queries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department);
CREATE INDEX IF NOT EXISTS idx_doctors_featured ON doctors(featured);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_contact_queries_status ON contact_queries(status);

-- ========================================
-- Schema creation complete!
-- Next step: Visit your app and trigger seed data
-- ========================================
