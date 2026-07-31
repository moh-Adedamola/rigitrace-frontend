"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { StatusPill } from "@/components/status/StatusPill";
import { apiFetch } from "@/lib/api/client";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";
import type { Brand, Product } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

interface FormState {
  brandId: string;
  name: string;
  category: string;
  barcode: string;
  imageUrl: string;
}

const INITIAL_STATE: FormState = {
  brandId: "",
  name: "",
  category: "",
  barcode: "",
  imageUrl: "",
};

function validate(values: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.brandId) errors.brandId = "Select the brand this product belongs to.";
  if (!values.name.trim()) errors.name = "Product name is required.";
  if (!values.category) errors.category = "Select a category.";
  return errors;
}

export function ProductCreationForm() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    apiFetch<ListResponse<Brand>>("/api/v1/brands?status=approved")
      .then((res) => setBrands(res.data))
      .catch(() => setBrands([]));
  }, []);

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
      const created = await apiFetch<Product>("/api/v1/products", {
        method: "POST",
        body: JSON.stringify({
          brandId: values.brandId,
          name: values.name,
          category: values.category,
          barcode: values.barcode || undefined,
          images: values.imageUrl ? [values.imageUrl] : [],
        }),
      });
      setProduct(created);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!product) return;
    setPublishing(true);
    try {
      const updated = await apiFetch<Product>(`/api/v1/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          changes: { status: "published" },
          changeType: "info_change",
          summary: "Product published",
          actorId: product.brandId,
        }),
      });
      setProduct(updated);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to publish.");
    } finally {
      setPublishing(false);
    }
  }

  if (product) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{product.name}</h2>
          <StatusPill status={product.status} />
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Category: {product.category}
          {product.barcode ? ` · Barcode: ${product.barcode}` : ""}
        </p>
        {product.status === "draft" && (
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish product"}
          </Button>
        )}
        <Link
          href={`/brand/products/${product.id}`}
          className="mt-3 block text-sm text-primary underline"
        >
          View product & manage evidence →
        </Link>
        {submitError && <p className="mt-2 text-sm text-destructive">{submitError}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="brandId">Brand</Label>
        <select
          id="brandId"
          value={values.brandId}
          onChange={handleChange("brandId")}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">
            {brands.length === 0 ? "No approved brands yet" : "Select a brand…"}
          </option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <FieldError>{errors.brandId}</FieldError>
      </div>

      <div>
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={handleChange("name")}
          placeholder="e.g. Shea Glow Body Butter"
        />
        <FieldError>{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={values.category}
          onChange={handleChange("category")}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a category…</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FieldError>{errors.category}</FieldError>
      </div>

      <div>
        <Label htmlFor="barcode">Barcode (optional)</Label>
        <Input
          id="barcode"
          value={values.barcode}
          onChange={handleChange("barcode")}
          placeholder="e.g. 6156000123456"
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL (optional — real upload comes later)</Label>
        <Input
          id="imageUrl"
          value={values.imageUrl}
          onChange={handleChange("imageUrl")}
          placeholder="https://…"
        />
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={submitting || brands.length === 0}>
        {submitting ? "Creating…" : "Create product"}
      </Button>
    </form>
  );
}