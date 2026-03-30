type Step = { n: number; label: string; active: boolean; done?: boolean };

type CheckoutStepsProps = {
  /** 1 = košík, 2 = pokladna, 3 = potvrzení */
  current: 1 | 2 | 3;
};

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  const steps: Step[] = [
    { n: 1, label: "Košík", active: current === 1, done: current > 1 },
    { n: 2, label: "Údaje", active: current === 2, done: current > 2 },
    { n: 3, label: "Potvrzení", active: current === 3, done: false },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((s) => (
        <span
          key={s.n}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
            s.active
              ? "border-accent/35 bg-accent/10 text-accent"
              : s.done
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-black/[0.08] bg-strip text-black/45"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              s.done ? "bg-green-600 text-white" : s.active ? "bg-accent/20 text-accent" : "bg-black/10 text-black/50"
            }`}
          >
            {s.done ? "✓" : s.n}
          </span>
          {s.label}
        </span>
      ))}
    </div>
  );
}
