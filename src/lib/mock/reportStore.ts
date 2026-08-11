import type { Report, ReportStatus } from "@/lib/types/entities";

const reports: Report[] = [];

// A freshly submitted report is anonymous and unreviewed — counting it would
// let anyone tank a competitor's score by filing reports in a loop. Only
// "under_investigation" means a person has looked at it and found it credible
// enough to act on. "resolved" and "dismissed" are terminal and no longer
// count either way.
const REVIEWED_STATUSES: ReportStatus[] = ["under_investigation"];

export function addReport(report: Report): Report {
  reports.push(report);
  return report;
}

export function listReports(productId?: string): Report[] {
  return productId ? reports.filter((r) => r.productId === productId) : reports;
}

export function countReportsUnderReview(productId: string): number {
  return listReports(productId).filter((r) => REVIEWED_STATUSES.includes(r.status)).length;
}