import { Plus } from "lucide-react";
import letsStart from "../assets/lets-start-illustration.svg";
import logo from "../assets/logo-in-orbit.svg";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="logo" />
      <img src={letsStart} alt="logo" />
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </div>
  );
}
