import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "./ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoal } from "../http/create-goal";
import { useQueryClient } from "@tanstack/react-query";

const createGoalForm = z.object({
  title: z.string().min(1, "Informe a atividade que deseja realizar."),
  desiredWeeklyFrequency: z.coerce
    .number()
    .int()
    .min(1, "Informe a frequência desejada.")
    .max(7, "A frequência máxima é de 7 vezes por semana."),
});

type CreateGoalForm = z.infer<typeof createGoalForm>;

const desiredWeeklyFrequencyOptions = [
  { value: "1", label: "1x na semana", emoji: "🥱" },
  { value: "2", label: "2x na semana", emoji: "🙂" },
  { value: "3", label: "3x na semana", emoji: "😎" },
  { value: "4", label: "4x na semana", emoji: "😜" },
  { value: "5", label: "5x na semana", emoji: "🤨" },
  { value: "6", label: "6x na semana", emoji: "🤯" },
  { value: "7", label: "Todos os dias", emoji: "🔥" },
];

export function CreateGoal() {
  const clientQuery = useQueryClient();
  const { register, control, handleSubmit, formState, reset } =
    useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    });

  async function handleCreateGoal(data: CreateGoalForm) {
    await createGoal({
      title: data.title,
      desiredWeeklyFrequency: data.desiredWeeklyFrequency,
    });

    clientQuery.invalidateQueries({ queryKey: ["summary"] });
    clientQuery.invalidateQueries({ queryKey: ["pending-goals"] });

    reset();
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 min-h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex-1 gap-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="activity">Qual a atividade?</Label>
              <Input
                id="activity"
                placeholder="Praticar exercícios, meditar, ler..."
                autoFocus
                {...register("title")}
              />
              {formState.errors.title && (
                <span className="text-pink-500 text-sm">
                  {formState.errors.title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="frequency">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={1}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={String(field.value)}
                    id="frequency"
                  >
                    {desiredWeeklyFrequencyOptions.map((option) => (
                      <RadioGroupItem key={option.value} value={option.value}>
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          {option.label}
                        </span>
                        <span className="text-lg leading-none">
                          {option.emoji}
                        </span>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button variant="secondary" className="flex-1">
                Fechar
              </Button>
            </DialogClose>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
