
import { LoginForm } from "@/components/login-form";
import { Workflow } from "lucide-react";

const Login = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030407] px-4 py-12 text-white">

      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(25,81,252,0.22)_0%,rgba(3,25,91,0.12)_40%,transparent_75%)]" />

      <div className="pointer-events-none absolute -left-40 top-1/3 size-[450px] rounded-full bg-blue-700/15 blur-[150px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 size-[450px] rounded-full bg-indigo-600/10 blur-[150px]" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">

        {/* Brand Identity */}
        <div className="mb-8 flex flex-col items-center text-center">

          {/* Logo */}
          <div className="relative grid size-14 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] shadow-[0_8px_40px_rgba(25,81,252,0.3)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-500/20" />

            <Workflow
              size={26}
              strokeWidth={1.7}
              className="relative z-10"
            />
          </div>

          {/* Brand Name */}
          <h1 className="mt-4 text-4xl font-normal tracking-tight">
            Saarthi<span className="text-[#5790ff]"> AI</span>
          </h1>

          {/* Tagline */}
          <p className="mt-2 text-sm tracking-wide text-zinc-400">
            Your intelligent companion
          </p>

        </div>

        {/* Authentication */}
        <div className="w-full">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-xs text-zinc-500">
          Your workspace, reimagined.
        </p>

      </div>
    </div>
  );
};

export default Login;
