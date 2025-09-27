import { useCallback } from "react";
import { toast } from "sonner";
import { clearAllScoutingData, clearGameData } from "@/lib/dexieDB";
import { clearAllPitScoutingData } from "@/lib/pitScoutingUtils";

export const useDataCleaning = (
  refreshData: () => Promise<void>, 
  resetStats: () => void,
  updateMatchData?: (matchData: string | null) => void
) => {
  const handleClearScoutingData = useCallback(async () => {
    try {
      await clearAllScoutingData();
      localStorage.setItem("scoutingData", JSON.stringify({ data: [] }));
      
      await refreshData();
      toast.success("Apagou todos os dados de scouting");
    } catch (error) {
      console.error("Erro ao limpar dados de scouting:", error);
      localStorage.setItem("scoutingData", JSON.stringify({ data: [] }));
      await refreshData();
      toast.success("Apagou todos os dados de scouting");
    }
  }, [refreshData]);

  const handleClearPitScoutingData = useCallback(async () => {
    try {
      await clearAllPitScoutingData();
      await refreshData();
      toast.success("Limpou todos os dados de Limpou todos os dados de scouting de pit");
    } catch (error) {
      console.error("Erro ao apagar os dados de scouting de pit:", error);
      toast.error("Falha ao apagar os dados de scouting de pit");
    }
  }, [refreshData]);

  const handleClearScouterGameData = useCallback(async () => {
    try {
      await clearGameData();
      
      localStorage.removeItem("scoutersList");
      localStorage.removeItem("currentScouter");
      localStorage.removeItem("scouterInitials");
      
      window.dispatchEvent(new CustomEvent('scouterDataCleared'));
      
      await refreshData();
      toast.success("Todos os dados de perfil dos scouts foram apagados");
      console.log("ClearDataPage - Dados de perfil dos scouts apagados com sucesso");
    } catch (error) {
      console.error("Erro ao apagar os dados de perfil dos scouts:", error);
      toast.error("Falha ao apagar os dados de perfil dos scouts");
    }
  }, [refreshData]);

  const handleClearMatchData = useCallback(() => {
    localStorage.setItem("matchData", "");
    if (updateMatchData) {
      updateMatchData(null);
    }
    toast.success("Dados do cronograma de partidas apagados");
  }, [updateMatchData]);

  const handleClearApiData = useCallback(() => {
    try {
      const allKeys = Object.keys(localStorage);
      const apiKeys = allKeys.filter(key => 
        key.includes('tba_') || 
        key.startsWith('tba_') ||
        key.includes('nexus_') || 
        key.startsWith('nexus_') ||
        key === 'matchData' ||
        key === 'eventsList' ||
        key === 'eventName' ||
        key.includes('matchResults_') ||
        key.includes('stakesAwarded_') ||
        key.includes('pit_assignments_')
      );
      
      console.log('Apagando chaves de dados da API:', apiKeys);
      
      apiKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      refreshData();
      toast.success(`Todos os dados da API apagados (${apiKeys.length} itens)`);
      } catch (error) {
        console.error("Erro ao apagar os dados da API:", error);
        toast.error("Falha ao apagar os dados da API");
      }
  }, [refreshData]);

  const handleClearAllData = useCallback(async () => {
    try {
      console.log("localStorage antes de apagar:", Object.keys(localStorage));

      await clearAllScoutingData();
      await clearAllPitScoutingData();
      await clearGameData();
      
      localStorage.clear();
      
      console.log("localStorage depois de apagar:", Object.keys(localStorage));
      
      resetStats();
      
      window.dispatchEvent(new CustomEvent('scouterDataCleared'));
      window.dispatchEvent(new CustomEvent('allDataCleared'));
      
      toast.success("Todos os dados apagados – limpeza completa", {
        description: "Todos os dados armazenados foram removidos permanentemente deste dispositivo."
      });
      
    } catch (error) {
      console.error("Erro ao apagar todos os dados:", error);
      toast.error("Falha ao apagar todos os dados");
    }
  }, [resetStats]);

  return {
    handleClearScoutingData,
    handleClearPitScoutingData,
    handleClearScouterGameData,
    handleClearMatchData,
    handleClearApiData,
    handleClearAllData,
  };
};
