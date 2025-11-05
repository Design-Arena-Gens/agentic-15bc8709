/* eslint-disable @next/next/no-img-element */
"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bot,
  Check,
  CheckCheck,
  Flame,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Video,
  Zap,
} from "lucide-react";

type Presence = "online" | "away" | "offline";

type Contact = {
  id: string;
  name: string;
  title: string;
  statusLine: string;
  presence: Presence;
  avatar: string;
  accent: string;
  badge: string;
  unread: number;
  pinned?: boolean;
  lastInteraction: number;
};

type MessageStatus = "sending" | "sent" | "delivered" | "read";

type Message = {
  id: string;
  from: "me" | "contact";
  text: string;
  createdAt: number;
  status?: MessageStatus;
  highlight?: boolean;
};

const now = Date.now();
const minutesAgo = (minutes: number) => now - minutes * 60 * 1000;

const CONTACTS: Contact[] = [
  {
    id: "nova",
    name: "Nova Lens",
    title: "Spatial Product Designer",
    statusLine: "Sketching out a holographic journey",
    presence: "online",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
    accent: "from-indigo-500 via-sky-500 to-cyan-400",
    badge: "Flow Architect",
    unread: 0,
    pinned: true,
    lastInteraction: minutesAgo(2),
  },
  {
    id: "kai",
    name: "Kai Mercer",
    title: "AI Story Director",
    statusLine: "Scoring a cinematic reply sequence",
    presence: "away",
    avatar:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=160&q=80",
    accent: "from-rose-500 via-purple-500 to-indigo-500",
    badge: "Cinematic",
    unread: 4,
    pinned: true,
    lastInteraction: minutesAgo(47),
  },
  {
    id: "sol",
    name: "Solstice Vega",
    title: "Community Maestro",
    statusLine: "Syncing creator spotlight rotation",
    presence: "online",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&q=80",
    accent: "from-amber-400 via-rose-500 to-red-500",
    badge: "Pulse",
    unread: 1,
    lastInteraction: minutesAgo(8),
  },
  {
    id: "orion",
    name: "Orion Wilde",
    title: "Immersive Engineer",
    statusLine: "Tuning adaptive lighting model",
    presence: "offline",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    accent: "from-emerald-400 via-teal-400 to-cyan-500",
    badge: "Lightweaver",
    unread: 0,
    lastInteraction: minutesAgo(215),
  },
  {
    id: "lyra",
    name: "Lyra Bloom",
    title: "Experience Director",
    statusLine: "Layering a sonic moodboard",
    presence: "away",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
    badge: "Vibes",
    unread: 0,
    lastInteraction: minutesAgo(820),
  },
];

const INITIAL_CONVERSATIONS: Record<string, Message[]> = {
  nova: [
    {
      id: "nova-1",
      from: "contact",
      text: "Morning! The prototype glow pass looks incredible. Want to explore mood transitions together?",
      createdAt: minutesAgo(42),
    },
    {
      id: "nova-2",
      from: "me",
      text: "Absolutely. I refined the gradient choreography overnight — it now pulses with the beat detection.",
      createdAt: minutesAgo(39),
      status: "read",
    },
    {
      id: "nova-3",
      from: "contact",
      text: "Stop, that sounds unreal. Sharing a dreamy palette to accompany the audio cues.",
      createdAt: minutesAgo(28),
      highlight: true,
    },
    {
      id: "nova-4",
      from: "me",
      text: "Receiving it now. Let me orchestrate the sequence and I’ll stream a walkthrough in 10.",
      createdAt: minutesAgo(14),
      status: "delivered",
    },
  ],
  kai: [
    {
      id: "kai-1",
      from: "contact",
      text: "Need your eyes on Act II. The cinematic pacing could use a spark.",
      createdAt: minutesAgo(210),
    },
    {
      id: "kai-2",
      from: "me",
      text: "On it. Let me weave in a crescendo before the reveal.",
      createdAt: minutesAgo(207),
      status: "read",
    },
  ],
  sol: [
    {
      id: "sol-1",
      from: "contact",
      text: "Huddle later? The community drop just hit 30k pulses.",
      createdAt: minutesAgo(18),
    },
    {
      id: "sol-2",
      from: "me",
      text: "Yes! Let’s celebrate that wave on the sunset stream.",
      createdAt: minutesAgo(17),
      status: "delivered",
    },
  ],
  orion: [
    {
      id: "orion-1",
      from: "contact",
      text: "Adaptive lighting engine now syncs with ambient BPM.",
      createdAt: minutesAgo(420),
    },
    {
      id: "orion-2",
      from: "me",
      text: "Legend. I’ll test it against the low-light scenes tonight.",
      createdAt: minutesAgo(412),
      status: "sent",
    },
  ],
  lyra: [
    {
      id: "lyra-1",
      from: "contact",
      text: "Sharing an ethereal soundscape for tomorrow’s launch.",
      createdAt: minutesAgo(1020),
    },
    {
      id: "lyra-2",
      from: "me",
      text: "Listening now — these textures are lush.",
      createdAt: minutesAgo(1012),
      status: "sent",
    },
  ],
};

