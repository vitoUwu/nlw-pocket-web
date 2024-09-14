import client from "./client";

export interface SummaryResponse {
  completed: number;
  total: number;
  goalsPerDay: Record<string, Completion[]> | null;
}

export interface Completion {
  id: string;
  goalId: string;
  title: string;
  completedAt: string;
}

export async function getSummary(): Promise<SummaryResponse> {
  return client.get("/summary");
}
