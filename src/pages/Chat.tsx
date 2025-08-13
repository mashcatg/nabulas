import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiningText } from "@/components/ui/shining-text";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageSkeleton, CardSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Share2, Trash2, Play, AlertCircle, MessageCircle } from "lucide-react";
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
        .select("id, title, created_at, duration, assistant_id, vapi_call_id, summary, patient_report")
        .eq("id", conversationId)
        .maybeSingle();
      if (error) throw error;
      return data;
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
      if (error) throw error;
      toast.success("Conversation shared successfully");
      refetch();
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share conversation");
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
      toast.success("Conversation deleted successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete conversation");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 sm:w-80" />
              <Skeleton className="h-4 w-48 sm:w-64" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          {/* Content skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Conversation</h1>
          <p className="text-muted-foreground mb-4">
            There was an error loading this conversation. Please try again.
          </p>
          <Button onClick={() => navigate("/profile")} variant="outline">
            Back to Profile
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
          <h1 className="text-2xl font-bold mb-2">Conversation Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The conversation you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate("/profile")} variant="outline">
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  const vapi = vapiDetails || {} as any;
  const summaryText = vapi.summary || vapi.analysis?.summary || data.summary;
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
      {stereoUrl && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Stereo Recording</div>
          <audio controls src={stereoUrl} className="w-full" />
        </div>
      )}
      {!recordingUrl && !stereoUrl && (
        <div className="text-sm text-muted-foreground">No recording available.</div>
      )}
    </div>
  );

  const patient = (data.patient_report as any) || {};

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
      <header className="space-y-1 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{data.title || "Conversation"}</h1>
        <p className="text-sm text-muted-foreground">ID: {data.id}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="secondary" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
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
                    <DrawerDescription>Listen to the audio from this conversation.</DrawerDescription>
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
                    <DialogDescription>Listen to the audio from this conversation.</DialogDescription>
                  </DialogHeader>
                  {AudioShell}
                </DialogContent>
              </Dialog>
            )
          )}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {vapiLoading ? (
                <MessageSkeleton count={4} />
              ) : messages.length ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] sm:max-w-[80%] ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        <div className="opacity-70 text-xs mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</div>
                        <div className="leading-relaxed">{m.message}</div>
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
              {transcriptStr && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(transcriptStr);
                        toast.success("Transcript copied to clipboard");
                      } catch {
                        toast.error("Could not copy transcript");
                      }
                    }}
                  >
                    Copy Full Transcript
                  </Button>
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
                    <ShiningText text="HextaAI is thinking..." />
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
                <span>{data.duration != null ? `${data.duration}s` : (vapi.startedAt && vapi.endedAt ? `${Math.round((new Date(vapi.endedAt).getTime() - new Date(vapi.startedAt).getTime())/1000)}s` : "—")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assistant ID:</span>
                <span className="truncate ml-2">{data.assistant_id || vapi.assistantId || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-right ml-2">{new Date(data.created_at).toLocaleDateString()}</span>
              </div>
              {vapi.cost && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vapi Cost:</span>
                  <span>${vapi.cost}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
};

export default Chat;