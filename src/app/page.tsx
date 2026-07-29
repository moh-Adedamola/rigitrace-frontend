import { StatusPill } from "@/components/status/StatusPill";
import { TrustBadge } from "@/components/trust/TrustBadge";

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <StatusPill status="approved" />
        <StatusPill status="pending" />
        <StatusPill status="suspended" />
      </div>
      <TrustBadge
        trustScore={{
          id: "1",
          productId: "1",
          score: 82,
          status: "high",
          explanation: "Verified brand with complete evidence and no reports.",
          factors: [{ label: "Brand verification", impact: "positive", weight: 0.4 }],
          calculatedAt: new Date().toISOString(),
        }}
      />
    </div>
  );
}