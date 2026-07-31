"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { apiFetch } from "@/lib/api/client";
import type { Evidence, EvidenceSource } from "@/lib/types/entities";

const SOURCE_OPTIONS: { value: EvidenceSource; label: string }[] = [
  { value: "brand", label: "Brand" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "retailer", label: "Retailer" },
  { value: "consumer", label: "Consumer" },
  { value: "regulator", label: "Regulator" },
];

interface Props {
  productId: string;
  onSubmitted: (evidence: Evidence) => void;
}

export function EvidenceSubmissionForm({ productId, onSubmitted }: Props) {
  const [source, setSource] = useState<EvidenceSource>("brand");
  const [description, setDescription] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Describe the evidence being submitted.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const evidence = await apiFetch<Evidence>(`/api/v1/products/${productId}/evidence`, {
        method: "POST",
        body: JSON.stringify({
          source,
          // Real value comes from auth once it exists — not built yet.
          submittedBy: "current-user-placeholder",
          description,
          attachments: attachmentUrl ? [attachmentUrl] : [],
        }),
      });
      onSubmitted(evidence);
      setDescription("");
      setAttachmentUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit evidence.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <Label htmlFor="source">Evidence source</Label>
        <select
          id="source"
          value={source}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSource(e.target.value as EvidenceSource)}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. Certificate of analysis confirming ingredient list matches packaging."
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <FieldError>{error}</FieldError>
      </div>

      <div>
        <Label htmlFor="attachmentUrl">Attachment URL (optional)</Label>
        <Input
          id="attachmentUrl"
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit evidence"}
      </Button>
    </form>
  );
}