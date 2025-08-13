import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useConversations } from "@/hooks/useConversations";
import { ProfileSkeleton } from "@/components/ui/skeletons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarWithFallback } from "@/components/users/AvatarWithFallback";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { HealthInsights } from "@/components/ui/health-insights";
import { Clock, MessageCircle, TrendingUp, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, isLoading, totalDuration, totalConversations, averageDuration, weeklyActivity } = useProfile();
  const { conversations } = useConversations();
  const [generatingInsights, setGeneratingInsights] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  const generateHealthInsights = async () => {
    if (!user) return;
    
    setGeneratingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-analysis', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      toast.success("Health insights updated successfully!");
      // Refresh the profile data
      window.location.reload();
    } catch (error) {
      console.error('Error generating health insights:', error);
      toast.error("Failed to generate health insights. Please try again.");
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <p className="text-muted-foreground">Sign in to access your health dashboard and conversation history.</p>
      </div>
    );
  }

  // Ensure weeklyActivity is an array before reducing
const weeklyActivityCount = Array.isArray(weeklyActivity) 
  ? weeklyActivity.reduce((sum, day) => sum + (day?.conversations || 0), 0)
  : 0;

const stats = [
    {
      title: "Total Conversations",
      value: totalConversations.toString(),
      description: "Healthcare consultations",
      icon: MessageCircle,
      color: "text-blue-600"
    },
    {
      title: "Total Talk Time",
      value: formatDuration(totalDuration),
      description: "Time spent in conversations",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Average Session",
      value: formatDuration(averageDuration),
      description: "Average conversation length",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "This Week",
      value: weeklyActivity.reduce((sum, day) => sum + day.conversations, 0).toString(),
      description: "Conversations this week",
      icon: RefreshCw,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex items-center gap-4">
            <AvatarWithFallback 
              src={profile?.avatar_url || ""} 
              name={profile?.display_name || user.email || "User"} 
              className="h-16 w-16"
            />
            <div>
              <h1 className="text-3xl font-bold">{profile?.display_name || "Welcome"}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {profile?.bio && (
                <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <Button 
              onClick={generateHealthInsights} 
              disabled={generatingInsights}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${generatingInsights ? 'animate-spin' : ''}`} />
              {generatingInsights ? 'Analyzing...' : 'Update Health Insights'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your conversation activity over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar 
                      dataKey="conversations" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Your latest healthcare consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground mb-4">Start your first conversation to see it here</p>
                    <Button onClick={() => navigate("/")} variant="outline">
                      Start Conversation
                    </Button>
                  </div>
                ) : (
                  conversations.slice(0, 5).map((conversation) => (
                    <div 
                      key={conversation.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/chat/${conversation.id}`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{conversation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">View</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights */}
        {profile?.health_insights ? (
          <HealthInsights insights={profile.health_insights as any} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Health Insights</CardTitle>
              <CardDescription>AI-powered analysis of your conversation history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No health insights yet</h3>
                <p className="text-muted-foreground mb-4">
                  {conversations.length === 0 
                    ? "Start having conversations to get personalized health insights."
                    : "Generate AI-powered health insights from your conversation history."
                  }
                </p>
                {conversations.length > 0 && (
                  <Button 
                    onClick={generateHealthInsights} 
                    disabled={generatingInsights}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${generatingInsights ? 'animate-spin' : ''}`} />
                    {generatingInsights ? 'Analyzing...' : 'Generate Insights'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;