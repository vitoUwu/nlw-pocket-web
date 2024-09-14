import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import { CheckCircle2, Plus, Trash } from "lucide-react";
import { type SummaryResponse, getSummary } from "../http/get-summary";
import { InOrbitIcon } from "./in-orbit-icon";
import { PendingGoals } from "./pending-goals";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { deleteGoalCompletion } from "../http/delete-goal-completion";

dayjs.locale(ptBR);

export function Summary() {
  const queryClient = useQueryClient();

  const { data } = useQuery<SummaryResponse>({
    queryKey: ["summary"],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  });

  if (!data) return null;

  const firstDayOfWeek = dayjs().startOf("week").format("DD [de] MMM");
  const lastDayOfWeek = dayjs().endOf("week").format("DD [de] MMM");

  const completedPercentage = Math.round((data.completed / data.total) * 100);

  async function handleDeleteCompletion(completionId: string, goalId: string) {
    await deleteGoalCompletion(completionId, goalId);

    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
  }

  return (
    <div className="max-w-[480px] mt-10 w-full px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            <span className="hidden  min-[428px]:inline">Cadastrar meta</span>
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={data.total} value={data.completed}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex justify-between items-center text-xs text-zinc-400">
          <span>
            Você completou{" "}
            <span className="text-zinc-100">{data.completed}</span> de{" "}
            <span className="text-zinc-100">{data.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {Object.entries(data.goalsPerDay || {}).map(([date, completions]) => {
          const day = dayjs(date);
          const weekDay = day.format("dddd");
          const formattedDate = day.format("DD [de] MMMM");

          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className="capitalize">{weekDay}</span>{" "}
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
              </h3>
              <ul className="flex flex-col gap-3">
                {completions.map((completion) => {
                  const time = dayjs(completion.completedAt).format("HH:mm[h]");

                  return (
                    <li
                      key={completion.id}
                      className="flex items-center gap-2 group"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCompletion(
                            completion.id,
                            completion.goalId
                          )
                        }
                        className="flex justify-between gap-3 items-center w-full"
                      >
                        <span className="inline-flex items-center gap-1 text-sm text-zinc-400">
                          <CheckCircle2 className="size-4 text-pink-500" />
                          Você completou{" "}
                          <span className="text-zinc-100">
                            "{completion.title}"
                          </span>{" "}
                          às <span className="text-zinc-100">{time}</span>
                        </span>
                        <Trash className="size-4 text-pink-500 group-hover:opacity-100 [@media(hover:hover)]:opacity-0 transition-opacity" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
