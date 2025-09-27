// Debug utilities for pit assignments and spatial clustering
import { getStoredPitData } from '@/lib/nexusUtils';

export interface DebugTeamInfo {
  teamNumber: number;
  coordinates?: { x: number; y: number };
  cluster?: number;
  scouter?: string;
}

// Set up debug functions for development
export function setupDebugFunctions(): void {
  // Manual extraction helper
  (window as unknown as Record<string, unknown>).manuallyExtractNexusTeams = (eventKey: string) => {
    console.log(`Tentando extrair manualmente as equipes para o evento: ${eventKey}`);
    
    // Check if pit data exists  
    const pitData = getStoredPitData(eventKey);
    console.log('Dados de pit encontrados:', pitData);
    
    // Try to extract teams directly from pit map data
    if (pitData.map && pitData.map.pits) {
      console.log('Extraindo do mapa do pit...');
      const teams: number[] = [];
      
      Object.values(pitData.map.pits).forEach((pit: unknown) => {
        if (pit && typeof pit === 'object' && 'team' in pit) {
          const teamNumber = Number(pit.team);
          if (!isNaN(teamNumber)) {
            teams.push(teamNumber);
          }
        }
      });
      
      console.log('Equipes extraídas do mapa de pit:', teams.sort((a, b) => a - b));
      
      if (teams.length > 0) {
        // Store in localStorage
        const nexusKey = `nexus_event_teams_${eventKey}`;
        localStorage.setItem(nexusKey, JSON.stringify(teams));
        console.log(`Stored ${teams.length} teams to ${nexusKey}`);
      }
    } else if (pitData.addresses && Object.keys(pitData.addresses).length > 0) {
      console.log('Extraindo endereços...');
      const teams = Object.keys(pitData.addresses).map(Number).filter(n => !isNaN(n));
      console.log('Equipes extraídas de endereços:', teams.sort((a, b) => a - b));
      
      if (teams.length > 0) {
        const nexusKey = `nexus_event_teams_${eventKey}`;
        localStorage.setItem(nexusKey, JSON.stringify(teams));
        console.log(`Armazenada ${teams.length} equipes para ${nexusKey}`);
      }
    } else {
      console.log('Nenhum dado de pit encontrado para extrair equipes');
    }
  };
  
  // List available pit data
  (window as unknown as Record<string, unknown>).listAvailablePitData = () => {
    console.log('=== Dados de Pit Disponíveis ===');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('nexus_pit_data_') || key.includes('nexus_pit_addresses_'))) {
        const data = localStorage.getItem(key);
        const parsed = data ? JSON.parse(data) : null;
        console.log(`${key}:`, parsed);
      }
    }
  };
  
  // Debug localStorage
  (window as unknown as Record<string, unknown>).debugPitAssignments = () => {
    console.log('=== Depuração manual localStorage ===');
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('nexus') || key.includes('tba'))) {
        allKeys.push(key);
      }
    }
    console.log('Todas as chaves Nexus/TBA:', allKeys);
    
    allKeys.forEach(key => {
      const data = localStorage.getItem(key);
      try {
        const parsed = JSON.parse(data || '{}');
        console.log(`${key}:`, parsed);
      } catch {
        console.log(`${key}: (falha na análise)`, data);
      }
    });
  };
}

// Debug specific teams and their spatial assignments
export function debugTeamAssignments(
  teams: DebugTeamInfo[],
  targetTeams: number[] = [9977, 9990, 8876, 9991]
): void {
  console.log('\n=== Depuração de atribuição de equipe ===');
  
  targetTeams.forEach(teamNumber => {
    const team = teams.find(t => t.teamNumber === teamNumber);
    if (team) {
      console.log(`Equipe ${teamNumber}:`, {
        coordinates: team.coordinates,
        cluster: team.cluster,
        scouter: team.scouter
      });
    } else {
      console.log(`Equipe ${teamNumber}: não encontrada`);
    }
  });
}

// Log spatial assignment statistics
export function logSpatialStats(
  totalTeams: number,
  teamsWithPositions: number,
  clusterSizes: number[],
  scouterNames: string[]
): void {
  console.log('Atribuição espacial concluída:', {
    totalTeamsRequested: totalTeams,
    totalTeamsWithPositions: teamsWithPositions,
    missingPositions: totalTeams - teamsWithPositions,
    clusterSizes,
    scouterAssignments: scouterNames.map((name, index) => ({
      scouter: name,
      teams: clusterSizes[index] || 0
    }))
  });
}
