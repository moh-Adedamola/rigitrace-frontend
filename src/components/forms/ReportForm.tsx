"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { apiFetch } from "@/lib/api/client";
import type { Report } from "@/lib/types/entities";

interface Props {
  productId: string;
  onSubmitted?: (report: Report) => void;
}

export function ReportForm({ productId, onSubmitted }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Report | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Describe what seems suspicious.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const report = await apiFetch<Report>("/api/v1/reports", {
        method: "POST",
        body: JSON.stringify({
          productId,
          description,
          reporterContact: contact || undefined,
        }),
      });
      setSubmitted(report);
      onSubmitted?.(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-foreground">
          Thank you — your report is recorded. Review isn&apos;t built yet, so nothing acts
          on it automatically.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Report suspicious product
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <Label htmlFor="description">What seems wrong?</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. Packaging looks different from what I usually buy, seal was broken."
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <FieldError>{error}</FieldError>
      </div>
      <div>
        <Label htmlFor="contact">Your contact (optional)</Label>
        <Input
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email or phone, recorded with your report"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit report"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}