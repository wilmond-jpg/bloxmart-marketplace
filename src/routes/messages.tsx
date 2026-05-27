import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { conversations as seedConversations, type Conversation, type Message } from "@/data/conversations";
import { useAuth } from "@/context/AuthContext";
import { Send, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — BloxMart" },
      { name: "description", content: "Chat with buyers and sellers on BloxMart." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { isLoggedIn } = useAuth();
  const [convos, setConvos] = useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = useState<string | null>(seedConversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-3">Log in to view messages</h1>
        <p className="text-zinc-500 mb-6">You need an account to chat with other traders.</p>
        <Link to="/login" className="inline-block bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 px-6 rounded-lg ring-1 ring-brand-red">
          Log in
        </Link>
      </div>
    );
  }

  const active = convos.find((c) => c.id === activeId);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      from: "me",
      text: draft.trim(),
      time: "Just now",
    };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text } : c
      )
    );
    setDraft("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Messages</h1>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar */}
        <aside className={`border-r border-zinc-800 overflow-y-auto ${active && "hidden md:block"}`}>
          {convos.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-4 py-4 flex items-start gap-3 border-b border-zinc-800/50 transition-colors ${
                c.id === activeId ? "bg-zinc-800/50" : "hover:bg-zinc-900/50"
              }`}
            >
              <div className="relative shrink-0">
                <div className="size-10 rounded-full grid place-items-center text-white font-bold text-sm" style={{ backgroundColor: c.avatarColor }}>
                  {c.username.slice(0, 1)}
                </div>
                {c.online && <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-surface" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{c.username}</span>
                  {c.unread > 0 && (
                    <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5 rounded-full font-bold">{c.unread}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* Thread */}
        {active ? (
          <div className={`flex flex-col ${!active && "hidden md:flex"}`}>
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-zinc-800">
              <button onClick={() => setActiveId(null)} className="md:hidden p-1 -ml-1 text-zinc-400">
                <ArrowLeft className="size-5" />
              </button>
              <div className="size-9 rounded-full grid place-items-center text-white font-bold text-sm" style={{ backgroundColor: active.avatarColor }}>
                {active.username.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{active.username}</div>
                <div className="text-[11px] text-zinc-500">{active.online ? "Online" : "Offline"}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    m.from === "me"
                      ? "bg-brand-red text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                  }`}>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/60" : "text-zinc-500"}`}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="border-t border-zinc-800 p-3 sm:p-4 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2.5 px-4 focus:outline-none focus:ring-brand-red/50"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="size-10 grid place-items-center rounded-lg bg-brand-red hover:bg-brand-red-hover disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden md:grid place-items-center text-zinc-500 text-sm">Select a conversation to start chatting.</div>
        )}
      </div>
    </div>
  );
}
