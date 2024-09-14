import { useQuery } from "@tanstack/react-query";
import { CreateGoal } from "./components/create-goal";
import { EmptyGoals } from "./components/empty-goals";
import { Loading } from "./components/loading";
import { Summary } from "./components/summary";
import { Dialog } from "./components/ui/dialog";
import { type SummaryResponse, getSummary } from "./http/get-summary";

export function App() {
  const { data, isLoading } = useQuery<SummaryResponse>({
    queryKey: ["summary"],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  });

  return (
    <Dialog>
      {isLoading ? (
        <Loading />
      ) : data && data.total > 0 ? (
        <Summary />
      ) : (
        <EmptyGoals />
      )}
      <CreateGoal />
    </Dialog>
  );
}
