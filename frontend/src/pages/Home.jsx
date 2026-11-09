import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAllAgent } from "@/features/agent";
import { logout } from "@/features/auth";
import { chat as sendChat } from "@/features/chat";
import { auth } from "@/firebase";
import { clearUserData, setUserData } from "@/redux/userSlice";

const suggestions = [
  "Help me plan my week",
  "Draft a professional email",
  "Research the latest AI trends",
];

const getMessageText = (content) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .filter(Boolean)
      .join("\n");
  }
  return "";
};

export default function Home() {
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const promptRef = useRef(null);

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [error, setError] = useState("");
  const tokenUsage = user?.tokenUsage;
  const tokensRemaining = tokenUsage?.remaining ?? 0;
  const tokenLimit = tokenUsage?.limit ?? 100_000;
  const tokensUsed = tokenUsage?.used ?? 0;
  const isOutOfTokens = tokensRemaining <= 0;

  useEffect(() => {
    let isCurrent = true;

    getAllAgent()
      .then(({ allAgent }) => {
        if (!isCurrent) return;
        setAgents(allAgent);
      })
      .catch((err) => {
        if (isCurrent) {
          setError(
            err.response?.data?.message || "Unable to load your agents. Please try again."
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const textarea = promptRef.current;
    if (!textarea) return;

    textarea.style.height = "32px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [prompt]);

  const handleLogout = async () => {
    setError("");
    setIsSigningOut(true);

    try {
      await logout();
      await signOut(auth);
      dispatch(clearUserData());
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to sign out. Please try again."
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = prompt.trim();

    if (!question || isSearching) return;

    setHasStarted(true);
    setMessages((current) => [...current, { role: "user", content: question }]);
    setPrompt("");
    setIsSearching(true);
    setError("");

    try {
      const response = await sendChat(question, selectedAgent?.id);
      dispatch(setUserData({ ...user, tokenUsage: response.tokenUsage }));
      const answer = getMessageText(response.aiMessage);
      if (!answer) {
        throw new Error("The assistant returned an empty response. Please try again.");
      }
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch (err) {
      if (err.response?.data?.tokenUsage) {
        dispatch(setUserData({ ...user, tokenUsage: err.response.data.tokenUsage }));
      }
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to get a response. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestion = (value) => {
    setPrompt(value);
    promptRef.current?.focus();
  };

  const startNewChat = () => {
    setMessages([]);
    setHasStarted(false);
    setError("");
    setPrompt("");
  };

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-[#030407] text-white">
      {/* Ambient Saarthi lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(25,81,252,0.18)_0%,rgba(3,25,91,0.12)_38%,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[420px] rounded-full bg-blue-700/10 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-indigo-600/10 blur-[150px]" />

      <header className="relative z-30 mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-5 py-6 sm:px-10">
        <button
          type="button"
          onClick={startNewChat}
          className="flex items-center gap-3"
          aria-label="Saarthi AI home"
        >
          <div className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_0_25px_rgba(25,81,252,0.18)]">
            <Workflow className="text-[#5790ff]" size={20} />
          </div>
          <span className="text-lg font-medium tracking-tight">
            Saarthi <span className="text-[#5790ff]">AI</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          {hasStarted && (
            <Button
              type="button"
              variant="ghost"
              className="text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              onClick={startNewChat}
            >
              New chat
            </Button>
          )}

          {/* User icon opens the account menu; sign out lives inside it. */}
          <div className="relative">
            <button
              type="button"
              aria-label="Open account menu"
              aria-expanded={profileMenuOpen}
              onClick={() => {
                setProfileMenuOpen((open) => !open);
                setAgentMenuOpen(false);
              }}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:border-[#5790ff]/50 hover:bg-[#1951fc]/15 hover:text-white"
            >
              <UserRound size={19} />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/95 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <div className="border-b border-white/[0.07] px-3 py-3">
                  <p className="truncate text-sm font-medium text-white">
                    {user?.username || "Your account"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">Saarthi AI account</p>
                </div>

                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate("/agents");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Bot size={16} className="text-zinc-500" />
                    My Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate("/agents/new");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Plus size={16} className="text-zinc-500" />
                    Create New Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate("/integeration");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Workflow size={16} className="text-zinc-500" />
                    Integration
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Settings size={16} className="text-zinc-500" />
                    Settings
                  </button> */}
                </div>

                <div className="border-t border-white/[0.07] pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {isSigningOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {!hasStarted ? (
        <section className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col items-center justify-center overflow-y-auto px-5 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#3781fc]/20 bg-[#1951fc]/[0.08] px-3 py-1.5 text-xs tracking-wide text-[#9acbff]">
            <Sparkles size={13} />
            YOUR INTELLIGENT WORKSPACE
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            What can I help you
            <span className="block bg-gradient-to-r from-[#77c1fc] via-[#3781fc] to-[#9bafff] bg-clip-text text-transparent">
              figure out today?
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            Ask Saarthi anything, with or without a custom agent. Bring your
            work together in one intelligent space.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestion(item)}
                className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs text-zinc-400 transition hover:border-[#3781fc]/40 hover:bg-[#1951fc]/10 hover:text-white sm:text-sm"
              >
                <span className="mr-2 text-[#77c1fc]">✧</span>
                {item}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="scrollbar-hidden relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.22em] text-[#77c1fc]/70">
              {(selectedAgent?.name || "SAARTHI AI").toUpperCase()}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-3xl rounded-br-md border border-[#3781fc]/20 bg-[#1951fc]/15 px-5 py-3.5 text-sm leading-6 text-white"
                    : "mr-auto max-w-[90%] text-sm leading-7 text-zinc-300"
                }
              >
                {message.content}
              </div>
            ))}

            {isSearching && (
              <div className="mr-auto flex items-center gap-3 text-sm text-zinc-400">
                <span className="grid size-8 place-items-center rounded-xl border border-[#3781fc]/20 bg-[#1951fc]/10 text-[#77c1fc]">
                  <Search size={16} />
                </span>
                {selectedAgent?.name || "Saarthi AI"} is looking into this
                <span className="flex gap-1">
                  <span className="size-1 animate-bounce rounded-full bg-[#77c1fc]" />
                  <span className="size-1 animate-bounce rounded-full bg-[#77c1fc] [animation-delay:120ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-[#77c1fc] [animation-delay:240ms]" />
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {error && (
        <p role="alert" className="relative z-40 mx-auto mb-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="relative z-30 w-full shrink-0 px-4 pb-3 sm:px-6 sm:pb-4">
        <div className="mx-auto w-full max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-[22px] border border-white/[0.14] bg-[#111725]/90 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.45),0_0_35px_rgba(25,81,252,0.10)] backdrop-blur-2xl transition focus-within:border-[#5790ff]/50 focus-within:shadow-[0_18px_70px_rgba(0,0,0,0.45),0_0_35px_rgba(25,81,252,0.18)]"
          >
            <textarea
              id="saarthi-prompt"
              ref={promptRef}
              value={prompt}
              disabled={isOutOfTokens}
              onChange={(event) => {
                setPrompt(event.target.value);
                event.target.style.height = "32px";
                event.target.style.height = `${Math.min(event.target.scrollHeight, 144)}px`;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={isOutOfTokens ? "Monthly token limit reached" : "Ask Saarthi anything..."}
              rows={1}
              className="max-h-36 min-h-8 w-full resize-none overflow-y-auto bg-transparent px-3 py-1 text-sm leading-6 text-white outline-none placeholder:text-zinc-500"
            />

            <div className="flex items-center justify-between px-1 pt-1">
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={agentMenuOpen}
                  onClick={() => {
                    if (agents.length === 0) return;
                    setAgentMenuOpen((open) => !open);
                    setProfileMenuOpen(false);
                  }}
                  disabled={agents.length === 0}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#3781fc]/20 bg-[#1951fc]/10 px-3 text-xs text-[#a8ceff] transition hover:border-[#5790ff]/50 hover:bg-[#1951fc]/20 disabled:cursor-default"
                >
                  <Bot size={16} />
                  <span>{selectedAgent?.name || "Saarthi AI"}</span>
                  {agents.length > 0 && <ChevronDown size={14} />}
                </button>

                {agentMenuOpen && (
                  <div className="absolute bottom-12 left-0 z-50 w-[min(300px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/[0.98] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <p className="px-3 py-2 text-[10px] font-medium tracking-[0.18em] text-zinc-500">
                      CHOOSE AN AGENT
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAgent(null);
                        setAgentMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-zinc-200 transition hover:bg-white/[0.06]"
                    >
                      <span>Saarthi AI (default)</span>
                      {!selectedAgent && <Check size={16} className="text-[#77c1fc]" />}
                    </button>
                    {agents.map((agent) => {
                      const active = selectedAgent?.id === agent.id;
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            setSelectedAgent(agent);
                            setAgentMenuOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.06]"
                        >
                          <span className="flex min-w-0 items-start gap-3">
                            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-[#3781fc]/20 bg-[#1951fc]/10 text-[#8fc4ff]">
                              <Bot size={16} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm text-zinc-200">
                                {agent.name}
                              </span>
                              <span className="mt-0.5 block text-xs text-zinc-500">
                                {agent.description}
                              </span>
                            </span>
                          </span>
                          {active && <Check size={16} className="shrink-0 text-[#77c1fc]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <span className="hidden text-[11px] text-zinc-600 sm:inline">
                Enter to send · Shift + Enter for new line
              </span>

              <button
                type="submit"
                disabled={!prompt.trim() || isSearching || isOutOfTokens}
                aria-label="Send message"
                className="grid size-10 place-items-center rounded-full bg-[#5790ff] text-white shadow-[0_0_22px_rgba(55,129,252,0.28)] transition hover:bg-[#3781fc] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowUp size={19} />
              </button>
            </div>
          </form>
          <div className="mt-2 px-1" aria-live="polite">
            <div className="flex items-center justify-between text-[10px] text-zinc-500">
              <span>
                {tokensRemaining.toLocaleString()} of {tokenLimit.toLocaleString()} tokens remaining this month
              </span>
              <span>
                Resets {tokenUsage?.resetsAt ? new Date(tokenUsage.resetsAt).toLocaleDateString() : "monthly"}
              </span>
            </div>
            <div
              className="mt-1 h-1 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Monthly token usage"
              aria-valuenow={Math.min(tokensUsed, tokenLimit)}
              aria-valuemin={0}
              aria-valuemax={tokenLimit}
            >
              <div
                className="h-full rounded-full bg-[#5790ff] transition-[width]"
                style={{ width: `${Math.min(100, (tokensUsed / tokenLimit) * 100)}%` }}
              />
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-zinc-600">
            Saarthi can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </main>
  );
}
