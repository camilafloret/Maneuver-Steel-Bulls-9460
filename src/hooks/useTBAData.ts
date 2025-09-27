import { useState } from 'react';
import { toast } from 'sonner';
import { type TBAMatch, getMatchResult } from '@/lib/tbaUtils';
import { setCurrentEvent } from '@/lib/eventDataUtils';
import { 
  getEventTeams, 
  storeEventTeams, 
  getStoredEventTeams, 
  clearStoredEventTeams,
  type TBATeam 
} from '@/lib/tbaUtils';

export const useTBAData = () => {
  // Match Data Loading state
  const [matchDataLoading, setMatchDataLoading] = useState(false);

  // Match Results Loading state
  const [matchResultsLoading, setMatchResultsLoading] = useState(false);
  const [matches, setMatches] = useState<TBAMatch[]>([]);

  // Event Teams Loading state
  const [eventTeamsLoading, setEventTeamsLoading] = useState(false);
  const [teams, setTeams] = useState<TBATeam[]>([]);
  const [isStored, setIsStored] = useState(false);

  const fetchMatchDataFromTBA = async (tbaApiKey: string, tbaEventKey: string, rememberForSession: boolean, setApiKey: (key: string) => void) => {
    if (!tbaApiKey.trim()) {
      toast.error("Por favor, insira sua chave de API TBA");
      return;
    }
    
    if (!tbaEventKey.trim()) {
      toast.error("Por favor, insira uma chave de evento");
      return;
    }

    setMatchDataLoading(true);
    
    try {
      const headers = {
        "X-TBA-Auth-Key": tbaApiKey,
      };
      
      const res = await fetch(
        `https://www.thebluealliance.com/api/v3/event/${tbaEventKey}/matches/simple`,
        { headers }
      );
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Chave de API inválida. Verifique sua chave da TBA API.");
        } else if (res.status === 404) {
          throw new Error("Evento não encontrado. Verifique a chave do evento.");
        } else {
          throw new Error(`Falha na requisição da API com status ${res.status}`);
        }
      }
      
      const fullData = await res.json();

      const qualMatchesCleaned = [];

      for (const match of fullData) {
        if (match.comp_level == "qm") {
          qualMatchesCleaned.push({
            matchNum: match["match_number"],
            redAlliance: match.alliances.red.team_keys.map((team: string) =>
              team.replace("frc", "")
            ),
            blueAlliance: match.alliances.blue.team_keys.map((team: string) =>
              team.replace("frc", "")
            ),
          });
        }
      }
      
      qualMatchesCleaned.sort((a, b) => a.matchNum - b.matchNum);

      localStorage.setItem("matchData", JSON.stringify(qualMatchesCleaned));
      localStorage.setItem("eventName", tbaEventKey);
      
      // Update events list
      const savedEvents = localStorage.getItem("eventsList");
      let eventsList: string[] = [];
      
      if (savedEvents) {
        try {
          eventsList = JSON.parse(savedEvents);
        } catch {
          eventsList = [];
        }
      }
      
      if (!eventsList.includes(tbaEventKey)) {
        eventsList.push(tbaEventKey);
        eventsList.sort();
        localStorage.setItem("eventsList", JSON.stringify(eventsList));
      }

      const successMessage = `Dados de partidas carregados: ${qualMatchesCleaned.length} partidas para ${tbaEventKey}`;
      toast.success(successMessage);
      
      // Update current event in localStorage after successful load
      setCurrentEvent(tbaEventKey.trim());
      
      // Clear API key from memory after successful fetch if not remembering
      if (!rememberForSession) {
        setApiKey("");
        sessionStorage.removeItem("tbaApiKey");
      }
    } catch (err) {
      toast.error("Falha ao buscar dados de partida do TBA");
      console.error(err);
    } finally {
      setMatchDataLoading(false);
    }
  };

  const loadMatchResults = async (tbaApiKey: string, tbaEventKey: string, rememberForSession: boolean, setApiKey: (key: string) => void) => {
    if (!tbaEventKey.trim()) {
      toast.error('Por favor, insira uma chave de evento');
      return;
    }

    if (!tbaApiKey.trim()) {
      toast.error('Por favor, insira sua chave de API TBA');
      return;
    }

    setMatchResultsLoading(true);
    try {
      const headers = {
        "X-TBA-Auth-Key": tbaApiKey,
      };
      const response = await fetch(
        `https://www.thebluealliance.com/api/v3/event/${tbaEventKey.trim()}/matches/simple`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`AFalha na solicitação de API com status ${response.status}`);
      }
      
      const fullData = await response.json();
      
      // Filter for qualification matches
      const qualMatches = fullData.filter((match: TBAMatch) => match.comp_level === "qm");
      qualMatches.sort((a: TBAMatch, b: TBAMatch) => a.match_number - b.match_number);
      
      setMatches(qualMatches);
      toast.success(`Carregadas ${qualMatches.length} partidas de qualificação`);
      
      // Update current event in localStorage after successful load
      setCurrentEvent(tbaEventKey.trim());
      
      // Store match results in localStorage for stakes calculation
      const matchResults = qualMatches.map((match: TBAMatch) => ({
        eventKey: tbaEventKey.trim(),
        matchNumber: match.match_number,
        winner: getMatchResult(match).winner,
        redScore: getMatchResult(match).redScore,
        blueScore: getMatchResult(match).blueScore
      }));
      
      localStorage.setItem('matchResults', JSON.stringify(matchResults));
      localStorage.setItem('currentEventKey', tbaEventKey.trim());
      
      // Clear API key from memory if not remembering for session
      if (!rememberForSession) {
        setApiKey("");
        sessionStorage.removeItem("tbaApiKey");
      }
    } catch (error) {
        console.error('Erro ao carregar partidas:', error);
        toast.error('Falha ao carregar partidas. Verifique a chave do evento e a chave da API.');
      setMatches([]);
    } finally {
      setMatchResultsLoading(false);
    }
  };

  const loadEventTeams = async (tbaApiKey: string, tbaEventKey: string, rememberForSession: boolean, setApiKey: (key: string) => void) => {
    if (!tbaEventKey.trim()) {
      toast.error('Por favor, insira uma chave de evento');
      return;
    }

    if (!tbaApiKey.trim()) {
      toast.error('Por favor, insira sua chave de API TBA');
      return;
    }

    setEventTeamsLoading(true);
    try {
      // First check if teams are already stored
      const storedTeamNumbers = getStoredEventTeams(tbaEventKey);
      if (storedTeamNumbers && storedTeamNumbers.length > 0) {
        // Convert stored team numbers back to minimal team objects for display
        const storedTeamObjects: TBATeam[] = storedTeamNumbers.map(teamNumber => ({
          key: `frc${teamNumber}`,
          team_number: teamNumber,
          nickname: `Team ${teamNumber}`,
          name: `Team ${teamNumber}`,
        }));
        setTeams(storedTeamObjects);
        setIsStored(true);
        toast.success(`Carregadas ${storedTeamNumbers.length} equipes do armazenamento local`);
        setEventTeamsLoading(false);
        return;
      }

      // If not stored, fetch from API
      const fetchedTeams = await getEventTeams(tbaEventKey, tbaApiKey);
      setTeams(fetchedTeams);
      setIsStored(false);
      
      toast.success(`Carregadas ${fetchedTeams.length} equipes da TBA API`);
      
      // Update current event in localStorage after successful load
      setCurrentEvent(tbaEventKey.trim());
      
      // Clear API key from memory if not remembering for session
      if (!rememberForSession) {
        setApiKey("");
        sessionStorage.removeItem("tbaApiKey");
      }
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
      toast.error(error instanceof Error ? error.message : 'Falha ao carregar equipes');
    } finally {
      setEventTeamsLoading(false);
    }
  };

  const handleStoreTeams = (eventKey: string) => {
    if (teams.length === 0) {
      toast.error('Nenhuma equipe salva');
      return;
    }

    try {
      storeEventTeams(eventKey, teams);
      setIsStored(true);
      toast.success(`Armazenadas ${teams.length} equipes para atribuições de pit scouting`);
    } catch (error) {
      console.error('Erro ao armazenar equipes:', error);
      toast.error('Falha ao armazenar equipes');
    }
  };

  const handleClearStored = (eventKey: string) => {
    try {            
      clearStoredEventTeams(eventKey);
      setIsStored(false);
      toast.success('Equipes armazenadas apagadas');
    } catch (error) {
      console.error('Erro ao apagar equipes armazenadas:', error);
      toast.error('Falha ao apagar equipes armazenadas');
    }
  };

  return {
    // State
    matchDataLoading,
    matchResultsLoading,
    eventTeamsLoading,
    matches,
    teams,
    isStored,
    
    // Actions
    fetchMatchDataFromTBA,
    loadMatchResults,
    loadEventTeams,
    handleStoreTeams,
    handleClearStored,
  };
};
