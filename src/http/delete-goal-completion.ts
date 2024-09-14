import client from "./client";

export async function deleteGoalCompletion(
  completionId: string,
  goalId: string
) {
  return client.delete("/completions", { completionId, goalId });
}
