import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LogoInvestigating from "@/assets/Investigating.png";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen w-full px-4 py-12">
      <img src={LogoInvestigating} alt="Investigating" className="mb-4 dark:invert" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-2">Página não encontrada</p>
      <p className="text-base text-muted-foreground mb-6 text-center max-w-xl">
        Ops! A página que você procura não existe, foi movida ou nunca existiu. Se você acha que isso é um erro, verifique o URL ou retorne à página inicial.
      </p>
      <Button onClick={() => navigate("/")} className="h-12 text-lg font-semibold px-4 w-full max-w-lg">Ir para início</Button>
    </div>
  );
}
