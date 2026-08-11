import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { QuickLogIllustration } from "../../components/ui/illustrations/QuickLogIllustration";
import { useTripData } from "../../data/useTripData";

export function Tutorial2() {
  const navigate = useNavigate();
  const { markTutorialSeen } = useTripData();
  return (
    <AppShell>
      <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-32 w-32 items-center justify-center rounded-full bg-action-primary/12 text-action-primary"
        >
          <QuickLogIllustration size={58} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="font-display text-[24px] font-bold text-ink">Log in seconds, see it settle instantly</h1>
          <p className="text-[14px] leading-relaxed text-slate">
            All your data lives on this device. No account, no syncing, nothing sent anywhere.
          </p>
        </div>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-pill bg-hairline" />
          <span className="h-1.5 w-5 rounded-pill bg-action-primary" />
        </div>
        <Button
          onClick={() => {
            markTutorialSeen();
            navigate("/home");
          }}
        >
          Get started
        </Button>
      </div>
    </AppShell>
  );
}
