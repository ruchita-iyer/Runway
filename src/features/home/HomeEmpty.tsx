import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";

export function HomeEmpty() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-32 w-32 items-center justify-center"
        >
          <img src="/illustrations/happy.svg" alt="" className="h-full w-full" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="font-display text-[26px] font-bold text-ink">Let's get started</h1>
          {/* <p className="text-[15px] leading-relaxed text-slate">
            Runway tracks your trip budget, what you've spent, and what's left — all in one
            place.
          </p> */}
        </div>
        <Button onClick={() => navigate("/new-trip")}>Start a trip</Button>
      </div>
    </AppShell>
  );
}
