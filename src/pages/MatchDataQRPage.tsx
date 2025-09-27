import { useState } from "react";
import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MatchDataFountainGenerator from "@/components/DataTransferComponents/MatchDataFountainGenerator";
import MatchDataFountainScanner from "@/components/DataTransferComponents/MatchDataFountainScanner";

const MatchDataQRPage = () => {
  const [mode, setMode] = useState<'select' | 'generate' | 'scan'>('select');

  if (mode === 'generate') {
    return (
      <MatchDataFountainGenerator 
        onBack={() => setMode('select')} 
        onSwitchToScanner={() => setMode('scan')}
      />
    );
  }

  if (mode === 'scan') {
    return (
      <MatchDataFountainScanner 
        onBack={() => setMode('select')} 
        onSwitchToGenerator={() => setMode('generate')}
      />
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center px-4 pt-6 pb-6">
      <div className="flex flex-col items-start gap-4 max-w-md w-full">
        <h1 className="text-2xl font-bold">Carregar dados de correspondência QR</h1>
        <p className="text-muted-foreground">
          Gere ou escaneie sequências QR de código fonte para transferência confiável de dados de partida entre dispositivos.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => setMode('generate')}
            className="w-full h-16 text-xl"
          >
            Gerar códigos de fonte de dados de partida
          </Button>
          
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">Ou</span>
            <Separator className="flex-1" />
          </div>
          
          <Button
            onClick={() => setMode('scan')}
            variant="outline"
            className="w-full h-16 text-xl"
          >
            Códigos de fonte de dados de partida de digitalização
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-start space-y-1">
          <p>- Códigos de fonte dividem grandes volumes de dados em vários códigos QR</p>
          <p>- Digitalize os pacotes em qualquer ordem até que a reconstrução seja concluída</p>
          <p>- Mais confiável do que um único código QR grande</p>
          <p>- Não é necessário digitalizar todos os pacotes</p>
        </div>
      </div>
    </div>
  );
};

export default MatchDataQRPage;
