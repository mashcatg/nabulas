-- Add RLS policy to allow anyone to view public conversations
CREATE POLICY "Anyone can view public conversations" 
ON public.conversations 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);