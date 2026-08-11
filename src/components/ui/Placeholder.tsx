import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Icon, ArrowLeft } from "./IconIndex";

export function Placeholder({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <h1 className="font-display text-[20px] font-bold text-ink">{title}</h1>
      </div>
      <div className="flex h-[70%] items-center justify-center px-8 text-center text-[14px] text-slate">
        Coming up next in the build.
      </div>
    </AppShell>
  );
}
