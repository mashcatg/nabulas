import { useParams, useNavigate } from "react-router-dom";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiningText } from "@/components/ui/shining-text";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MessageSkeleton, CardSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Share, Trash2, Play, AlertCircle, MessageCircle, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMemo, useState } from "react";

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  
  // Move all hooks to the top level before any conditional returns
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await supabase
        .from("conversations")
        .select("id, title, created_at, duration, assistant_id, vapi_call_id, patient_report, user_id, is_public")
        .eq("id", conversationId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      // Allow access if either:
      // 1. The conversation is public
      // 2. The user owns the conversation
      const hasAccess = data.is_public || (user && data.user_id === user.id);
      if (!hasAccess) {
        throw new Error("Access denied");
      }
      
      return {
        ...data,
        isOwner: user && data.user_id === user.id
      };
    },
  });

  const { data: vapiDetails, isLoading: vapiLoading, error: vapiError } = useQuery({
    queryKey: ["vapi-call", data?.vapi_call_id],
    enabled: !!data?.vapi_call_id,
    queryFn: async () => {
      const res = await supabase.functions.invoke("vapi-call-details", {
        body: { vapi_call_id: data!.vapi_call_id },
      });
      if (res.error) throw res.error;
      return res.data?.data;
    },
  });

  const onShare = async () => {
    if (!conversationId) return;
    try {
      const { error } = await supabase
        .from("conversations")
        .update({ is_public: true })
        .eq("id", conversationId);
      navigator.clipboard.writeText(`${window.location.origin}/chat/${conversationId}`);
      if (error) throw error;
      toast.success("Share link copied");
      refetch();
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share consultation");
    }
  };

  const onDelete = async () => {
    if (!conversationId) return;
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);
      if (error) throw error;
      toast.success("Consultation deleted successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete consultation");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 md:px-4 py-6 max-w-6xl space-y-6">
        {/* Header skeleton */}
        <header className="space-y-1 animate-fade-in">
          <Skeleton className="h-8 w-64 sm:w-80" />
          <Skeleton className="h-4 w-48 sm:w-64" />
          <div className="flex flex-wrap gap-2 mt-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </header>
          
        {/* Content skeletons */}
        <section className="grid gap-6 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <MessageSkeleton count={4} />
                <div className="mt-4 pt-4 border-t">
                  <Skeleton className="h-8 w-36" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </article>

          <aside className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
           <h1 className="text-2xl font-bold mb-2">Error Loading Consultation</h1>
           <p className="text-muted-foreground mb-4">
             There was an error loading this consultation. Please try again.
           </p>
          <Button onClick={() => navigate("/")} variant="ghost">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
           <h1 className="text-2xl font-bold mb-2">Consultation Not Found</h1>
           <p className="text-muted-foreground mb-4">
             The consultation you're looking for doesn't exist or you don't have access to it.
           </p>
          <Button onClick={() => navigate("/")} variant="ghost">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const vapi = vapiDetails || {} as any;
  const summaryText = vapi.summary || vapi.analysis?.summary;
  const messages: Array<{ role: string; message: string; time?: number }>
    = Array.isArray(vapi.messages) ? vapi.messages : [];
  const transcriptStr: string = vapi.transcript || messages.map(m => `${m.role === 'bot' ? 'AI' : 'User'}: ${m.message}`).join('\n');
  const recordingUrl: string = vapi.recordingUrl || vapi.artifact?.recording?.mono?.combinedUrl || vapi.artifact?.recording?.mono?.assistantUrl;
  const stereoUrl: string = vapi.stereoRecordingUrl || vapi.artifact?.recording?.stereoUrl;

  const AudioShell = (
    <div className="space-y-3">
      {recordingUrl && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Mono Recording</div>
          <audio controls src={recordingUrl} className="w-full" />
        </div>
      )}
      {!recordingUrl && !stereoUrl && (
        <div className="text-sm text-muted-foreground">No recording available.</div>
      )}
    </div>
  );

  const patient = (data.patient_report as any) || {};

  return (
    <main className="container mx-auto px-3 md:px-4 py-6 max-w-6xl space-y-6 overflow-hidden">
      <header className="space-y-1 animate-fade-in flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight break-words">{data.title || "Consultation"}</h1>
          <div className="flex flex-row items-center justify-start gap-2 mt-1">
            <p className="text-sm text-muted-foreground truncate">ID: {data.id}</p>
            <Copy className="h-4 w-4 cursor-pointer flex-shrink-0" onClick={() => {
              navigator.clipboard.writeText(data.id);
              toast.success("Consultation ID copied");
            }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-2">
          {data.isOwner && (
            <>
              <Button variant="secondary" size="sm" onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" size="sm" className="text-red-600 bg-red-50 hover:bg-red-200">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                 <AlertDialogTitle>Delete Consultation</AlertDialogTitle>
                 <AlertDialogDescription>
                   This action cannot be undone. This will permanently delete this consultation and its associated data.
                 </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </>
          )}
          {(recordingUrl || stereoUrl) && (
            isMobile ? (
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Play Recording
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Call Recording</DrawerTitle>
                    <DrawerDescription>Listen to the audio from this consultation.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">{AudioShell}</div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Play Recording
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Call Recording</DialogTitle>
                    <DialogDescription>Listen to the audio from this consultation.</DialogDescription>
                  </DialogHeader>
                  {AudioShell}
                </DialogContent>
              </Dialog>
            )
          )}
          {!data.isOwner && (
            <>
              {(recordingUrl || stereoUrl) && (
                isMobile ? (
                  <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Play Recording
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Call Recording</DrawerTitle>
                        <DrawerDescription>Listen to the audio from this consultation.</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">{AudioShell}</div>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Play Recording
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Call Recording</DialogTitle>
                        <DialogDescription>Listen to the audio from this consultation.</DialogDescription>
                      </DialogHeader>
                      {AudioShell}
                    </DialogContent>
                  </Dialog>
                )
              )}
              <Button variant="secondary" size="sm" disabled>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </>
          )}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-6">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transcript</CardTitle>
              {transcriptStr && (
                <div className="">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(transcriptStr);
                        toast.success("Transcript copied");
                      } catch {
                        toast.error("Could not copy transcript");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {vapiLoading ? (
                <MessageSkeleton count={4} />
              ) : messages.length ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.filter(m => m.role === 'user' || m.role === 'bot').map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`px-3 py-2 rounded-lg text-sm max-w-[90%] break-words ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      <div className="opacity-70 text-xs mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</div>
                      <div className="leading-relaxed break-words">{m.message}</div>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Transcript details will appear here</p>
                  <p className="text-xs text-muted-foreground mt-2">Call ID: {data.vapi_call_id || "—"}</p>
                </div>
              )}
              
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryText ? (
                <p className="text-sm leading-relaxed">{summaryText}</p>
              ) : (
                <div className="text-center py-6">
                  <div className="text-sm text-muted-foreground">
                    <ShiningText text="Generating Summary..." />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </article>

        <aside className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Patient Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!summaryText ? (
                <div className="text-center py-6">
                  <div className="text-muted-foreground">
                    <ShiningText text="Generating patient report..." />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-medium mb-1">Title</div>
                    <div className="text-muted-foreground">{patient.title || "—"}</div>
                  </div>
                  <Separator />
                  {Array.isArray(patient.key_points) && patient.key_points.length > 0 && (
                    <>
                      <div>
                        <div className="font-medium mb-2">Key Points</div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {patient.key_points.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div>
                    <div className="font-medium mb-2">Detected Symptoms</div>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {(patient.symptoms || []).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                      {!patient.symptoms?.length && <li className="list-none">—</li>}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium mb-2">AI Recommendations</div>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {(patient.ai_recommendations || []).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                      {!patient.ai_recommendations?.length && <li className="list-none">—</li>}
                    </ul>
                  </div>
                  {Array.isArray(patient.risks) && patient.risks.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="font-medium mb-2">Risks</div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {patient.risks.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </>
                  )}
                  {Array.isArray(patient.actions) && patient.actions.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="font-medium mb-2">Actions</div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {patient.actions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </>
                  )}
                  {Array.isArray(patient.follow_up_questions) && patient.follow_up_questions.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="font-medium mb-2">Follow-up Questions</div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {patient.follow_up_questions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{vapi.status || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>
                  {(() => {
                  let seconds = data.duration ?? 
                    (vapi.startedAt && vapi.endedAt ? 
                    Math.round((new Date(vapi.endedAt).getTime() - new Date(vapi.startedAt).getTime())/1000) : 
                    null);
                  
                  if (seconds == null) return "—";
                  
                  const hours = Math.floor(seconds / 3600);
                  const minutes = Math.floor((seconds % 3600) / 60);
                  seconds = seconds % 60;
                  
                  const parts = [];
                  if (hours > 0) parts.push(`${hours}h`);
                  if (minutes > 0) parts.push(`${minutes}m`);
                  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
                  
                  return parts.join(' ');
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assistant ID:</span>
                <span className="truncate ml-2 min-w-0">{data.assistant_id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-right ml-2">{new Date(data.created_at).toLocaleDateString()}</span>
              </div>
              
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
};

export default Chat;