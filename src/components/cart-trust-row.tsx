import { Award, Building2, Headphones, MapPinned } from "lucide-react";

const MINI = [
  { icon: Award, label: "Záruka 5 let" },
  { icon: Building2, label: "Česká výroba" },
  { icon: MapPinned, label: "Zaměření zdarma" },
  { icon: Headphones, label: "Podpora na telefonu" },
] as const;

export default function CartTrustRow() {
  return (
    <div
      role="group"
      aria-label="Krátké záruky a služby QAPI"
      className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-black/[0.06] bg-strip/60 px-3 py-2.5 text-[11px] font-medium text-black/70 sm:text-xs"
    >
      {MINI.map(({ icon: Icon, label }) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}
