import { Award, Building2, Headphones, MapPinned, Truck } from "lucide-react";
import TrustItem from "@/components/ui/trust-item";
import ReviewsProof from "@/components/reviews-proof";

const ITEMS = [
  {
    icon: Award,
    title: "Záruka 5 let",
    sub: "Klid na výrobek dle zakázky a podmínek montáže",
  },
  {
    icon: Building2,
    title: "Česká výroba",
    sub: "Výroba, dodání a servis koordinované z jedné ruky",
  },
  {
    icon: MapPinned,
    title: "Zaměření zdarma",
    sub: "Přesné rozměry před výrobou, bez překvapení",
  },
  {
    icon: Headphones,
    title: "Podpora na telefonu",
    sub: "Nevíte si rady? Pomůžeme s výběrem i termínem",
  },
  {
    icon: Truck,
    title: "Montáž po celé ČR",
    sub: "Realizace u vás — domluvíme konkrétní postup",
  },
] as const;

export default function TrustStrip() {
  return (
    <div className="border-b border-black/[0.06] bg-gradient-to-b from-[#f6f8fb] to-strip">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="ui-caption text-[11px] font-semibold uppercase tracking-[0.12em] text-black/55">
            Proč zákazníci vybírají QAPI
          </p>
          <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary sm:inline-flex">
            Transparentní postup od poptávky po montáž
          </span>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
        {ITEMS.map(({ icon, title, sub }) => (
          <TrustItem key={title} icon={icon} title={title} sub={sub} />
        ))}
        </div>
        <div className="mt-4">
          <ReviewsProof />
        </div>
      </div>
    </div>
  );
}
