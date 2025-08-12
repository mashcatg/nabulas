import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Chat = () => {
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

  const onShare = async () => {
    if (!conversationId) return;
    const { error } = await supabase
      .from("conversations")
      .update({ is_public: true })
      .eq("id", conversationId);
    if (error) {
      toast({ title: "Share failed", description: "Could not share conversation." });
    } else {
      toast({ title: "Link enabled", description: "Conversation is now public." });
      refetch();
    }
  };

  const onDelete = async () => {
    if (!conversationId) return;
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);
    if (error) {
      toast({ title: "Delete failed", description: "Could not delete conversation." });
    } else {
      toast({ title: "Conversation deleted" });
      // No redirect for now
    }
  };

  if (isLoading) return <main className="py-6">Loading...</main>;
  if (error) return <main className="py-6">Error loading conversation.</main>;
  if (!data) return <main className="py-6">Conversation not found or not accessible.</main>;

  const patient = (data.patient_report as any) || {};

  return (
    <main className="py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{data.title || "Conversation"}</h1>
        <p className="text-sm text-muted-foreground">ID: {data.id}</p>
        <div className="flex gap-2 mt-2">
          <Button variant="secondary" onClick={onShare}>Share</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-sm text-foreground/90">
                <p className="text-muted-foreground">Transcript details will appear here. Call ID: {data.vapi_call_id || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{data.summary || <span className="text-muted-foreground">No summary yet.</span>}</p>
            </CardContent>
          </Card>
        </article>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Title</div>
                <div className="text-muted-foreground">{patient.title || "—"}</div>
              </div>
              <Separator />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>Duration: {data.duration != null ? `${data.duration}s` : "—"}</div>
              <div>Assistant ID: {data.assistant_id || "—"}</div>
              <div>Created: {new Date(data.created_at).toLocaleString()}</div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
};

export default Chat;
