import client from "./client";

export async function createGoalCompletion(goalId: string) {
  return client.post("/completions", { goalId });
}
