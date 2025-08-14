import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useHealthInsights() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Auto-generate insights when needed
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversation-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          try {
            await supabase.functions.invoke('health-analysis', {
              body: { userId: user.id }
            });
            queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            toast.success('Health insights updated with new conversation data');
          } catch (error) {
            console.error('Error auto-generating insights:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Function to manually generate insights
  const generateInsights = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.functions.invoke('health-analysis', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success('Health insights updated successfully!');
    } catch (error) {
      console.error('Error generating health insights:', error);
      toast.error('Failed to generate health insights. Please try again.');
    }
  };

  return {
    generateInsights
  };
}
