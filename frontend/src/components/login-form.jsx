import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { useState } from "react";
import { login } from "@/features/auth";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }) {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    setError("");
    setNotice("");
    setIsSigningIn(true);
    try {
      if (!import.meta.env.VITE_FIREBASE_API_KEY?.trim()) {
        throw new Error(
          "Firebase is not configured: add your web app API key to frontend/.env as VITE_FIREBASE_API_KEY.",
        );
      }
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const data = await login(token);
      if (!data?.user) throw new Error("The server did not return a user profile.");
      dispatch(setUserData(data.user));
      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSigningIn(false);
    }
  };
  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="relative overflow-hidden rounded-[28px] border border-white/[0.16] bg-white/[0.07] text-white shadow-[0_25px_100px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[35px]">
        {/* Glass Reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.09] to-transparent" />

        <CardHeader className="relative flex flex-col items-center px-7 pb-3 pt-9 text-center">
          <div className="mb-5 flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[0.09] px-3 py-1.5 backdrop-blur-xl">
            <Sparkles size={13} className="text-blue-300" />

            <span className="text-[10px] font-medium tracking-[0.15em] text-blue-200">
              ONE WORKSPACE. ENDLESS POSSIBILITIES.
            </span>
          </div>

          <CardTitle className="w-full text-center text-3xl font-semibold tracking-tight">
            Welcome aboard.
          </CardTitle>

          <CardDescription className="mt-3 w-full max-w-[310px] text-center text-sm leading-6 text-zinc-300">
            Your ideas, conversations and everyday workflows, all coming
            together in one intelligent space. Let's get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative px-7 pb-9 pt-7">
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="h-12 w-full rounded-xl border border-white/70 bg-white text-sm font-medium text-zinc-900 shadow-[0_4px_25px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            <svg viewBox="0 0 48 48" className="mr-2 size-5">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.41 37.98 46.98 31.88 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.12.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.17 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>
            {isSigningIn ? "Signing in…" : "Continue with Google"}
            <ArrowUpRight className="ml-auto size-4 opacity-50" />
          </Button>

          {error && (
            <p role="alert" className="mt-3 text-center text-sm text-red-300">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-3 text-center text-sm text-green-300">
              {notice}
            </p>
          )}

          <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-zinc-200 hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-zinc-200 hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
