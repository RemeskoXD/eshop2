import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={`ui-fade-in ${className ?? ""}`}>
      {eyebrow ? (
        <p className="ui-eyebrow">{eyebrow}</p>
      ) : null}
      <h2 className="ui-h2 mt-2">{title}</h2>
      {description ? (
        <p className="ui-body-lg mt-4 max-w-2xl">{description}</p>
      ) : null}
      {actions ? <div className="mt-4">{actions}</div> : null}
    </div>
  );
}
