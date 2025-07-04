/*
  # Authentication and User Management Schema

  1. New Tables
    - `profiles` - User profiles for both artists and admins
    - `user_roles` - Role management system
    - `admin_permissions` - Admin permission system

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Secure admin-only operations

  3. Functions
    - Auto-create profile on signup
    - Role assignment functions
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('artist', 'admin', 'super_admin');

-- Create enum for admin permissions
CREATE TYPE admin_permission AS ENUM (
  'manage_events',
  'manage_users', 
  'view_analytics',
  'moderate_content',
  'system_admin'
);

-- Profiles table for all users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  artist_name text NOT NULL,
  bio text,
  instagram text,
  tiktok text,
  youtube text,
  twitter text,
  phone text,
  emergency_contact text,
  profile_image text,
  is_admin boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  profile_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'artist',
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(user_id, role)
);

-- Admin permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission admin_permission NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(user_id, permission)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
      AND is_active = true
    )
  );

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
      AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

-- Admin permissions policies
CREATE POLICY "Users can view own permissions"
  ON admin_permissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage permissions"
  ON admin_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (
    user_id,
    artist_name,
    is_admin,
    profile_complete
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'artistName', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'isAdmin')::boolean, false),
    false
  );

  -- Assign default role
  INSERT INTO user_roles (user_id, role) VALUES (
    NEW.id,
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'isAdmin')::boolean, false) THEN 'admin'::user_role
      ELSE 'artist'::user_role
    END
  );

  -- If admin, grant basic permissions
  IF COALESCE((NEW.raw_user_meta_data->>'isAdmin')::boolean, false) THEN
    INSERT INTO admin_permissions (user_id, permission) VALUES
      (NEW.id, 'manage_events'),
      (NEW.id, 'view_analytics');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('admin', 'super_admin')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check specific permission
CREATE OR REPLACE FUNCTION has_permission(permission_name admin_permission, user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_permissions 
    WHERE user_id = user_uuid 
    AND permission = permission_name
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;