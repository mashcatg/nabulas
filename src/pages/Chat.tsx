import { useParams } from "react-router-dom";

const Chat = () => {
  const { conversationId } = useParams();
  return (
    <main className="py-8">
      <h1 className="text-3xl font-semibold mb-2">Conversation</h1>
      <p className="text-muted-foreground">ID: {conversationId}</p>
    </main>
  );
};

export default Chat;
