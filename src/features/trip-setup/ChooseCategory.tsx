import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Icon, X } from "../../components/ui/IconIndex";
import { inferCategoryIcon } from "../../components/ui/IconIndex";
import { CategoryPickerGrid } from "../../components/ui/CategoryPickerGrid";
import { useTripData } from "../../data/useTripData";

export function ChooseCategory() {
  const navigate = useNavigate();
  const { activeTrip, addCategory } = useTripData();

  if (!activeTrip) {
    navigate("/home", { replace: true });
    return null;
  }

  const pick = (id: string) => {
    navigate("/add-expense", { state: { categoryId: id } });
  };

  return (
    <AppShell>
      <div className="relative flex items-center justify-center px-5 pt-6">
        <button onClick={() => navigate(-1)} className="absolute left-5 text-ink">
          <Icon icon={X} size={22} />
        </button>
        <h1 className="font-display text-[18px] font-bold text-ink">Choose Category</h1>
      </div>

      <div className="px-5 pt-8">
        <CategoryPickerGrid
          categories={activeTrip.categories}
          onPick={pick}
          onCreate={(name) => addCategory(activeTrip.id, name, inferCategoryIcon(name)).id}
        />
      </div>
    </AppShell>
  );
}
