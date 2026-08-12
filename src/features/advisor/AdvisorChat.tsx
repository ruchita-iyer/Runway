import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { Icon, Bot, Send } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { answerAdvisorQuestion } from "./advisorEngine";
import { createId } from "../../lib/id";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "Am I on pace?",
  "Where's my money going?",
  "What if I spend $50 more today?",
  "How many days are left?",
  "How much have I spent so far?",
  "What's my daily budget?",
  "Am I likely to finish under budget?",
  "What's my current streak?",
];

/** Deterministic-ish rotation so the same reply doesn't always show the same 4 chips. */
function suggestionsFor(seed: number): string[] {
  const start = seed % SUGGESTIONS.length;
  return Array.from({ length: 4 }, (_, i) => SUGGESTIONS[(start + i) % SUGGESTIONS.length]);
}

export function AdvisorChat() {
  const { activeTrip } = useTripData();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "intro",
      role: "bot",
      text: activeTrip
        ? `Hey! I'm your advisor for ${activeTrip.name}. Ask me about your pace, budget, or category spend.`
        : "Start an active trip and I'll be able to answer questions about its budget and pace.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: createId("msg"), role: "user", text: trimmed };
    const reply = activeTrip
      ? answerAdvisorQuestion(activeTrip, trimmed)
      : "Start an active trip first so I have budget data to work with.";
    const botMsg: ChatMessage = { id: createId("msg"), role: "bot", text: reply };
    setMessages((m) => [...m, userMsg, botMsg]);
    setDraft("");
  };

  return (
    <AppShell withNav>
      <div className="flex items-center gap-2 px-5 pt-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-action-primary/12 text-action-primary">
          <Icon icon={Bot} size={19} />
        </span>
        <h1 className="font-display text-[20px] font-bold text-ink">Advisor</h1>
      </div>

      <div ref={listRef} className="mt-4 flex flex-col gap-3 overflow-y-auto px-5 pb-4" style={{ maxHeight: "calc(var(--app-height, 100vh) - 260px)" }}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <p
              className={
                m.role === "user"
                  ? "max-w-[78%] whitespace-pre-line rounded-2xl rounded-br-sm bg-action-primary px-4 py-2.5 text-[14px] text-white"
                  : "max-w-[78%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-surface px-4 py-2.5 text-[14px] text-ink shadow-soft"
              }
            >
              {m.text}
            </p>
          </motion.div>
        ))}

        {messages[messages.length - 1]?.role === "bot" && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestionsFor(messages.length).map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-pill border border-hairline px-3 py-1.5 text-[12px] font-medium text-slate"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-[84px] px-5 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 rounded-pill bg-surface px-2 py-2 shadow-soft"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about your budget…"
            className="flex-1 bg-transparent px-2 text-[14px] text-ink placeholder:text-slate focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-action-primary text-white disabled:opacity-40"
          >
            <Icon icon={Send} size={16} />
          </button>
        </form>
      </div>

      <BottomNav />
    </AppShell>
  );
}
