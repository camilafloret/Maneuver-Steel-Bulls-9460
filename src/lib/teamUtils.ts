import teamsData from './testData/teams.json';

/**
 * Team-related utility functions and demo data
 */

export type TeamNumber = number;
export type EventKey = string;

export interface EventTeamsData {
  [eventKey: string]: {
    eventName: string;
    teams: TeamNumber[];
    source: 'tba' | 'nexus';
  };
}

/**
 * Get the demo teams list extracted from match schedule
 */
export const getDemoTeams = (): TeamNumber[] => {
  return teamsData;
};

/**
 * Get demo event teams data for testing
 */
export const getDemoEventTeams = (): EventTeamsData => {
  return {
    '2025mrcmp': {
      eventName: 'FMA District Championship',
      teams: teamsData,
      source: 'tba'
    }
  };
};

/**
 * Setup demo event teams data in localStorage for the pit assignments page
 * This simulates having data from TBA for a single event
 */
export const setupDemoEventTeams = (): void => {
  console.log('📋 Configurando equipes de eventos de demonstração...');
  
  const demoEvent = {
    eventKey: '2025mrcmp',
    eventName: 'FMA District Championship',
    teams: teamsData,
    source: 'tba' as const
  };
  
  // Store TBA-style event teams
  const storageKey = `tba_event_teams_${demoEvent.eventKey}`;
  const data = {
    teamNumbers: demoEvent.teams,
    lastFetched: Date.now(),
    eventName: demoEvent.eventName
  };
  localStorage.setItem(storageKey, JSON.stringify(data));
  console.log(`  📋 Evento TBA criado: ${demoEvent.eventName} (${demoEvent.teams.length} equipes)`);
  
  console.log('✅ Configuração de equipes de eventos de demonstração concluída!');
};

/**
 * Clear demo event teams data from localStorage
 */
export const clearDemoEventTeams = (): void => {
  console.log('🧹 Limpando equipes de eventos de demonstração...');
  
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('tba_event_teams_') || 
      key.startsWith('nexus_event_teams_') || 
      key.startsWith('nexus_pit_addresses_')
    )) {
      localStorage.removeItem(key);
      console.log(`  🗑️  Removido: ${key}`);
    }
  }
  
  console.log('✅ Equipes de eventos de demonstração liberadas!');
};

/**
 * Extract unique teams from match schedule data
 * This function was used to generate the teams.json file
 */
export const extractTeamsFromMatches = (matchSchedule: { redAlliance: string[], blueAlliance: string[] }[]): TeamNumber[] => {
  const teams = new Set<number>();
  
  matchSchedule.forEach(match => {
    if (match.redAlliance) {
      match.redAlliance.forEach((team: string) => teams.add(parseInt(team)));
    }
    if (match.blueAlliance) {
      match.blueAlliance.forEach((team: string) => teams.add(parseInt(team)));
    }
  });
  
  return Array.from(teams).sort((a, b) => a - b);
};

export default {
  getDemoTeams,
  getDemoEventTeams,
  setupDemoEventTeams,
  clearDemoEventTeams,
  extractTeamsFromMatches
};