const RESPONSE_BANK: Record<string, string[]> = {
  nova: [
    "Looping you in with an AR mock — you’ll feel the glow.",
    "Adding a whisper of stardust to the transitions ✨",
    "Let’s sync screens in five? I want you to hear the breathing lights.",
  ],
  kai: [
    "Story beat locked. Uploading a score that hugs the reveal.",
    "Animating the pacing now; the momentum will feel cinematic.",
    "Just dropped a storyboard with a surge at the midpoint.",
  ],
  sol: [
    "Community pulse is electric tonight. Queue the celebration!",
    "Planning spotlights for the top creators — it’s going to radiate.",
    "Lining up a gratitude wall that blossoms with reactions.",
  ],
  orion: [
    "Recalibrating the shaders to make the light breathe softer.",
    "I’ll wrap the smart dimming to your latest choreography.",
    "Dropping a micro-update: ambient lenses now auto-balance.",
  ],
  lyra: [
    "Layered in a velvet bassline to hug the twilight vibes.",
    "I’ll craft a chorus swell that lifts the entire launch.",
    "Sketching a melodic trail that fades into the outro glow.",
  ],
};

const PRESENCE_COLORS: Record<Presence, string> = {
  online: "bg-emerald-400 shadow-[0_0_0_3px] shadow-emerald-400/20",
  away: "bg-amber-400 shadow-[0_0_0_3px] shadow-amber-400/25",
  offline: "bg-slate-500 shadow-[0_0_0_3px] shadow-slate-500/20",
};

const statusIcon: Record<MessageStatus, ReactNode> = {
  sending: <CirclePing className="text-slate-400" />,
  sent: <Check className="h-4 w-4 text-slate-400" />,
  delivered: <CheckCheck className="h-4 w-4 text-sky-300" />,
  read: <CheckCheck className="h-4 w-4 text-emerald-300" />,
};

