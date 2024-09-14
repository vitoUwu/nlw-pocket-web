import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { createGoalCompletion } from "../http/create-goal-completion";
import {
  type PendingGoalsResponse,
  getWeekPendingGoals,
} from "../http/get-week-pending-goals";
import { OutlineButton } from "./ui/outline-button";
import { Button } from "./ui/button";
import { useState } from "react";

export function PendingGoals() {
  const [isCreatingCompletion, setIsCreatingCompletion] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, isError, refetch } = useQuery<
    PendingGoalsResponse[]
  >({
    queryKey: ["pending-goals"],
    queryFn: getWeekPendingGoals,
    staleTime: 1000 * 60,
  });

  async function handleCompleteGoal(goalId: string) {
    try {
      setIsCreatingCompletion(true);
      await createGoalCompletion(goalId);
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
    } finally {
      setIsCreatingCompletion(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map(() => (
          <div
            key={Math.random()}
            className="h-9 w-full skeleton rounded-full border border-dashed border-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-9 text-center text-xs flex items-center justify-center flex-col gap-3">
        <p className="text-zinc-500">Ocorreu um erro ao carregar as metas</p>
        <Button onClick={() => refetch()} size="sm" variant="secondary">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex gap-3 flex-wrap">
        {data.map((goal) => (
          <OutlineButton
            onClick={() => handleCompleteGoal(goal.id)}
            key={goal.id}
            disabled={
              isCreatingCompletion ||
              goal.completionCount >= goal.desiredWeeklyFrequency
            }
            className="flex items-center gap-2"
          >
            <Plus className="size-4 text-zinc-600" /> {goal.title}
          </OutlineButton>
        ))}
      </div>
    );
  }

  return null;
}
