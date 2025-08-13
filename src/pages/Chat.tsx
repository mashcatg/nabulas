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
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          {/* Content skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
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

  const isMobile = useIsMobile();
  const vapi = vapiDetails || {} as any;
  const summaryText = vapi.summary || vapi.analysis?.summary || data.summary;
  const messages: Array<{ role: string; message: string; time?: number }>
    = Array.isArray(vapi.messages) ? vapi.messages : [];
  const transcriptStr: string = vapi.transcript || messages.map(m => `${m.role === 'bot' ? 'AI' : 'User'}: ${m.message}`).join('\n');
  const recordingUrl: string = vapi.recordingUrl || vapi.artifact?.recording?.mono?.combinedUrl || vapi.artifact?.recording?.mono?.assistantUrl;
  const stereoUrl: string = vapi.stereoRecordingUrl || vapi.artifact?.recording?.stereoUrl;

  const [open, setOpen] = useState(false);
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
    <main className="py-6 space-y-6">
      <header className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight">{data.title || "Conversation"}</h1>
        <p className="text-sm text-muted-foreground">ID: {data.id}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button variant="secondary" onClick={onShare}>Share</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
          {(recordingUrl || stereoUrl) && (
            isMobile ? (
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button>Play Recording</Button>
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
                  <Button>Play Recording</Button>
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

      <section className="grid gap-6 md:grid-cols-3">
        <article className="md:col-span-2 space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {vapiLoading ? (
                <MessageSkeleton count={4} />
              ) : messages.length ? (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`px-3 py-2 rounded-md text-sm max-w-[80%] ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        <div className="opacity-70 text-xs mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</div>
                        <div>{m.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prose max-w-none text-sm text-foreground/90">
                  <p className="text-muted-foreground">Transcript details will appear here. Call ID: {data.vapi_call_id || "—"}</p>
                </div>
              )}
              {transcriptStr && (
                <div className="mt-4">
                  <Button
                    variant="outline"
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
                <p className="text-sm leading-6">{summaryText}</p>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <ShiningText text="HextaAI is thinking..." />
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
            <CardContent className="space-y-3 text-sm">
              {!summaryText ? (
                <div className="text-muted-foreground">
                  <ShiningText text="Generating patient report..." />
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-medium">Title</div>
                    <div className="text-muted-foreground">{patient.title || "—"}</div>
                  </div>
                  <Separator />
                  {Array.isArray(patient.key_points) && patient.key_points.length > 0 && (
                    <div>
                      <div className="font-medium">Key Points</div>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {patient.key_points.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">Detected Symptoms</div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {(patient.symptoms || []).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                      {!patient.symptoms && <li className="list-none text-muted-foreground">—</li>}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">AI Recommendations</div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {(patient.ai_recommendations || []).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                      {!patient.ai_recommendations && <li className="list-none text-muted-foreground">—</li>}
                    </ul>
                  </div>
                  {Array.isArray(patient.risks) && (
                    <div>
                      <div className="font-medium">Risks</div>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {patient.risks.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(patient.actions) && (
                    <div>
                      <div className="font-medium">Actions</div>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {patient.actions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(patient.follow_up_questions) && (
                    <div>
                      <div className="font-medium">Follow-up Questions</div>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {patient.follow_up_questions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>Status: {vapi.status || "—"}</div>
              <div>Duration: {data.duration != null ? `${data.duration}s` : (vapi.startedAt && vapi.endedAt ? `${Math.round((new Date(vapi.endedAt).getTime() - new Date(vapi.startedAt).getTime())/1000)}s` : "—")}</div>
              <div>Assistant ID: {data.assistant_id || vapi.assistantId || "—"}</div>
              <div>Created: {new Date(data.created_at).toLocaleString()}</div>
              {vapi.cost && <div>Vapi Cost: ${vapi.cost}</div>}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
};

export default Chat;
