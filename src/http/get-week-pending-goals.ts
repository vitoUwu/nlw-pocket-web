import client from "./client";

export interface PendingGoalsResponse {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  createdAt: string;
  completionCount: number;
}

export async function getWeekPendingGoals() {
  return client.get<PendingGoalsResponse[]>("/pending-goals");
}
