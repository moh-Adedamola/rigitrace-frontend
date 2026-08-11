"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { apiFetch } from "@/lib/api/client";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";
import type { ApplicantType, PilotApplication } from "@/lib/types/pilotApplication";

interface FormState {
  name: string;
  brandName: string;
  contactEmail: string;
  contactPhone: string;
  productCategory: string;
  productCountEstimate: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  brandName: "",
  contactEmail: "",
  contactPhone: "",
  productCategory: "",
  productCountEstimate: "",
};

function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) errors.name = "Your name is required.";
  if (!values.brandName.trim()) errors.brandName = "Brand or store name is required.";
  if (!/^\S+@\S+\.\S+$/.test(values.contactEmail))
    errors.contactEmail = "Enter a valid email address.";
  if (!values.productCategory) errors.productCategory = "Select a category.";
  if (!values.productCountEstimate.trim())
    errors.productCountEstimate = "Give a rough number — even an estimate is fine.";
  return errors;
}

export function PilotApplicationForm({ applicantType }: { applicantType?: ApplicantType }) {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<PilotApplication | null>(null);

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
      const application = await apiFetch<PilotApplication>("/api/v1/pilot-applications", {
        method: "POST",
        body: JSON.stringify({ ...values, applicantType }),
      });
      setSubmitted(application);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Application received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, {submitted.name} — we&apos;ll be in touch at {submitted.contactEmail} about
          joining the pilot.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4" noValidate>
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={handleChange("name")}
          placeholder="e.g. Adaeze Okafor"
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <FieldError id="name-error">{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="brandName">
          {applicantType === "retailer" ? "Store or business name" : "Brand name"}
        </Label>
        <Input
          id="brandName"
          value={values.brandName}
          onChange={handleChange("brandName")}
          placeholder={applicantType === "retailer" ? "e.g. Aduke Beauty Store" : "e.g. Aduke Naturals"}
          aria-describedby={errors.brandName ? "brandName-error" : undefined}
        />
        <FieldError id="brandName-error">{errors.brandName}</FieldError>
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={values.contactEmail}
          onChange={handleChange("contactEmail")}
          placeholder="you@yourbrand.com"
          aria-describedby={errors.contactEmail ? "contactEmail-error" : undefined}
        />
        <FieldError id="contactEmail-error">{errors.contactEmail}</FieldError>
      </div>

      <div>
        <Label htmlFor="contactPhone">Phone (optional)</Label>
        <Input
          id="contactPhone"
          value={values.contactPhone}
          onChange={handleChange("contactPhone")}
          placeholder="+234…"
        />
      </div>

      <div>
        <Label htmlFor="productCategory">Product category</Label>
        <select
          id="productCategory"
          value={values.productCategory}
          onChange={handleChange("productCategory")}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-describedby={errors.productCategory ? "productCategory-error" : undefined}
        >
          <option value="">Select a category…</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FieldError id="productCategory-error">{errors.productCategory}</FieldError>
      </div>

      <div>
        <Label htmlFor="productCountEstimate">Rough number of products</Label>
        <Input
          id="productCountEstimate"
          value={values.productCountEstimate}
          onChange={handleChange("productCountEstimate")}
          placeholder="e.g. 15, or a range like 10–20"
          aria-describedby={
            errors.productCountEstimate ? "productCountEstimate-error" : undefined
          }
        />
        <FieldError id="productCountEstimate-error">{errors.productCountEstimate}</FieldError>
      </div>

      {submitError && (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
