"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { StatusPill } from "@/components/status/StatusPill";
import { apiFetch } from "@/lib/api/client";
import type { Retailer, RetailerType } from "@/lib/types/entities";

interface FormState {
  name: string;
  type: RetailerType | "";
  contactEmail: string;
}

const TYPE_OPTIONS: { value: RetailerType; label: string }[] = [
  { value: "physical_store", label: "Physical store" },
  { value: "online_store", label: "Online store" },
  { value: "social_commerce", label: "Social commerce" },
  { value: "marketplace", label: "Marketplace" },
];

const INITIAL_STATE: FormState = { name: "", type: "", contactEmail: "" };

function validate(values: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) errors.name = "Retailer name is required.";
  if (!values.type) errors.type = "Select a retailer type.";
  if (!/^\S+@\S+\.\S+$/.test(values.contactEmail)) errors.contactEmail = "Enter a valid email address.";
  return errors;
}

export function RetailerRegistrationForm() {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retailer, setRetailer] = useState<Retailer | null>(null);

  function handleChange<K extends keyof FormState>(field: K) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await apiFetch<Retailer>("/api/v1/retailers", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setRetailer(created);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (retailer) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Registration submitted</h2>
          <StatusPill status={retailer.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {retailer.name} has been submitted for review. There&apos;s no notification yet —
          check back here, or email{" "}
          <a
            href="mailto:rigitrace@gmail.com"
            className="text-eyebrow underline-offset-4 hover:underline"
          >
            rigitrace@gmail.com
          </a>{" "}
          for an update.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="name">Retailer / business name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={handleChange("name")}
          placeholder="e.g. Glow Beauty Store"
        />
        <FieldError>{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="type">Retailer type</Label>
        <select
          id="type"
          value={values.type}
          onChange={handleChange("type")}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a type…</option>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldError>{errors.type}</FieldError>
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={values.contactEmail}
          onChange={handleChange("contactEmail")}
          placeholder="you@yourstore.com"
        />
        <FieldError>{errors.contactEmail}</FieldError>
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Register retailer"}
      </Button>
    </form>
  );
}