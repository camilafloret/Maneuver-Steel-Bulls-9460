
import { useState } from "react";
import Button from "@/components/ui/button";
import JSONUploader from "@/components/DataTransferComponents/JSONUploader";
import { convertArrayOfArraysToCSV, SCOUTING_DATA_HEADER } from "@/lib/utils";
import { loadScoutingData } from "@/lib/scoutingDataUtils";
import { loadPitScoutingData, exportPitScoutingToCSV, downloadPitScoutingImagesOnly } from "@/lib/pitScoutingUtils";
import { gameDB } from "@/lib/dexieDB";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const JSONDataTransferPage = () => {
  const [mode, setMode] = useState<'select' | 'upload'>('select');
  const [dataType, setDataType] = useState<'scouting' | 'scouterProfiles' | 'pitScouting' | 'pitScoutingImagesOnly'>('scouting');

  if (mode === 'upload') {
    return (
      <JSONUploader 
        onBack={() => setMode('select')} 
      />
    );
  }

  const handleDownloadCSV = async () => {
    try {
      let csv: string;
      let filename: string;

      switch (dataType) {
        case 'scouting': {
          const scoutingDataWithIds = await loadScoutingData();
          
          if (scoutingDataWithIds.entries.length === 0) {
            alert("Nenhum dado de reconhecimento encontrado.");
            return;
          }

          // Convert data entries (with IDs) to arrays using the header order
          const dataArrays = scoutingDataWithIds.entries.map(entry => 
            SCOUTING_DATA_HEADER.map(header => {
              if (header === 'id') {
                return entry.id;
              }
              const value = (entry.data as Record<string, unknown>)[header];
              return value ?? '';
            })
          );
          
          const finalDataArr = [SCOUTING_DATA_HEADER, ...dataArrays];
          
          csv = convertArrayOfArraysToCSV(finalDataArr as (string | number)[][]);
          filename = `ManeuverScoutingData-${new Date().toLocaleTimeString()}-local.csv`;
          break;
        }
        case 'pitScouting': {
          csv = await exportPitScoutingToCSV();
          if (!csv || csv.split('\n').length <= 1) {
            alert("Nenhum dado de pit scouting encontrado.");
            return;
          }
          filename = `ManeuverPitScoutingData-${new Date().toLocaleTimeString()}-local.csv`;
          break;
        }
        case 'pitScoutingImagesOnly': {
          alert("Exportação CSV não disponível para dados somente de imagens. Use o download JSON.");
          return;
        }
        case 'scouterProfiles': {
          // CSV export for scouter profiles
          const scoutersData = await gameDB.scouters.toArray();
          const predictionsData = await gameDB.predictions.toArray();
          
          if (scoutersData.length === 0 && predictionsData.length === 0) {
            alert("Nenhum dado de perfil de souter encontrado.");
            return;
          }

          // Create CSV for scouter profiles
          const scouterHeaders = ['Name', 'Stakes', 'Stakes From Predictions', 'Total Predictions', 'Correct Predictions', 'Accuracy %', 'Current Streak', 'Longest Streak', 'Created At', 'Last Updated'];
          const scouterRows = scoutersData.map(scouter => [
            scouter.name,
            scouter.stakes,
            scouter.stakesFromPredictions,
            scouter.totalPredictions,
            scouter.correctPredictions,
            scouter.totalPredictions > 0 ? Math.round((scouter.correctPredictions / scouter.totalPredictions) * 100) : 0,
            scouter.currentStreak,
            scouter.longestStreak,
            new Date(scouter.createdAt).toLocaleDateString(),
            new Date(scouter.lastUpdated).toLocaleDateString()
          ]);
          
          const scouterCsvData = [scouterHeaders, ...scouterRows];
          csv = convertArrayOfArraysToCSV(scouterCsvData as (string | number)[][]);
          filename = `ManeuverScouterProfiles-${new Date().toLocaleTimeString()}-local.csv`;
          break;
        }
        default:
          alert("Tipo de dado desconhecido selecionado.");
          return;
      }

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Falha ao exportar dados como CSV:", error);
      alert("Falha ao exportar dados como CSV.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center px-4 pt-6 pb-6">
      <div className="flex flex-col items-start gap-4 max-w-md w-full">
        <h1 className="text-2xl font-bold">Transferência de dados JSON</h1>
        <p className="text-muted-foreground">
          Exporte seus dados como CSV para análise ou carregue arquivos JSON para substituir seu armazenamento de dados local. Selecione abaixo o tipo de dado que deseja exportar.
        </p>


        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo de dados a exportar:</label>
            <Select value={dataType} onValueChange={(value: 'scouting' | 'scouterProfiles' | 'pitScouting' | 'pitScoutingImagesOnly') => setDataType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scouting">Dados de Scouting</SelectItem>
                <SelectItem value="scouterProfiles">Perfil de Scouter</SelectItem>
                <SelectItem value="pitScouting">Dados de Pit Scouting</SelectItem>
                <SelectItem value="pitScoutingImagesOnly">Somente imagem de Pit Scouting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={async () => {
              try {
                let dataToExport: unknown;
                let filename: string;

                switch (dataType) {
                  case 'scouting': {
                    const scoutingDataWithIds = await loadScoutingData();
                    
                    if (scoutingDataWithIds.entries.length === 0) {
                      alert("Nenhum dado de scouting encontrado.");
                      return;
                    }

                    dataToExport = scoutingDataWithIds;
                    filename = `ManeuverScoutingData-${new Date().toLocaleTimeString()}.json`;
                    break;
                  }
                  case 'pitScouting': {
                    const pitData = await loadPitScoutingData();
                    
                    if (pitData.entries.length === 0) {
                      alert("Nenhum dado de pit scouting encontrado.");
                      return;
                    }

                    dataToExport = pitData;
                    filename = `ManeuverPitScoutingData-${new Date().toLocaleTimeString()}.json`;
                    break;
                  }
                  case 'pitScoutingImagesOnly': {
                    try {
                      await downloadPitScoutingImagesOnly();
                      return; // downloadPitScoutingImagesOnly handles its own download
                    } catch (error) {
                      console.error('Erro ao baixar imagens de pit scouting:', error);
                      alert("Erro ao baixar imagens de pit scouting.");
                      return;
                    }
                  }
                  case 'scouterProfiles': {
                    const scoutersData = await gameDB.scouters.toArray();
                    const predictionsData = await gameDB.predictions.toArray();
                    
                    if (scoutersData.length === 0 && predictionsData.length === 0) {
                      alert("Nenhum dado de perfil de scouter encontrado.");
                      return;
                    }

                    dataToExport = {
                      scouters: scoutersData,
                      predictions: predictionsData,
                      exportedAt: new Date().toISOString(),
                      version: "1.0"
                    };
                    filename = `ManeuverScouterProfiles-${new Date().toLocaleTimeString()}.json`;
                    break;
                  }
                  default:
                    alert("Tipo de dado desconhecido selecionado.");
                    return;
                }

                const element = document.createElement("a");
                element.setAttribute(
                  "href",
                  "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2))
                );
                element.setAttribute("download", filename);
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              } catch (error) {
                console.error("Falha ao exportar dados como JSON:", error);
                alert("Falha ao exportar dados como JSON.");
              }
            }}
            className="w-full h-16 text-xl"
          >
            Download {dataType === 'scouting' ? 'Scouting Data' : dataType === 'pitScouting' ? 'Pit Scouting Data' : dataType === 'pitScoutingImagesOnly' ? 'Pit Scouting Images' : 'Scouter Profiles'} as JSON
          </Button>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">Ou</span>
            <Separator className="flex-1" />
          </div>

          <div className="w-full">
            <Button
              onClick={handleDownloadCSV}
              variant="secondary"
              disabled={dataType === 'pitScoutingImagesOnly'}
              className="w-full h-16 text-xl"
            >
              {dataType === 'pitScoutingImagesOnly' 
                ? 'Images Cannot Be Downloaded as CSV' 
                : `Download ${dataType === 'scouting' ? 'Scouting Data' : dataType === 'pitScouting' ? 'Pit Scouting Data' : 'Scouter Profiles'} as CSV`
              }
            </Button>
            {dataType === 'pitScouting' && (
              <p className="text-xs text-muted-foreground mt-1 text-center">
                A exportação CSV inclui dados e recursos da equipe, mas exclui imagens de robôs
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            onClick={() => setMode('upload')}
            variant="outline"
            className="w-full h-16 text-xl"
          >
            Carregar dados JSON
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-start space-y-1">
          <p>- CSV: Exportar dados para análise em planilhas</p>
          <p>- JSON: Exportar/importar dados para backup ou transferência entre dispositivos</p>
          <p>- Dados de Scouting: Desempenho em partidas</p>
          <p>- Perfis de Scouter: Conquistas e previsões dos usuários</p>
          <p>- Pit Scouting: Especificações técnicas e capacidades das equipes</p>
          <p>- Apenas Imagens de Pit Scouting: Fotos dos robôs para mesclar com dados existentes (requer dados em texto primeiro)</p>
        </div>
      </div>
    </div>
  );
};

export default JSONDataTransferPage;