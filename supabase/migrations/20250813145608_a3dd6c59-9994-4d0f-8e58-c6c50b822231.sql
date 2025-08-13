-- Fix critical security issue: Remove public access to profiles with health data
-- Replace the overly permissive policy with secure user-specific access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure policy: Users can only view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Fix critical security issue: Remove public access to medical conversations
-- Even "public" conversations contain sensitive medical data that shouldn't be publicly accessible
DROP POLICY IF EXISTS "Public can view shared conversations" ON public.conversations;

-- Create secure policy: Only authenticated users can view conversations marked as public
-- This provides a safer sharing mechanism while still protecting medical data
CREATE POLICY "Authenticated users can view public conversations" 
ON public.conversations 
FOR SELECT 
TO authenticated
USING (is_public = true);

-- Optional: Create a more restrictive policy that requires explicit user consent
-- Uncomment if you want even tighter security for medical conversations
-- DROP POLICY IF EXISTS "Authenticated users can view public conversations" ON public.conversations;
-- CREATE POLICY "Only conversation participants can view conversations" 
-- ON public.conversations 
-- FOR SELECT 
-- TO authenticated
-- USING (auth.uid() = user_id);