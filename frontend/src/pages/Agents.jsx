import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { deleteAgent, getAllAgent } from "@/features/agent";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [confirmingId, setConfirmingId] = useState("");

  const loadAgents = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { allAgent } = await getAllAgent();
      setAgents(allAgent);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your agents. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    getAllAgent()
      .then(({ allAgent }) => {
        if (isCurrent) setAgents(allAgent);
      })
      .catch((err) => {
        if (isCurrent) {
          setError(
            err.response?.data?.message ||
              "Unable to load your agents. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");

    try {
      await deleteAgent(id);
      setAgents((currentAgents) =>
        currentAgents.filter((agent) => agent.id !== id),
      );
      setConfirmingId("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete this agent. Please try again.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030407] px-5 py-6 text-white sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(25,81,252,0.18)_0%,rgba(3,25,91,0.12)_38%,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[420px] rounded-full bg-blue-700/10 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-indigo-600/10 blur-[150px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 transition hover:border-[#5790ff]/40 hover:bg-[#1951fc]/10 hover:text-white"
        >
          <ArrowLeft size={16} />
          Return to chat
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium tracking-tight"
        >
          <Workflow size={19} className="text-[#5790ff]" />
          Saarthi <span className="-ml-2 text-[#5790ff]">AI</span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-5xl pb-12 pt-12 sm:pt-16">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3781fc]/20 bg-[#1951fc]/[0.08] px-3 py-1.5 text-xs tracking-wide text-[#9acbff]">
              <Bot size={13} />
              YOUR WORKSPACE
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My agents
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              View and manage the agents you have created.
            </p>
          </div>
          <Link
            to="/agents/new"
            className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-xl bg-[#5790ff] px-4 text-sm font-medium text-white transition hover:bg-[#3781fc] sm:self-auto"
          >
            <Plus size={16} />
            Create agent
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={loadAgents}
              className="text-red-100 underline underline-offset-4 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[26px] border border-white/[0.12] bg-[#111725]/70 px-6 py-16 text-center text-sm text-zinc-400">
            Loading your agents...
          </div>
        ) : agents.length === 0 ? (
          <div className="rounded-[26px] border border-white/[0.12] bg-[#111725]/70 px-6 py-16 text-center shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-[#3781fc]/20 bg-[#1951fc]/10 text-[#8fc4ff]">
              <Bot size={22} />
            </span>
            <h2 className="mt-5 text-lg font-medium text-white">
              No agents yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              Create your first agent and it will appear here for you to manage.
            </p>
            <Link
              to="/agents/new"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5790ff] px-4 text-sm font-medium text-white transition hover:bg-[#3781fc]"
            >
              <Plus size={16} />
              Create your first agent
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => {
              const isConfirming = confirmingId === agent.id;
              const isDeleting = deletingId === agent.id;
              const createdOn = agent.createdAt
                ? new Date(agent.createdAt).toLocaleDateString()
                : null;

              return (
                <article
                  key={agent.id}
                  className="rounded-[24px] border border-white/[0.12] bg-[#111725]/80 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#3781fc]/20 bg-[#1951fc]/10 text-[#8fc4ff]">
                        <Bot size={19} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-medium text-white">
                          {agent.name}
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-zinc-400">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    {createdOn && (
                      <span className="hidden shrink-0 items-center gap-1.5 text-xs text-zinc-500 sm:inline-flex">
                        <CalendarDays size={13} />
                        {createdOn}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                    {agent.instructions}
                  </p>

                  {agent.tools.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {agent.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300"
                        >
                          {tool.replaceAll("-", " ")}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex justify-end border-t border-white/[0.08] pt-4">
                    {isConfirming ? (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-400">
                          Delete this agent?
                        </span>
                        <button
                          type="button"
                          onClick={() => setConfirmingId("")}
                          disabled={isDeleting}
                          className="text-zinc-300 transition hover:text-white disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(agent.id)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-1.5 text-red-200 transition hover:bg-red-400/15 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(agent.id)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-red-400/[0.08] hover:text-red-200"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

//3:23
