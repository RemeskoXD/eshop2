"use client";

import { useState } from "react";
import { buildLeadFollowUpMailto, buildLeadFollowUpTemplate } from "@/lib/lead-followup";

type AdminLeadFollowUpActionsProps = {
  email: string;
  source: string;
};

export default function AdminLeadFollowUpActions({ email, source }: AdminLeadFollowUpActionsProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      const { subject, body } = buildLeadFollowUpTemplate(source);
      await navigator.clipboard.writeText(`Předmět: ${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a className="font-semibold text-primary hover:underline" href={buildLeadFollowUpMailto(email, source)}>
        Follow-up e-mail
      </a>
      <button
        type="button"
        onClick={onCopy}
        className="rounded-md border border-black/[0.14] bg-white px-2 py-1 text-xs font-semibold text-foreground/80 hover:border-primary/30 hover:text-primary"
      >
        {copied ? "Zkopírováno" : "Kopírovat šablonu"}
      </button>
    </div>
  );
}
