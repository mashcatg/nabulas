-- Add missing columns to conversations table if not present
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Conversation',
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS transcript JSONB;