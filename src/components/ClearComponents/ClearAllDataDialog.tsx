import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ClearAllDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  scoutingDataCount: number;
  pitScoutingDataCount: number;
  scouterGameDataCount: number;
  apiDataCount: number;
  matchDataCount: number;
}

export const ClearAllDataDialog = ({
  open,
  onOpenChange,
  onConfirm,
  scoutingDataCount,
  pitScoutingDataCount,
  scouterGameDataCount,
  apiDataCount,
  matchDataCount,
}: ClearAllDataDialogProps) => {
  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Apagar Todos os Dados – Redefinição Completa
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <p className="font-medium text-foreground">
                Isto irá excluir PERMANENTEMENTE TODOS os dados deste dispositivo:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• {scoutingDataCount} entradas de scouting</li>
                <li>• {pitScoutingDataCount} entradas de scouting de pit</li>
                <li>• {scouterGameDataCount} entradas de perfil de scouter</li>
                <li>• {apiDataCount} itens de dados da API</li>
                <li>• {matchDataCount} entradas de cronograma de partidas</li>
                <li>• Todas as configurações e preferências</li>
                <li>• Todos os dados em cache</li>
              </ul>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Esta ação não pode ser desfeita. Certifique-se de ter feito backup de quaisquer dados importantes.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="p-4">
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            className="text-white p-4"
          >
            🗑️ Apagar Tudo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