function CirclePing({ className }: { className?: string }) {
  return (
    <div className={`relative h-2.5 w-2.5 ${className ?? ""}`}>
      <div className="absolute inset-0 rounded-full bg-slate-500 opacity-60" />
      <div className="absolute inset-1 rounded-full bg-slate-300" />
    </div>
  );
}

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatRelativeTime = (timestamp: number) => {
  const delta = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < minute) return "Just now";
  if (delta < hour) return `${Math.max(1, Math.round(delta / minute))}m`;
  if (delta < day) return `${Math.max(1, Math.round(delta / hour))}h`;
  if (delta < day * 7) return `${Math.max(1, Math.round(delta / day))}d`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const hasSameDay = (a: number, b: number) => {
  const first = new Date(a);
  const second = new Date(b);

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>("nova");
  const [query, setQuery] = useState("");
  const [conversations, setConversations] =
    useState<Record<string, Message[]>>(INITIAL_CONVERSATIONS);
  const [draft, setDraft] = useState("");
  const messageViewportRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const activeMessages = conversations[activeContactId] ?? [];
  const activeContact = contacts.find((contact) => contact.id === activeContactId);

  const filteredContacts = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) {
      return contacts;
    }

    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.title.toLowerCase().includes(lowerQuery) ||
        contact.badge.toLowerCase().includes(lowerQuery),
    );
  }, [contacts, query]);

  useEffect(() => {
    if (!messageViewportRef.current) return;
    messageViewportRef.current.scrollTo({
      top: messageViewportRef.current.scrollHeight + 200,
      behavior: "smooth",
    });
  }, [activeContactId, activeMessages.length]);

  const handleSelectContact = (contactId: string) => {
    setActiveContactId(contactId);
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, unread: 0 } : contact,
      ),
    );
  };

  const pushMessage = (
    contactId: string,
    message: Message,
    options?: { setStatusAfter?: MessageStatus[] },
  ) => {
    setConversations((prev) => {
      const thread = prev[contactId] ?? [];
      return {
        ...prev,
        [contactId]: [...thread, message],
      };
    });

    if (options?.setStatusAfter?.length && message.status) {
      options.setStatusAfter.forEach((status, index) => {
        const delay = (index + 1) * 420;
        setTimeout(() => {
          setConversations((prev) => {
            const thread = prev[contactId] ?? [];
            return {
              ...prev,
              [contactId]: thread.map((entry) =>
                entry.id === message.id ? { ...entry, status } : entry,
              ),
            };
          });
        }, delay);
      });
    }
  };

  const updateContactPreview = (contactId: string, text: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              lastInteraction: Date.now(),
              statusLine: text,
            }
          : contact,
      ),
    );
  };

  const handleSendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed || !activeContact) {
      return;
    }

    const id = `local-${Date.now()}`;
    const newMessage: Message = {
      id,
      from: "me",
      text: trimmed,
      createdAt: Date.now(),
      status: "sending",
    };

    pushMessage(activeContact.id, newMessage, {
      setStatusAfter: ["sent", "delivered", "read"],
    });
    updateContactPreview(activeContact.id, trimmed);

    setDraft("");
    if (composerRef.current) {
      const textarea = composerRef.current;
      textarea.style.height = "48px";
    }

    const replies = RESPONSE_BANK[activeContact.id] ?? [
      "Appreciate you — reply queued up!",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    const delay = 1200 + Math.random() * 1200;
    const contactId = activeContact.id;

    setTimeout(() => {
      const responseMessage: Message = {
        id: `response-${Date.now()}`,
        from: "contact",
        text: reply,
        createdAt: Date.now(),
        highlight: Math.random() > 0.6,
      };
      pushMessage(contactId, responseMessage);
      updateContactPreview(contactId, reply);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === contactId && contactId !== activeContactId
            ? { ...contact, unread: contact.unread + 1 }
            : contact,
        ),
      );
    }, delay);
  };

  const handleDraftChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
    const el = event.target;
    el.style.height = "48px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const KEYBOARD_SHORTCUTS = [
    { key: "⌘K", label: "Command palette" },
    { key: "Shift ↵", label: "Add newline" },
    { key: "⌘/", label: "Summon Copilot" },
  ];

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-8 lg:px-12">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          className="absolute -top-24 right-12 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl"
          animate={{ opacity: [0.45, 0.75, 0.45], scale: [0.85, 1.1, 0.85] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-8 h-80 w-80 rounded-full bg-rose-500/25 blur-[120px]"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.08, 0.9] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid w-full gap-6 rounded-[2.3rem] border border-white/5 bg-white/[0.02] p-4 shadow-[0_40px_120px_-40px_rgba(59,130,246,0.45)] backdrop-blur-2xl sm:p-6 lg:grid-cols-[330px,1fr]"
      >
        <div className="relative flex flex-col rounded-[1.9rem] border border-white/[0.06] bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 text-lg font-semibold text-white shadow-[0_12px_35px_-12px_rgba(79,70,229,0.8)]">
                CV
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  ChatVerse
                </p>
                <h1 className="text-xl font-semibold text-slate-100">
                  Your creative messaging studio
                </h1>
              </div>
            </div>
            <button
              className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5 transition duration-300 group-hover:scale-105" />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people, energy, or threads..."
              className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              ⌘K
            </span>
          </div>

          <div className="mb-5 flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span>Flow roster</span>
            </div>
            <button className="text-slate-400 transition hover:text-white">
              Sort · Pulse
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-hidden">
            <AnimatePresence initial={false}>
              {filteredContacts.map((contact) => {
                const isActive = contact.id === activeContactId;
                const lastMessage =
                  conversations[contact.id]?.slice(-1)[0]?.text ??
                  contact.statusLine;

                return (
                  <motion.button
                    key={contact.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    onClick={() => handleSelectContact(contact.id)}
                    className={`relative flex items-center gap-4 rounded-2xl border border-transparent bg-white/[0.02] px-3 py-3 text-left transition-all duration-300 hover:bg-white/[0.05] ${
                      isActive
                        ? "border-white/20 bg-white/[0.06] shadow-[0_15px_60px_-35px_rgba(129,140,248,0.9)]"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`h-12 w-12 overflow-hidden rounded-[1.2rem] bg-gradient-to-br ${contact.accent} shadow-[0_18px_35px_-20px_rgba(129,140,248,0.9)]`}
                      >
                        <img
                          src={contact.avatar}
                          alt={`${contact.name} avatar`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border border-slate-900 ${PRESENCE_COLORS[contact.presence]}`}
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-100">
                          {contact.name}
                        </p>
                        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          {formatRelativeTime(contact.lastInteraction)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                        {lastMessage}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2">
                      {contact.unread > 0 ? (
                        <span className="inline-flex min-h-[1.4rem] min-w-[1.4rem] items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-[11px] font-semibold text-white shadow-[0_10px_40px_-20px_rgba(56,189,248,0.9)]">
                          {contact.unread}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {contact.badge}
                        </span>
                      )}
                      {contact.pinned && (
                        <span className="rounded-full border border-slate-700/60 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                          Pin
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-slate-500 to-indigo-500 text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.9)]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">
                  Copilot Studio
                </p>
                <p className="text-[11px] text-slate-400">
                  Mint instant icebreakers & moodboards
                </p>
              </div>
            </div>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_45px_-25px_rgba(56,189,248,0.9)] transition hover:brightness-110">
              <Sparkles className="h-4 w-4" />
              Summon a spark
            </button>
          </div>
        </div>

        <div className="relative flex h-full flex-col rounded-[1.9rem] border border-white/[0.05] bg-black/60 backdrop-blur-3xl">
          {activeContact ? (
            <>
              <div className="flex items-center justify-between rounded-t-[1.9rem] border-b border-white/[0.05] bg-white/[0.03] px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`h-14 w-14 overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${activeContact.accent}`}
                    >
                      <img
                        src={activeContact.avatar}
                        alt={`${activeContact.name} avatar`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border border-slate-900 ${PRESENCE_COLORS[activeContact.presence]}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">
                        {activeContact.name}
                      </h2>
                      <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">
                        {activeContact.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {activeContact.statusLine}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:brightness-125">
                    <Phone className="h-5 w-5 transition-transform duration-300 group-hover:rotate-3" />
                  </button>
                  <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:brightness-125">
                    <Video className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-3" />
                  </button>
                  <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white">
                    <MoreHorizontal className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-6 overflow-hidden px-6 pb-32 pt-6 sm:px-8">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      Signal locked
                    </div>
                    <p className="text-[11px] text-slate-500">
                      End-to-end encryption with ambience control
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Zap className="h-4 w-4 text-sky-300" />
                      2x faster sync
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Ultra low-latency delivery across all scenes
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Flame className="h-4 w-4 text-rose-300" />
                      Mood booster
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Ambient cues adapt to emotional energy
                    </p>
                  </div>
                </div>

                <div
                  ref={messageViewportRef}
                  className="flex-1 overflow-y-auto rounded-3xl border border-white/5 bg-white/[0.01] px-4 py-8 sm:px-6"
                >
                  <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <AnimatePresence initial={false}>
                      {activeMessages.map((message, index) => {
                        const showDayDivider =
                          index === 0 ||
                          !hasSameDay(
                            activeMessages[index - 1]?.createdAt ?? message.createdAt,
                            message.createdAt,
                          );

                        return (
                          <div key={message.id} className="flex flex-col gap-3">
                            {showDayDivider && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="mx-auto flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-slate-500"
                              >
                                <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                {new Date(message.createdAt).toLocaleDateString(undefined, {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                                <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                              </motion.div>
                            )}
                            <motion.div
                              initial={{
                                opacity: 0,
                                x: message.from === "me" ? 40 : -40,
                                scale: 0.98,
                              }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className={`flex w-full ${
                                message.from === "me"
                                  ? "justify-end pl-10"
                                  : "justify-start pr-10"
                              }`}
                            >
                              <div
                                className={`w-fit max-w-[80%] rounded-[1.8rem] border px-6 py-4 text-sm leading-relaxed shadow-lg ${
                                  message.from === "me"
                                    ? "border-white/10 bg-gradient-to-br from-indigo-500/30 via-sky-500/25 to-cyan-400/20 text-white shadow-[0_30px_60px_-35px_rgba(56,189,248,0.9)] backdrop-blur-xl"
                                    : "border-white/8 bg-white/[0.08] text-slate-100 backdrop-blur-xl"
                                } ${message.highlight ? "ring-2 ring-rose-400/40" : ""}`}
                              >
                                <p>{message.text}</p>
                                <div
                                  className={`mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] ${
                                    message.from === "me"
                                      ? "text-sky-200/60"
                                      : "text-slate-400/70"
                                  }`}
                                >
                                  {formatTimestamp(message.createdAt)}
                                  {message.from === "me" && message.status && (
                                    <span className="flex items-center gap-1 text-slate-200">
                                      {statusIcon[message.status]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 rounded-b-[1.9rem] border-t border-white/5 bg-white/[0.04] px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[11px]">
                    {KEYBOARD_SHORTCUTS.map((shortcut) => (
                      <span
                        key={shortcut.key}
                        className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 text-slate-400"
                      >
                        <span className="rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {shortcut.key}
                        </span>
                        {shortcut.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-end gap-3 rounded-[1.7rem] border border-white/10 bg-black/50 p-4 shadow-[0_30px_80px_-40px_rgba(56,189,248,0.8)] backdrop-blur-xl">
                    <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:brightness-125">
                      <Paperclip className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" />
                    </button>
                    <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:brightness-125">
                      <Star className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
                    </button>
                    <textarea
                      ref={composerRef}
                      rows={1}
                      value={draft}
                      placeholder="Share the next luminous idea..."
                      onChange={handleDraftChange}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-slate-100 outline-none placeholder:text-slate-500"
                      style={{ height: "48px" }}
                    />
                    <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:brightness-125">
                      <Smile className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" />
                    </button>
                    <button className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:-translate-y-0.5 hover:brightness-125">
                      <Mic className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-[0_20px_60px_-30px_rgba(59,130,246,0.95)] transition hover:-translate-y-0.5 hover:brightness-110"
                      aria-label="Send message"
                    >
                      <Send className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.4em] text-slate-400">
                <Sparkles className="h-4 w-4 text-sky-300" />
                Choose a contact to ignite a thread
              </div>
              <p className="max-w-md text-lg text-slate-400">
                Curate a conversation, drop a melody, or spark a collaboration. ChatVerse
                keeps every exchange cinematic and deeply human.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border border-white/5 bg-white/[0.02] px-8 py-5 text-sm text-slate-400 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-slate-500">
          <Sparkles className="h-4 w-4 text-sky-300" />
          ChatVerse · Designed for Vercel surfaces
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Settings className="h-4 w-4 text-slate-500" />
          Adaptive mood engine synced
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Star className="h-4 w-4 text-amber-300" />
          Version 1.0 · Aurora Release
        </div>
      </div>
    </main>
  );
}
