import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Meetings, made effortless.",
    name: "Smart Scheduling",
    description:
      "Tell Saarthi when you want to meet. It helps organize your calendar, schedule meetings and keep your day on track.",
    icon: CalendarDays,
    label: "01 / SCHEDULING",
  },
  {
    id: 2,
    title: "Your content. On autopilot.",
    name: "Instagram Automation",
    description:
      "Create engaging Instagram posts, plan your content and automate publishing without switching between applications.",
    icon: Camera,
    label: "02 / SOCIAL AUTOMATION",
  },
  {
    id: 3,
    title: "Intelligence with personality.",
    name: "AI Personas",
    description:
      "Create multiple AI personas with unique identities, roles, instructions and specialized capabilities.",
    icon: Users,
    label: "03 / AI PERSONAS",
  },
];

function FeatureCard({ feature, reflection = false }) {
  const Icon = feature.icon;

  return (
    <div
      aria-hidden={reflection ? true : undefined}
      className={[
        "relative min-h-[245px] overflow-hidden rounded-[24px] border p-6 sm:p-7",
        reflection
          ? "border-white/[0.07] bg-gradient-to-br from-[#111a31]/55 to-[#080b14]/55"
          : "border-white/[0.12] bg-gradient-to-br from-[#111a31]/95 via-[#0b1222]/95 to-[#080b14]/95 shadow-[0_24px_80px_rgba(0,0,0,0.42)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-8 -top-12 size-44 rounded-full bg-[#1951fc]/20 blur-[65px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 size-40 rounded-full bg-[#3781fc]/10 blur-[60px]" />

      <div className="relative flex items-center justify-between">
        <div className="grid size-12 place-items-center rounded-2xl border border-[#3781fc]/25 bg-[#1951fc]/15 text-[#9acbff] shadow-[0_0_30px_rgba(25,81,252,0.12)]">
          <Icon size={23} strokeWidth={1.6} />
        </div>
        <Sparkles size={17} className="text-[#5790ff]/60" />
      </div>

      <p className="relative mt-7 text-[10px] font-medium tracking-[0.22em] text-[#83baff]/75">
        {feature.label}
      </p>
      <h2 className="relative mt-2 max-w-[340px] text-[22px] font-medium leading-tight tracking-tight text-white sm:text-2xl">
        {feature.title}
      </h2>
      <p className="relative mt-3 max-w-[390px] text-sm leading-6 text-zinc-400">
        {feature.description}
      </p>
    </div>
  );
}

export default function Intro() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const navigatingRef = useRef(false);
  const [showSkip, setShowSkip] = useState(false);

  const goToLogin = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const cards = gsap.utils.toArray(".feature-card-shell");
      const reflections = gsap.utils.toArray(".feature-reflection");
      const particles = gsap.utils.toArray(".dust-particle");

      if (reducedMotion) {
        gsap.set(
          [".brand-content", ".intro-copy", ...cards],
          { clearProps: "all", opacity: 1, visibility: "visible" }
        );
        gsap.set(reflections, { opacity: 0.13 });
        gsap.set(".skip-button", { opacity: 1, y: 0 });
        setShowSkip(true);
        return;
      }

      gsap.set(".brand-content", { autoAlpha: 0, scale: 0.82, y: 22 });
      gsap.set(".intro-copy", { autoAlpha: 0, y: 18 });
      gsap.set(cards, {
        autoAlpha: 0,
        y: 105,
        scale: 0.72,
        rotateX: 12,
        transformPerspective: 1000,
        transformOrigin: "50% 70%",
      });
      gsap.set(reflections, { autoAlpha: 0, scaleY: 0.7 });
      gsap.set(particles, { autoAlpha: 0, scale: 0 });
      gsap.set(".skip-button", { autoAlpha: 0, y: -10 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: goToLogin,
      });

      timelineRef.current = tl;

      // 0.00–1.35s — brand reveal
      tl.to(".ambient-glow", { opacity: 1, scale: 1.15, duration: 1.1 }, 0)
        .to(
          ".brand-content",
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "back.out(1.45)",
          },
          0.18
        )
        .to({}, { duration: 0.25 }, 1.1);

      // 1.35–2.05s — the brand dissolves into electric-blue dust
      tl.addLabel("disintegrate", 1.35)
        .to(
          ".brand-content",
          {
            autoAlpha: 0,
            scale: 1.12,
            y: -8,
            filter: "blur(9px)",
            duration: 0.48,
            ease: "power2.in",
          },
          "disintegrate"
        )
        .to(
          particles,
          {
            autoAlpha: () => gsap.utils.random(0.35, 0.95),
            scale: () => gsap.utils.random(0.7, 2.2),
            x: () => gsap.utils.random(-window.innerWidth * 0.38, window.innerWidth * 0.38),
            y: () => gsap.utils.random(-window.innerHeight * 0.3, window.innerHeight * 0.3),
            rotation: () => gsap.utils.random(-180, 180),
            duration: () => gsap.utils.random(0.45, 0.8),
            stagger: { each: 0.004, from: "random" },
            ease: "power2.out",
          },
          "disintegrate+=0.02"
        )
        .to(particles, { autoAlpha: 0, duration: 0.25 }, 1.95);

      // 2.05s — introduce the capability story
      tl.to(
        ".intro-copy",
        { autoAlpha: 1, y: 0, duration: 0.55 },
        2.05
      );

      // Each card takes focus, explains the capability, then recedes.
      // Earlier cards remain visible as a quiet part of the growing deck.
      const revealCard = (index, startAt) => {
        const card = cards[index];
        const reflection = reflections[index];

        tl.addLabel(`feature-${index + 1}`, startAt)
          .to(
            card,
            {
              autoAlpha: 1,
              y: -5,
              scale: 1.045,
              rotateX: 0,
              duration: 0.48,
              ease: "back.out(1.35)",
              zIndex: 10,
            },
            `feature-${index + 1}`
          )
          .to(
            reflection,
            { autoAlpha: 0.2, scaleY: 1, duration: 0.35 },
            `feature-${index + 1}+=0.2`
          )
          .to({}, { duration: 0.85 })
          .to(card, {
            scale: 0.88,
            y: 7,
            autoAlpha: 0.72,
            duration: 0.42,
            ease: "power2.inOut",
            zIndex: 1,
          })
          .to(
            reflection,
            { autoAlpha: 0.11, duration: 0.35 },
            "<"
          );
      };

      revealCard(0, 2.55);
      revealCard(1, 4.35);
      revealCard(2, 6.15);

      // Final deck composition: all three capabilities remain visible.
      tl.addLabel("final-deck", 8.0)
        .to(cards[0], { scale: 0.88, autoAlpha: 0.68, y: 0, duration: 0.35 }, "final-deck")
        .to(cards[1], { scale: 0.96, autoAlpha: 0.9, y: -5, duration: 0.35 }, "final-deck")
        .to(cards[2], { scale: 0.88, autoAlpha: 0.68, y: 0, duration: 0.35 }, "final-deck")
        .to(reflections, { autoAlpha: 0.13, duration: 0.3 }, "final-deck")
        .to({}, { duration: 0.55 })
        .to(
          root,
          {
            autoAlpha: 0,
            scale: 0.985,
            duration: 0.45,
            ease: "power2.inOut",
          },
          9.05
        );

      // Skip appears 1.5 seconds after the intro starts.
      tl.call(() => setShowSkip(true), [], 1.5);
      tl.to(
        ".skip-button",
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
        1.5
      );
    }, root);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      context.revert();
    };
  }, [goToLogin]);

  const handleSkip = () => {
    if (!showSkip || navigatingRef.current) return;

    navigatingRef.current = true;
    timelineRef.current?.kill();

    gsap.to(containerRef.current, {
      autoAlpha: 0,
      scale: 0.985,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => navigate("/login", { replace: true }),
    });
  };

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(25,81,252,0.16)_0%,rgba(3,25,91,0.12)_35%,#080b14_70%,#030407_100%)] px-5 py-16 text-white"
    >
      {/* Ambient lighting */}
      <div className="ambient-glow pointer-events-none absolute left-1/2 top-[-270px] h-[560px] w-[820px] -translate-x-1/2 scale-90 rounded-full bg-[#1951fc]/20 opacity-0 blur-[155px]" />
      <div className="pointer-events-none absolute -bottom-48 left-[-10%] size-[420px] rounded-full bg-[#03195b]/25 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 size-[400px] rounded-full bg-[#1951fc]/10 blur-[145px]" />

      {/* Dust field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 90 }, (_, index) => (
          <span
            key={index}
            className="dust-particle absolute left-1/2 top-1/2 size-1 rounded-full bg-[#9acbff] shadow-[0_0_13px_2px_rgba(55,129,252,0.85)]"
          />
        ))}
      </div>

      {/* Skip */}
      <button
        type="button"
        onClick={handleSkip}
        disabled={!showSkip}
        className={`skip-button absolute right-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-4 py-2 text-xs text-zinc-300 opacity-0 backdrop-blur-xl transition-colors hover:border-[#3781fc]/60 hover:bg-[#1951fc]/10 hover:text-white sm:right-8 sm:top-8 sm:text-sm ${
          showSkip ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        Skip intro <ArrowUpRight size={15} />
      </button>

      {/* Brand reveal */}
      <div className="brand-content absolute z-20 flex flex-col items-center text-center">
        <div className="relative grid size-[68px] place-items-center overflow-hidden rounded-[21px] border border-white/15 bg-white/[0.07] shadow-[0_0_65px_rgba(25,81,252,0.38)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#1951fc]/25" />
          <Workflow className="relative z-10 text-white" size={32} strokeWidth={1.5} />
        </div>

        <h1 className="mt-5 text-5xl tracking-tight sm:text-6xl">
          <span className="">Saarthi</span>
          <span className="ml-2 text-[#5790ff]">AI</span>
        </h1>
        <p className="mt-3 text-[10px] tracking-[0.28em] text-zinc-400 sm:text-xs">
          INTELLIGENCE, CONNECTED.
        </p>
      </div>

      {/* Capability sequence */}
      <section className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="intro-copy mb-9 text-center opacity-0 sm:mb-12">
          <p className="text-3xl font-semibold tracking-tight sm:text-5xl">
            One workspace.
            <span className="text-[#3781fc]"> Infinite possibilities.</span>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            One intelligent space to organize your work, your content and your AI.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-3 sm:gap-5">
          {features.map((feature) => (
            <div key={feature.id} className="relative min-w-0">
              <div className="feature-card-shell relative z-[1] will-change-transform">
                <FeatureCard feature={feature} />
              </div>

              {/* Full-card mirror, vertically flipped and faded into the background */}
              <div className="feature-reflection pointer-events-none absolute left-0 right-0 top-full mt-1 h-[105px] overflow-hidden opacity-0 [mask-image:linear-gradient(to_bottom,black_0%,transparent_88%)]">
                <div className="origin-top scale-y-[-1] opacity-55">
                  <FeatureCard feature={feature} reflection />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="intro-copy mt-14 text-center text-[10px] tracking-[0.3em] text-zinc-600 opacity-0 sm:text-xs">
          ONE INTELLIGENT ECOSYSTEM
        </p>
      </section>
    </main>
  );
}
