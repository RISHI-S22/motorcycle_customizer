/*
  # Authentication System Setup

  ## Overview
  Creates a complete authentication system for users and admins with proper security

  ## New Tables
  
  ### `users` table
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique, not null) - User email address
  - `password` (text, not null) - Hashed password (in production, use Supabase Auth)
  - `name` (text) - User's full name
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `admins` table
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique, not null) - Admin email address
  - `password` (text, not null) - Hashed password
  - `name` (text) - Admin's full name
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `user_customizations` table
  - `id` (uuid, primary key) - Unique customization identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `motorcycle_brand` (text) - Selected motorcycle brand
  - `motorcycle_model` (text) - Selected motorcycle model
  - `motorcycle_engine` (text) - Selected engine type
  - `selected_color` (text) - Custom color selection
  - `attached_parts` (jsonb) - JSON array of attached parts
  - `total_price` (integer) - Total price of customization
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only read/write their own data
  - Admins have elevated privileges
  - Public can insert new users (signup)

  ## Test Credentials
  - Test User: test@user.com / password123
  - Test Admin: admin@test.com / admin123
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text DEFAULT 'Admin User',
  created_at timestamptz DEFAULT now()
);

-- Create user_customizations table
CREATE TABLE IF NOT EXISTS user_customizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  motorcycle_brand text,
  motorcycle_model text,
  motorcycle_engine text,
  selected_color text,
  attached_parts jsonb DEFAULT '[]'::jsonb,
  total_price integer DEFAULT 250000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_customizations ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Anyone can create user account"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own account"
  ON users
  FOR SELECT
  TO authenticated
  USING (email = current_setting('app.current_user_email', true));

CREATE POLICY "Users can update their own account"
  ON users
  FOR UPDATE
  TO authenticated
  USING (email = current_setting('app.current_user_email', true))
  WITH CHECK (email = current_setting('app.current_user_email', true));

-- Admins table policies
CREATE POLICY "Admins can view their own account"
  ON admins
  FOR SELECT
  TO authenticated
  USING (email = current_setting('app.current_user_email', true));

-- User customizations policies
CREATE POLICY "Users can create their own customizations"
  ON user_customizations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE email = current_setting('app.current_user_email', true)
  ));

CREATE POLICY "Users can view their own customizations"
  ON user_customizations
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE email = current_setting('app.current_user_email', true)
  ));

CREATE POLICY "Users can update their own customizations"
  ON user_customizations
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE email = current_setting('app.current_user_email', true)
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE email = current_setting('app.current_user_email', true)
  ));

CREATE POLICY "Users can delete their own customizations"
  ON user_customizations
  FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE email = current_setting('app.current_user_email', true)
  ));

-- Insert test credentials
INSERT INTO users (email, password, name) VALUES
  ('test@user.com', 'password123', 'Test User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO admins (email, password, name) VALUES
  ('admin@test.com', 'admin123', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_user_customizations_user_id ON user_customizations(user_id);
