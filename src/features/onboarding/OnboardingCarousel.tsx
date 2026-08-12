import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AppShell } from "../../layout/AppShell";
import { Icon, ArrowLeft, ChevronRight } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";

const TRANSITION_EASE = [0.4, 0, 0.2, 1] as const;
const TRANSITION_DURATION = 0.4;
const SWIPE_DISTANCE_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 0.5; // px/ms
const INTRO_LOTTIE_SRC = "https://lottie.host/dab360f3-eca1-433d-84fa-7af1b37dc913/6E8GMbH2rN.lottie";

const SLIDES: { headline: string; body: string; illustration: string; bg: string; float?: boolean; lottie?: string }[] = [
  {
    headline: "Know your pace, not just your balance",
    body: "Runway shows how fast you're spending against how much time you have left on your trip.",
    illustration: "/illustrations/telegram.svg",
    bg: "#eaf3fb",
    lottie: INTRO_LOTTIE_SRC,
  },
  {
    headline: "Log in seconds, see it settle instantly",
    body: "All your data lives on this device. No account, no syncing, nothing sent anywhere.",
    illustration: "/illustrations/wallet.svg",
    bg: "#fdf1e4",
  },
  {
    headline: "Stay on pace, build your streak",
    body: "Every on-pace day adds to your streak — swipe through your trip and watch it grow.",
    illustration: "/illustrations/streak.svg",
    bg: "#eaf6ee",
  },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

export function OnboardingCarousel() {
  const navigate = useNavigate();
  const { markTutorialSeen } = useTripData();
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const finish = () => {
    markTutorialSeen();
    navigate("/home");
  };

  const paginate = (delta: number) => {
    setPage(([prev]) => {
      const next = Math.min(Math.max(prev + delta, 0), SLIDES.length - 1);
      return next === prev ? [prev, delta] : [next, delta];
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Math.max(e.timeStamp, 1);
    touchStart.current = null;
    if (Math.abs(dx) <= Math.abs(dy)) return;
    const velocity = Math.abs(dx) / dt;
    if (Math.abs(dx) < SWIPE_DISTANCE_THRESHOLD && velocity < SWIPE_VELOCITY_THRESHOLD) return;
    if (dx < 0) paginate(1);
    else paginate(-1);
  };

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <AppShell style={{ backgroundColor: slide.bg }}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pt-5">
          {index > 0 ? (
            <button
              onClick={() => paginate(-1)}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-center text-ink"
            >
              <Icon icon={ArrowLeft} size={20} />
            </button>
          ) : (
            <span className="h-8 w-8" aria-hidden />
          )}
          {!isLast && (
            <button onClick={finish} className="text-[13px] font-medium text-slate">
              Skip
            </button>
          )}
        </div>

        <div
          className="relative flex-1 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASE }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8 text-center"
            >
              <div className="flex h-56 w-56 items-center justify-center">
                {slide.lottie ? (
                  <DotLottieReact src={slide.lottie} loop autoplay className="h-full w-full" />
                ) : slide.float ? (
                  <motion.img
                    src={slide.illustration}
                    alt=""
                    className="h-full w-full"
                    animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : (
                  <img src={slide.illustration} alt="" className="h-full w-full" />
                )}
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-[24px] font-bold text-ink">{slide.headline}</h1>
                <p className="text-[14px] leading-relaxed text-slate">{slide.body}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-5 px-8 pb-8">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <motion.span
                key={i}
                animate={{ width: i === index ? 20 : 6, backgroundColor: i === index ? "var(--ink)" : "var(--hairline)" }}
                transition={{ duration: 0.25 }}
                className="h-1.5 rounded-pill"
              />
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => (isLast ? finish() : paginate(1))}
            aria-label={isLast ? "Get started" : "Next"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-soft"
          >
            <Icon icon={ChevronRight} size={22} />
          </motion.button>
        </div>
      </div>
    </AppShell>
  );
}
