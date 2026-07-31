import type { Report } from "@/lib/types/entities";

const reports: Report[] = [];

export function addReport(report: Report): Report {
  reports.push(report);
  return report;
}

export function listReports(productId?: string): Report[] {
  return productId ? reports.filter((r) => r.productId === productId) : reports;
}