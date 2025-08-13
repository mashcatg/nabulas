import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: conversationStats, isLoading: statsLoading } = useQuery({
    queryKey: ["conversation-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("conversations")
        .select("duration, created_at")
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      const totalDuration = data.reduce((sum, conv) => sum + (conv.duration || 0), 0);
      const totalConversations = data.length;
      const averageDuration = totalConversations > 0 ? Math.round(totalDuration / totalConversations) : 0;
      
      // Calculate weekly activity
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyData = data.filter(conv => new Date(conv.created_at) >= weekAgo);
      
      const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const count = weeklyData.filter(conv => {
          const convDate = new Date(conv.created_at);
          return convDate >= dayStart && convDate < dayEnd;
        }).length;
        
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          conversations: count
        };
      });
      
      return {
        totalDuration,
        totalConversations,
        averageDuration,
        weeklyActivity
      };
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `user_id=eq.${user.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["profile", user.id] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations", filter: `user_id=eq.${user.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["conversation-stats", user.id] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return { 
    profile, 
    isLoading, 
    conversationStats, 
    statsLoading,
    totalDuration: conversationStats?.totalDuration || 0,
    totalConversations: conversationStats?.totalConversations || 0,
    averageDuration: conversationStats?.averageDuration || 0,
    weeklyActivity: conversationStats?.weeklyActivity || []
  };
}