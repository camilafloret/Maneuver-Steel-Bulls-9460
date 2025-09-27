import { useState, useEffect, useCallback } from "react";
import { loadScoutingData } from "@/lib/scoutingDataUtils";
import { gameDB, pitDB } from "@/lib/dexieDB";
import { getPitScoutingStats } from "@/lib/pitScoutingUtils";

export interface DataStats {
  scoutingDataCount: number;
  pitScoutingDataCount: number;
  matchDataCount: number;
  scouterGameDataCount: number;
  apiDataCount: number;
  scoutingDataSize: string;
  pitScoutingDataSize: string;
  matchDataSize: string;
  scouterGameDataSize: string;
  apiDataSize: string;
}

const formatDataSize = (data: BlobPart | null) => {
  if (!data) return "0 B";
  const bytes = new Blob([data]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const useDataStats = () => {
  const [stats, setStats] = useState<DataStats>({
    scoutingDataCount: 0,
    pitScoutingDataCount: 0,
    matchDataCount: 0,
    scouterGameDataCount: 0,
    apiDataCount: 0,
    scoutingDataSize: "0 B",
    pitScoutingDataSize: "0 B",
    matchDataSize: "0 B",
    scouterGameDataSize: "0 B",
    apiDataSize: "0 B",
  });

  const loadScoutingCount = useCallback(async () => {
    try {
      const scoutingData = await loadScoutingData();
      const dataString = JSON.stringify(scoutingData.entries);
      const size = formatDataSize(dataString);
      
      setStats(prev => ({
        ...prev,
        scoutingDataCount: scoutingData.entries.length,
        scoutingDataSize: size,
      }));
    } catch (error) {
      console.error("Erro ao carregar dados de scouting:", error);
      setStats(prev => ({
        ...prev,
        scoutingDataCount: 0,
        scoutingDataSize: "0 B",
      }));
    }
  }, []);

  const loadPitScoutingCount = useCallback(async () => {
    try {
      const pitStats = await getPitScoutingStats();
      const pitData = await pitDB.pitScoutingData.toArray();
      const pitSize = formatDataSize(JSON.stringify(pitData));
      
      setStats(prev => ({
        ...prev,
        pitScoutingDataCount: pitStats.totalEntries,
        pitScoutingDataSize: pitSize,
      }));
    } catch (error) {
      console.error("Erro ao carregar dados de scouting pit:", error);
      setStats(prev => ({
        ...prev,
        pitScoutingDataCount: 0,
        pitScoutingDataSize: "0 B",
      }));
    }
  }, []);

  const loadScouterGameCount = useCallback(async () => {
    try {
      const scoutersCount = await gameDB.scouters.count();
      const predictionsCount = await gameDB.predictions.count();
      const totalEntries = scoutersCount + predictionsCount;
      
      const scoutersData = await gameDB.scouters.toArray();
      const predictionsData = await gameDB.predictions.toArray();
      const combinedData = { scouters: scoutersData, predictions: predictionsData };
      const gameDataSize = formatDataSize(JSON.stringify(combinedData));
      
      setStats(prev => ({
        ...prev,
        scouterGameDataCount: totalEntries,
        scouterGameDataSize: gameDataSize,
      }));
    } catch (error) {
      console.error("Erro ao carregar dados de jogo do scout:", error);
      setStats(prev => ({
        ...prev,
        scouterGameDataCount: 0,
        scouterGameDataSize: "0 B",
      }));
    }
  }, []);

  const loadApiDataCount = useCallback(() => {
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
      
      let totalSize = 0;
      apiKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      });
      
      let sizeStr = "0 B";
      if (totalSize < 1024) {
        sizeStr = `${totalSize} B`;
      } else if (totalSize < 1024 * 1024) {
        sizeStr = `${(totalSize / 1024).toFixed(1)} KB`;
      } else {
        sizeStr = `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
      }
      
      setStats(prev => ({
        ...prev,
        apiDataCount: apiKeys.length,
        apiDataSize: sizeStr,
      }));
    } catch (error) {
      console.error("Erro ao carregar estatísticas de dados da API:", error);
      setStats(prev => ({
        ...prev,
        apiDataCount: 0,
        apiDataSize: "0 B",
      }));
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadScoutingCount();
    await loadPitScoutingCount();
    await loadScouterGameCount();
    loadApiDataCount();
  }, [loadScoutingCount, loadPitScoutingCount, loadScouterGameCount, loadApiDataCount]);

  const resetStats = useCallback(() => {
    setStats({
      scoutingDataCount: 0,
      pitScoutingDataCount: 0,
      matchDataCount: 0,
      scouterGameDataCount: 0,
      apiDataCount: 0,
      scoutingDataSize: "0 B",
      pitScoutingDataSize: "0 B",
      matchDataSize: "0 B",
      scouterGameDataSize: "0 B",
      apiDataSize: "0 B",
    });
  }, []);

  const updateMatchData = useCallback((matchData: string | null) => {
    if (matchData) {
      try {
        const parsed = JSON.parse(matchData);
        const count = Array.isArray(parsed) ? parsed.length : 0;
        setStats(prev => ({
          ...prev,
          matchDataCount: count,
          matchDataSize: formatDataSize(matchData),
        }));
      } catch {
        setStats(prev => ({
          ...prev,
          matchDataCount: 0,
          matchDataSize: "0 B",
        }));
      }
    } else {
      setStats(prev => ({
        ...prev,
        matchDataCount: 0,
        matchDataSize: "0 B",
      }));
    }
  }, []);

  useEffect(() => {
    const matchData = localStorage.getItem("matchData");
    updateMatchData(matchData);
    refreshData();
  }, [refreshData, updateMatchData]);

  return {
    stats,
    refreshData,
    resetStats,
    updateMatchData,
  };
};
