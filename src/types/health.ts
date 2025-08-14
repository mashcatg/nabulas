export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface HealthSummary {
  health_patterns: string[];
  primary_concerns: string[];
  progress: string[];
}

export interface HealthInsight {
  timeline?: TimelineEvent[];
  summary?: HealthSummary;
  recommendations?: string[];
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  health_insights: HealthInsight | null;
  created_at: string;
  updated_at: string;
}
