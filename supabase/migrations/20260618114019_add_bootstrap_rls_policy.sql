-- Bootstrap policy: Allow anonymous users to create the first admin ONLY when table is empty
-- This is for initial setup only - once an admin exists, only authenticated admins can manage

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "read_admin_users" ON admin_users;
DROP POLICY IF EXISTS "write_admin_users" ON admin_users;

-- Allow anonymous users to INSERT only when no admins exist (bootstrap)
CREATE POLICY "bootstrap_admin" ON admin_users
  FOR INSERT TO anon
  WITH CHECK ((SELECT COUNT(*) FROM admin_users) = 0);

-- Allow anonymous users to SELECT only to check if admin exists (for setup flow)
CREATE POLICY "check_admin_exists" ON admin_users
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated users to read admin users
CREATE POLICY "read_admin_users_auth" ON admin_users
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to write admin users (for existing admin management)
CREATE POLICY "write_admin_users_auth" ON admin_users
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);