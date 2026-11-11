import { useState } from "react";
import { ArrowLeft, Bot, Check, Sparkles, Workflow } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createAgent } from "@/features/agent";

const availableTools = [
  { id: "web-search", name: "Web search", description: "Find up-to-date information online." },
];

export default function CreateAgent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleTool = (toolId) => {
    setSelectedTools((current) =>
      current.includes(toolId)
        ? current.filter((id) => id !== toolId)
        : [...current, toolId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || !instructions.trim()) {
      setError("Add an agent name and instructions before creating it.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await createAgent({
        name: trimmedName,
        description: description.trim(),
        instructions: instructions.trim(),
        tools: selectedTools,
      });
      navigate("/agents");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create your agent. Please try again."
      );
      setIsSaving(false);
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
        <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-tight">
          <Workflow size={19} className="text-[#5790ff]" />
          Saarthi <span className="-ml-2 text-[#5790ff]">AI</span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-2xl pb-12 pt-12 sm:pt-16">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3781fc]/20 bg-[#1951fc]/[0.08] px-3 py-1.5 text-xs tracking-wide text-[#9acbff]">
            <Sparkles size={13} />
            CUSTOMIZE YOUR WORKSPACE
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create an agent</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Give your agent a purpose, clear instructions, and the tools it can use.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-[26px] border border-white/[0.12] bg-[#111725]/80 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-8"
        >
          <div className="space-y-2">
            <label htmlFor="agent-name" className="text-sm font-medium text-zinc-200">
              Agent name <span className="text-[#77c1fc]">*</span>
            </label>
            <input
              id="agent-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              placeholder="e.g. Research assistant"
              required
              className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#5790ff]/60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="agent-description" className="text-sm font-medium text-zinc-200">
              Description
            </label>
            <input
              id="agent-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={160}
              placeholder="What should this agent help with?"
              className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#5790ff]/60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="agent-instructions" className="text-sm font-medium text-zinc-200">
              Instructions <span className="text-[#77c1fc]">*</span>
            </label>
            <textarea
              id="agent-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              maxLength={4000}
              rows={5}
              required
              placeholder="Describe the agent's role, tone, and how it should approach tasks..."
              className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#5790ff]/60"
            />
            <p className="text-right text-xs text-zinc-600">{instructions.length}/4000</p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-zinc-200">Tools</legend>
            <p className="mb-3 mt-1 text-xs text-zinc-500">Choose which tools this agent can use.</p>
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleTool(tool.id)}
                    className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2.5 text-left transition ${
                      isSelected
                        ? "border-[#5790ff]/50 bg-[#1951fc]/10"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`grid size-6 shrink-0 place-items-center rounded-full ${isSelected ? "bg-[#1951fc]/20 text-[#8fc4ff]" : "bg-white/[0.05] text-zinc-500"}`}>
                      {isSelected ? <Check size={16} /> : <Bot size={16} />}
                    </span>
                    <span className="text-sm text-zinc-200">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5790ff] px-5 text-sm font-medium text-white transition hover:bg-[#3781fc] disabled:cursor-wait disabled:opacity-60"
            >
              <Bot size={16} />
              {isSaving ? "Creating…" : "Create agent"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
