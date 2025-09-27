import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FountainCodeGenerator from "@/components/DataTransferComponents/FountainCodeGenerator";
import FountainCodeScanner from "@/components/DataTransferComponents/FountainCodeScanner";
import MatchDataFountainGenerator from "@/components/DataTransferComponents/MatchDataFountainGenerator";
import MatchDataFountainScanner from "@/components/DataTransferComponents/MatchDataFountainScanner";
import ScouterProfilesFountainGenerator from "@/components/DataTransferComponents/ScouterProfilesFountainGenerator";
import ScouterProfilesFountainScanner from "@/components/DataTransferComponents/ScouterProfilesFountainScanner";
import CombinedDataFountainGenerator from "@/components/DataTransferComponents/CombinedDataFountainGenerator";
import CombinedDataFountainScanner from "@/components/DataTransferComponents/CombinedDataFountainScanner";
import PitScoutingFountainGenerator from "@/components/DataTransferComponents/PitScoutingFountainGenerator";
import PitScoutingFountainScanner from "@/components/DataTransferComponents/PitScoutingFountainScanner";

type DataType = 'scouting' | 'match' | 'scouter' | 'combined' | 'pit-scouting';

const QRDataTransferPage = () => {
  const [mode, setMode] = useState<'select' | 'generate' | 'scan'>('select');
  const [dataType, setDataType] = useState<DataType>('scouting');

  if (mode === 'generate') {
    if (dataType === 'scouting') {
      return (
        <FountainCodeGenerator 
          onBack={() => setMode('select')} 
          onSwitchToScanner={() => setMode('scan')} 
        />
      );
    } else if (dataType === 'match') {
      return (
        <MatchDataFountainGenerator 
          onBack={() => setMode('select')} 
          onSwitchToScanner={() => setMode('scan')} 
        />
      );
    } else if (dataType === 'scouter') {
      return (
        <ScouterProfilesFountainGenerator 
          onBack={() => setMode('select')} 
          onSwitchToScanner={() => setMode('scan')} 
        />
      );
    } else if (dataType === 'pit-scouting') {
      return (
        <PitScoutingFountainGenerator 
          onBack={() => setMode('select')} 
          onSwitchToScanner={() => setMode('scan')} 
        />
      );
    } else {
      return (
        <CombinedDataFountainGenerator 
          onBack={() => setMode('select')} 
          onSwitchToScanner={() => setMode('scan')} 
        />
      );
    }
  }

  if (mode === 'scan') {
    if (dataType === 'scouting') {
      return (
        <FountainCodeScanner 
          onBack={() => setMode('select')} 
          onSwitchToGenerator={() => setMode('generate')} 
        />
      );
    } else if (dataType === 'match') {
      return (
        <MatchDataFountainScanner 
          onBack={() => setMode('select')} 
          onSwitchToGenerator={() => setMode('generate')} 
        />
      );
    } else if (dataType === 'scouter') {
      return (
        <ScouterProfilesFountainScanner 
          onBack={() => setMode('select')} 
          onSwitchToGenerator={() => setMode('generate')} 
        />
      );
    } else if (dataType === 'pit-scouting') {
      return (
        <PitScoutingFountainScanner 
          onBack={() => setMode('select')} 
          onSwitchToGenerator={() => setMode('generate')} 
        />
      );
    } else {
      return (
        <CombinedDataFountainScanner 
          onBack={() => setMode('select')} 
          onSwitchToGenerator={() => setMode('generate')} 
        />
      );
    }
  }

  return (
    <div className="h-screen w-full flex flex-col items-center px-4 pt-6 pb-6">
      <div className="flex flex-col items-start gap-4 max-w-md w-full">
        <h1 className="text-2xl font-bold">Transferência de dados QR</h1>
        <p className="text-muted-foreground">
          Transfira arquivos de dados grandes usando códigos fonte. Examine os pacotes em qualquer ordem até que a reconstrução seja concluída. Observação: as transferências de pit scouting incluem apenas dados de texto — use a transferência JSON para imagens.
        </p>

        {/* Data Type Selection */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Selecione o tipo de dados</CardTitle>
            <CardDescription>
              Escolha que tipo de dados você deseja transferir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={dataType} onValueChange={(value: DataType) => setDataType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="combined">Combinado (Scouting + Perfis)</SelectItem>
                <SelectItem value="scouting">Dados de Scouting</SelectItem>
                <SelectItem value="pit-scouting">Dados de Pit Scouting (sem imagens)</SelectItem>
                <SelectItem value="match">Dados do Cronograma de Partidas</SelectItem>
                <SelectItem value="scouter">Perfis de Scouter</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => setMode('generate')}
            className="w-full h-16 text-xl"
          >
            Gerar códigos de fonte
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
            Códigos de fonte de digitalização
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-start space-y-1">
          <p>- Os códigos podem ser escaneados em qualquer ordem</p>
          <p>- Não é necessário receber todos os códigos</p>
          <p>- Reconstrução automática quando dados suficientes forem recebidos</p>
          <p>- Pit scouting transfere apenas texto (especificações da equipe, capacidades, observações)</p>
          <p>- Use Transferência de Dados JSON para fotos dos robôs</p>
        </div>
      </div>
    </div>
  );
};

export default QRDataTransferPage;