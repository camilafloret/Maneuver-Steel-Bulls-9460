import { useState, useEffect } from "react";
import { useDataStats } from "@/hooks/useDataStats";
import { useDataCleaning } from "@/hooks/useDataCleaning";
import { DeviceInfoCard } from "@/components/ClearComponents/DeviceInfoCard";
import { BackupRecommendationAlert } from "@/components/ClearComponents/BackupRecommendationAlert";
import { ClearAllDataDialog } from "@/components/ClearComponents/ClearAllDataDialog";
import { DataClearCard } from "@/components/ClearComponents/DataClearCard";


const ClearDataPage = () => {
  const [playerStation, setPlayerStation] = useState("");
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const { stats, refreshData, resetStats, updateMatchData } = useDataStats();
  const {
    handleClearScoutingData,
    handleClearPitScoutingData,
    handleClearScouterGameData,
    handleClearMatchData,
    handleClearApiData,
    handleClearAllData,
  } = useDataCleaning(refreshData, resetStats, updateMatchData);

  useEffect(() => {
    const station = localStorage.getItem("playerStation") || "Unknown";
    setPlayerStation(station);
  }, []);

  return (
    <div className="min-h-screen w-full px-4 pt-6 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-start gap-4 max-w-2xl mb-6">
          <h1 className="text-2xl font-bold">Limpar dados</h1>
          <p className="text-muted-foreground">
            Exclua permanentemente os dados armazenados neste dispositivo. Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Top Row - Device Info and Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <DeviceInfoCard playerStation={playerStation} />
          <BackupRecommendationAlert 
            onClearAllClick={() => setShowClearAllConfirm(true)} 
          />
        </div>

        {/* Data Clear Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DataClearCard
            title="Dados de Scouting de Partidas"
            description="Informações de scouting de partidas coletadas neste dispositivo"
            entryCount={stats.scoutingDataCount}
            entryLabel="entries"
            storageSize={stats.scoutingDataSize}
            onClear={handleClearScoutingData}
          />

          <DataClearCard
            title="Dados de Pit Scouting"
            description="Informações de scouting de robôs coletadas nos eventos"
            entryCount={stats.pitScoutingDataCount}
            entryLabel="entries"
            storageSize={stats.pitScoutingDataSize}
            onClear={handleClearPitScoutingData}
          />

          <DataClearCard
            title="Dados de Perfil do Scouter"
            description="Previsões do scouter, apostas e dados do ranking"
            entryCount={stats.scouterGameDataCount}
            entryLabel="entries"
            storageSize={stats.scouterGameDataSize}
            onClear={handleClearScouterGameData}
            warningMessage={`Isso irá excluir permanentemente ${stats.scouterGameDataCount} entradas de jogo do scouter (scouters e previsões).`}
          />

          <DataClearCard
            title="Dados da API TBA & Nexus"
            description="Equipes, dados de pit, partidas e informações de eventos obtidos pelas APIs"
            entryCount={stats.apiDataCount}
            entryLabel="items"
            storageSize={stats.apiDataSize}
            onClear={handleClearApiData}
            warningMessage={`Isso irá excluir permanentemente todos os dados de API baixados, incluindo equipes, endereços de pit, mapas de pit, resultados de partidas e informações de eventos.`}
          />

          <DataClearCard
            title="Dados do Cronograma de Partidas"
            description="Cronograma de partidas do torneio e informações das equipes"
            entryCount={stats.matchDataCount}
            entryLabel="matches"
            storageSize={stats.matchDataSize}
            onClear={handleClearMatchData}
          />
        </div>
      </div>

      <ClearAllDataDialog
        open={showClearAllConfirm}
        onOpenChange={setShowClearAllConfirm}
        onConfirm={handleClearAllData}
        scoutingDataCount={stats.scoutingDataCount}
        pitScoutingDataCount={stats.pitScoutingDataCount}
        scouterGameDataCount={stats.scouterGameDataCount}
        apiDataCount={stats.apiDataCount}
        matchDataCount={stats.matchDataCount}
      />
    </div>
  );
};

export default ClearDataPage;
