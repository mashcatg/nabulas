import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Chat = () => {
  const { conversationId } = useParams();

  return (
    <main className="py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Conversation</h1>
        <p className="text-sm text-muted-foreground">ID: {conversationId}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-sm text-foreground/90">
                <p className="text-muted-foreground">Real-time transcript will appear here after calls. We’ll render word-by-word with timestamps.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Key highlights and a concise summary of the conversation.</p>
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
                <div className="text-muted-foreground">Report title from DeepSeek</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">Detected Symptoms</div>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Example symptom</li>
                  <li>Another symptom</li>
                </ul>
              </div>
              <div>
                <div className="font-medium">AI Recommendations</div>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Recommendation one</li>
                  <li>Recommendation two</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>Duration: —</div>
              <div>Assistant ID: —</div>
              <div>Created: —</div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
};

export default Chat;
