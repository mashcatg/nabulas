-- Fix critical medical data security issue: Remove all public access to conversations
-- Medical conversations should NEVER be publicly accessible regardless of is_public flag
DROP POLICY IF EXISTS "Authenticated users can view public conversations" ON public.conversations;

-- Ensure only conversation owners can access their own medical data
-- This is the only secure approach for protected health information
-- Note: The is_public flag is preserved but has no effect on access control for security
-- If sharing functionality is needed in the future, it should be implemented with explicit 
-- consent mechanisms and limited data exposure (not full conversation access)