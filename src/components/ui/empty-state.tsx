import type { ReactNode } from "react";
import Card from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function EmptyState({ title, description, actions }: EmptyStateProps) {
  return (
    <Card className="border-dashed p-10 text-center">
      <p className="text-sm font-medium text-black/80">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-black/60">{description}</p> : null}
      {actions ? <div className="mt-4 flex justify-center">{actions}</div> : null}
    </Card>
  );
}
