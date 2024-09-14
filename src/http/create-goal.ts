import client from "./client";

interface CreateGoalRequest {
  title: string;
  desiredWeeklyFrequency: number;
}

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequest) {
  return client.post("/goals", {
    title,
    desiredWeeklyFrequency,
  });
}
