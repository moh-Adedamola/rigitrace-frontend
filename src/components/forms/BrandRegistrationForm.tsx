"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { StatusPill } from "@/components/status/StatusPill";
import { apiFetch } from "@/lib/api/client";
import type { Brand } from "@/lib/types/entities";

interface FormState {
  name: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  registrationNumber: "",
  contactEmail: "",
  contactPhone: "",
};

function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) errors.name = "Brand name is required.";
  if (!values.registrationNumber.trim())
    errors.registrationNumber = "Registration number is required.";
  if (!/^\S+@\S+\.\S+$/.test(values.contactEmail))
    errors.contactEmail = "Enter a valid email address.";
  return errors;
}

export function BrandRegistrationForm() {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredBrand, setRegisteredBrand] = useState<Brand | null>(null);

  function handleChange(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement>) => {
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
      const brand = await apiFetch<Brand>("/api/v1/brands", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setRegisteredBrand(brand);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (registeredBrand) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Registration submitted</h2>
          <StatusPill status={registeredBrand.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {registeredBrand.name} has been submitted for review. We&apos;ll notify{" "}
          {registeredBrand.contactEmail} once an admin approves it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="name">Brand name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={handleChange("name")}
          placeholder="e.g. Aduke Naturals"
        />
        <FieldError>{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="registrationNumber">Business registration number</Label>
        <Input
          id="registrationNumber"
          value={values.registrationNumber}
          onChange={handleChange("registrationNumber")}
          placeholder="CAC/RC number"
        />
        <FieldError>{errors.registrationNumber}</FieldError>
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={values.contactEmail}
          onChange={handleChange("contactEmail")}
          placeholder="you@yourbrand.com"
        />
        <FieldError>{errors.contactEmail}</FieldError>
      </div>

      <div>
        <Label htmlFor="contactPhone">Contact phone (optional)</Label>
        <Input
          id="contactPhone"
          value={values.contactPhone}
          onChange={handleChange("contactPhone")}
          placeholder="+234..."
        />
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Register brand"}
      </Button>
    </form>
  );
}