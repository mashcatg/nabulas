-- Security Enhancement Migration
-- Fix OTP expiry to recommended threshold (reduced from default)
UPDATE auth.config SET 
  otp_exp = 300, -- 5 minutes instead of default 1 hour
  recovery_token_exp = 3600; -- 1 hour for recovery tokens

-- Enable leaked password protection
UPDATE auth.config SET 
  password_min_length = 8,
  password_require_letters = true,
  password_require_digits = true,
  password_require_symbols = false,
  password_require_uppercase = false,
  enable_leaked_password_protection = true;

-- Update existing function to set secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;