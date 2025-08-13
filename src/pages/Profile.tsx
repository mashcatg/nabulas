import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarWithFallback } from "@/components/users/AvatarWithFallback";
import { ProfileSkeleton } from "@/components/ui/skeletons";
import { ShiningText } from "@/components/ui/shining-text";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Clock, Phone, MessageSquare, TrendingUp, Activity } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
  const { user } = useAuth();
  const { conversations, isLoading } = useConversations();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!conversations.length) return null;
    
    const totalCalls = conversations.length;
    const totalDuration = conversations.reduce((sum, conv) => sum + (conv.duration || 0), 0);
    const avgDuration = totalDuration / totalCalls;
    
    // Weekly data for chart
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayConversations = conversations.filter(conv => {
        const convDate = new Date(conv.created_at);
        return convDate.toDateString() === date.toDateString();
      });
      
      return {
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        calls: dayConversations.length,
        duration: dayConversations.reduce((sum, conv) => sum + (conv.duration || 0), 0),
      };
    });

    return {
      totalCalls,
      totalDuration: Math.floor(totalDuration / 60), // Convert to minutes
      avgDuration: Math.floor(avgDuration / 60),
      thisWeek: conversations.filter(conv => {
        const convDate = new Date(conv.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return convDate >= weekAgo;
      }).length,
      weeklyData
    };
  }, [conversations]);

  if (isLoading) {
    return (
      <main className="py-8 px-4 md:px-6">
        <ProfileSkeleton />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="py-8 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">Your Health Dashboard</h1>
          <p className="text-muted-foreground">Sign in to see your statistics and insights.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 px-4 md:px-6 space-y-8 animate-fade-in">
      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-6">
          <AvatarWithFallback 
            name={user.user_metadata?.name || user.email || "User"} 
            src={user.user_metadata?.avatar_url} 
            className="h-20 w-20"
          />
          <div className="ml-6">
            <h1 className="text-3xl font-bold">
              {user.user_metadata?.name || "Welcome"}
            </h1>
            <p className="text-muted-foreground text-lg">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              <Activity className="mr-1 h-3 w-3" />
              Healthcare Assistant User
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCalls || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Talk Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDuration || 0}m</div>
            <p className="text-xs text-muted-foreground">
              Minutes of conversation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgDuration || 0}m</div>
            <p className="text-xs text-muted-foreground">
              Per conversation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">
              New conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your conversation pattern over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.weeklyData ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'calls' ? `${value} calls` : `${Math.floor(Number(value) / 60)}m`,
                      name === 'calls' ? 'Conversations' : 'Duration'
                    ]}
                  />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-200 flex items-center justify-center text-muted-foreground">
                <ShiningText text="Start your first conversation to see activity data" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Your latest healthcare sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.slice(0, 4).map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/chat/${conversation.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <div>
                        <p className="font-medium text-sm">{conversation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {conversation.duration && (
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(conversation.duration / 60)}m
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {conversations.length > 4 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => navigate("/")}
                  >
                    View All Conversations
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  <ShiningText text="No conversations yet" />
                </p>
                <Button onClick={() => navigate("/")}>
                  Start Your First Conversation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Health Insights</CardTitle>
          <CardDescription>Personalized recommendations based on your conversations</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.totalCalls ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Engagement Level</h4>
                <p className="text-sm text-muted-foreground">
                  You've had {stats.totalCalls} conversations with an average duration of {stats.avgDuration} minutes. 
                  Great engagement with healthcare discussions!
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="font-medium text-accent-foreground mb-2">Weekly Consistency</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.thisWeek > 0 
                    ? `You've been active this week with ${stats.thisWeek} conversations. Keep up the good health habits!`
                    : "Consider scheduling a health check-in this week to maintain your wellness routine."
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <ShiningText text="Start conversations to unlock personalized health insights" />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Profile;