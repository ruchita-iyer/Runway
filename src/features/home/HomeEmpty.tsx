import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { CompassIllustration } from "../../components/ui/illustrations/CompassIllustration";

export function HomeEmpty() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-action-primary/12 text-action-primary"
        >
          <CompassIllustration size={52} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="font-display text-[26px] font-bold text-ink">Start your first trip</h1>
          <p className="text-[15px] leading-relaxed text-slate">
            Runway tracks how fast you're spending against how much time you have left, not just
            a shrinking balance.
          </p>
        </div>
        <Button onClick={() => navigate("/new-trip")}>Start a trip</Button>
      </div>
    </AppShell>
  );
}
