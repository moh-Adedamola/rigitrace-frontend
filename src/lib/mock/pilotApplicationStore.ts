import type { PilotApplication } from "@/lib/types/pilotApplication";

const applications: PilotApplication[] = [];

export function addPilotApplication(application: PilotApplication): PilotApplication {
  applications.push(application);
  return application;
}

export function listPilotApplications(): PilotApplication[] {
  return applications;
}
