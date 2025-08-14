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
import { useHealthInsights } from "@/hooks/useHealthInsights";

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

  const { generateInsights } = useHealthInsights();
  
  const generateHealthInsights = async () => {
    setGeneratingInsights(true);
    try {
      await generateInsights();
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <p className="text-muted-foreground">Sign in to access your health dashboard and conversation history.</p>
        </div>
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[19rem] sm:max-w-[25rem] md:max-w-6xl">
      <div className="space-y-6 sm:space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start max-w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-grow min-w-0">
            <AvatarWithFallback 
              src={profile?.avatar_url || ""} 
              name={profile?.display_name || user.email || "User"} 
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{profile?.display_name || "Welcome"}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{user.email}</p>
              {profile?.bio && (
                <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto">
            <Button 
              onClick={generateHealthInsights} 
              disabled={generatingInsights}
              className="w-full sm:w-auto gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${generatingInsights ? 'animate-spin' : ''}`} />
              {generatingInsights ? 'Analyzing...' : 'Update Health Insights'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="flex flex-row items-start space-y-0 pb-6">
                  <div className="flex items-start gap-4 w-full">
                    <div className={`p-2 rounded-lg bg-accent flex-shrink-0`}>
                      <Icon className={`h-5 w-5 text-primary`} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{stat.title}</p>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-full">
          {/* Weekly Activity Chart */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your conversation activity over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent className="w-full overflow-hidden">
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
            <CardContent className="pt-0 pb-4 md:pb-0">
              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">No consultations yet</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">Start your first conversation to see it here</p>
                    <Button onClick={() => navigate("/")} variant="default" className="w-full sm:w-auto">
                      Start Conversation
                    </Button>
                  </div>
                ) : (
                  conversations.slice(0, 3).map((conversation) => (
                    <div 
                      key={conversation.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:text-primary cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate(`/chat/${conversation.id}`)}
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium truncate">{conversation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="default" className="flex-shrink-0">View</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights */}
        <Card>
          {profile?.health_insights ? (
            <HealthInsights 
              insights={(() => {
                try {
                  // Handle string format
                  if (typeof profile.health_insights === 'string') {
                    return JSON.parse(profile.health_insights);
                  }
                  // Handle object format
                  return profile.health_insights;
                } catch (error) {
                  console.error('Failed to parse health insights:', error);
                  return {
                    timeline: "Error displaying health insights",
                    summary: "There was an error displaying your health insights. Please try regenerating them.",
                    recommendations: ["Regenerate health insights"]
                  };
                }
              })()}
            />
          ) : (
            <>
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
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;