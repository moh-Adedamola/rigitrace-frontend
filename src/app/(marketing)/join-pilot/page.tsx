import { PilotApplicationForm } from "@/components/forms/PilotApplicationForm";
import type { ApplicantType } from "@/lib/types/pilotApplication";

function isApplicantType(value: string | undefined): value is ApplicantType {
  return value === "brand" || value === "retailer";
}

export default async function JoinPilotPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const applicantType = isApplicantType(type) ? type : undefined;

  const heading =
    applicantType === "retailer"
      ? "Apply to join the pilot as a retailer"
      : applicantType === "brand"
        ? "Apply to join the pilot as a brand"
        : "Apply to join the pilot";

  return (
    <div className="section-y">
      <div className="mx-auto max-w-md px-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Join the pilot
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-foreground md:text-3xl">
          {heading}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;re onboarding a small group of founding brands and retailers by hand
          before RigiTrace opens up more broadly. Tell us about yours, and our team will
          reach out to get you set up — there&apos;s no self-serve signup yet.
        </p>
        <div className="mt-8">
          <PilotApplicationForm applicantType={applicantType} />
        </div>
        {/* PLACEHOLDER: fill in the real support/contact email address */}
        <p className="mt-4 text-sm text-muted-foreground">
          Prefer email? Reach us at [PLACEHOLDER]
        </p>
      </div>
    </div>
  );
}
