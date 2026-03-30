import type { LucideIcon } from "lucide-react";

type TrustItemProps = {
  icon: LucideIcon;
  title: string;
  sub: string;
};

export default function TrustItem({ icon: Icon, title, sub }: TrustItemProps) {
  return (
    <div className="ui-motion ui-hover-lift flex min-w-[240px] flex-1 items-start gap-3 rounded-xl border border-black/[0.08] bg-white/85 px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:min-w-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-xs font-semibold leading-tight text-primary sm:text-sm">{title}</p>
        <p className="mt-1 text-[11px] leading-snug text-black/60 sm:text-xs">{sub}</p>
      </div>
    </div>
  );
}
