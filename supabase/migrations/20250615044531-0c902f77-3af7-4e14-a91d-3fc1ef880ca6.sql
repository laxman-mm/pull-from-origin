
-- Create a function to set a user as admin (to be called manually)
CREATE OR REPLACE FUNCTION set_user_as_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
