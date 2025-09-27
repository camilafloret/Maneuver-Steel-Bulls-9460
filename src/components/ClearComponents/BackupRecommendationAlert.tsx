import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BackupRecommendationAlertProps {
  onClearAllClick: () => void;
}

export const BackupRecommendationAlert = ({ onClearAllClick }: BackupRecommendationAlertProps) => {
  return (
    <Alert>
      <AlertTitle>💡 Recomendação de Backup</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Considere baixar seus dados antes de apagá-los. Use a página de Transferência JSON para exportar seus dados.</p>
        <p className="text-xs text-muted-foreground">
          ⚠️ O botão abaixo irá redefinir completamente este dispositivo, apagando TODOS os dados armazenados, incluindo configurações.
        </p>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onClearAllClick}
          className="w-full"
        >
          🗑️ Apagar Todos os Dados
        </Button>
      </AlertDescription>
    </Alert>
  );
};
