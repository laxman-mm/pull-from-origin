
-- Fix the infinite recursion issue in RLS policies by using security definer functions
-- and update the profiles table structure

-- First, create a security definer function to check current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Recreate admin policies using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Update the set_user_as_admin function to handle both existing and new profiles
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- First try to update existing profile
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  -- If no profile exists, create one with the user data from auth.users
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    SELECT au.id, au.email, COALESCE(au.raw_user_meta_data->>'full_name', ''), 'admin'
    FROM auth.users au
    WHERE au.email = user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user statistics for admin dashboard
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON AS $$
DECLARE
  user_count INTEGER;
  recipe_count INTEGER;
  category_count INTEGER;
  comment_count INTEGER;
BEGIN
  -- Only allow admins to call this function
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT COUNT(*) INTO user_count FROM public.profiles;
  SELECT COUNT(*) INTO recipe_count FROM public.receipes WHERE published_at IS NOT NULL;
  SELECT COUNT(*) INTO category_count FROM public.categories WHERE published_at IS NOT NULL;
  SELECT COUNT(*) INTO comment_count FROM public.comments;

  RETURN json_build_object(
    'totalUsers', user_count,
    'totalRecipes', recipe_count,
    'totalCategories', category_count,
    'totalComments', comment_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get all users for admin management
CREATE OR REPLACE FUNCTION public.get_all_users_for_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Only allow admins to call this function
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.role, p.created_at, p.updated_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update user roles (admin only)
CREATE OR REPLACE FUNCTION public.update_user_role(user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  -- Only allow admins to call this function
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Validate role
  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be either "user" or "admin".';
  END IF;

  UPDATE public.profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to handle cases where it might be called multiple times
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
