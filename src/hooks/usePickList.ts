import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { loadLegacyScoutingData } from "../lib/scoutingDataUtils";
import { getAllStoredEventTeams } from "../lib/tbaUtils";
import { 
  sortTeams, 
  filterTeams, 
  isTeamInList, 
  createPickListItem, 
  calculateTeamStats, 
  createDefaultTeamStats 
} from "../lib/pickListUtils";
import type { TeamStats, PickList, PickListItem, SortOption } from "../lib/pickListTypes";
import type { Alliance, BackupTeam } from "../lib/allianceTypes";

export const usePickList = () => {
  const [availableTeams, setAvailableTeams] = useState<TeamStats[]>([]);
  const [pickLists, setPickLists] = useState<PickList[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [backups, setBackups] = useState<BackupTeam[]>([]);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("number");
  const [activeTab, setActiveTab] = useState("teams");
  const [showAllianceSelection, setShowAllianceSelection] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debug function (expose to window for browser console debugging)
  const debugLocalStorage = useCallback(() => {
    console.log("=== Depuração de armazenamento local ===");
    console.log("Estado atual das listas de seleção:", pickLists);
    console.log("localStorage pickLists:", localStorage.getItem("pickLists"));
    console.log("isInitialized:", isInitialized);
    console.log("========================");
  }, [pickLists, isInitialized]);

  // Expose debug function to window in development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as { debugPickLists?: () => void }).debugPickLists = debugLocalStorage;
    }
  }, [pickLists, isInitialized, debugLocalStorage]);

  // Load pick lists from localStorage
  useEffect(() => {
    const savedLists = localStorage.getItem("pickLists");
    if (savedLists) {
      try {
        setPickLists(JSON.parse(savedLists));
      } catch (error) {
        console.error("Erro ao carregar listas de seleção:", error);
        setPickLists([{
          id: 1,
          name: "Lista de seleção primária",
          description: "Prioridade principal de seleção de alianças",
          teams: []
        }]);
      }
    } else {
      setPickLists([{
        id: 1,
        name: "Lista de seleção primária", 
        description: "Prioridade principal de seleção de alianças",
        teams: []
      }]);
    }
    
    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  // Save pick lists to localStorage
  useEffect(() => {
    if (!isInitialized) {
      return; // Don't save during initial load
    }
    
    console.log("useEffect salvando listas de seleção:", pickLists);
    localStorage.setItem("pickLists", JSON.stringify(pickLists));
  }, [pickLists, isInitialized]);

  // Load alliances from localStorage
  useEffect(() => {
    const savedAlliances = localStorage.getItem("alliances");
    if (savedAlliances) {
      try {
        setAlliances(JSON.parse(savedAlliances));
      } catch (error) {
        console.error("Erro ao carregar alianças:", error);
        // Create default 8 alliances
        const defaultAlliances = Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          allianceNumber: i + 1,
          captain: "",
          pick1: "",
          pick2: "",
          pick3: ""
        }));
        setAlliances(defaultAlliances);
      }
    } else {
      // Create default 8 alliances
      const defaultAlliances = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        allianceNumber: i + 1,
        captain: "",
        pick1: "",
        pick2: "",
        pick3: ""
      }));
      setAlliances(defaultAlliances);
    }
  }, []);

  // Save alliances to localStorage
  useEffect(() => {
    if (alliances.length > 0) {
      localStorage.setItem("alliances", JSON.stringify(alliances));
    }
  }, [alliances]);

  // Load backups from localStorage
  useEffect(() => {
    const savedBackups = localStorage.getItem("backups");
    if (savedBackups) {
      try {
        setBackups(JSON.parse(savedBackups));
      } catch (error) {
        console.error("Erro ao carregar backups:", error);
        setBackups([]);
      }
    }
  }, []);

  // Save backups to localStorage
  useEffect(() => {
    if (backups.length > 0) {
      localStorage.setItem("backups", JSON.stringify(backups));
    }
  }, [backups]);

  // Load team data from scouting results
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const scoutingData = await loadLegacyScoutingData();
        
        if (scoutingData.length > 0) {
          // Get unique teams and calculate stats using selectTeam field
          const teamNumbers = [...new Set(scoutingData.map((entry: Record<string, unknown>) => entry.selectTeam?.toString()).filter(Boolean))];
          
          const teamsWithStats = teamNumbers.map(teamNumber => {
            if (!teamNumber) return null;
            const teamEntries = scoutingData.filter((entry: Record<string, unknown>) => entry.selectTeam?.toString() === teamNumber);
            
            if (teamEntries.length === 0) return null;
            
            return calculateTeamStats(teamNumber, teamEntries);
          }).filter(Boolean) as TeamStats[];
          
          // Add teams from stored event teams that might not have scouting data
          const storedEventTeams = getAllStoredEventTeams();
          const allStoredTeams = new Set<string>();
          
          // Collect all team numbers from all stored events
          Object.values(storedEventTeams).forEach(teamNumbers => {
            teamNumbers.forEach(teamNumber => allStoredTeams.add(teamNumber.toString()));
          });
          
          // Add teams that don't have scouting data but are in stored events
          allStoredTeams.forEach(teamNumber => {
            if (!teamsWithStats.find(t => t.teamNumber === teamNumber)) {
              teamsWithStats.push(createDefaultTeamStats(teamNumber));
            }
          });
          
          teamsWithStats.sort((a, b) => Number(a.teamNumber) - Number(b.teamNumber));
          setAvailableTeams(teamsWithStats);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da equipe:", error);
      }
    };

    loadTeamData();
  }, []);

  // Add team to a pick list
  const addTeamToList = (team: TeamStats, listId: number) => {
    console.log("Adicionando equipe à lista:", team.teamNumber, "Lista: ", listId);
    
    // Check if team is already in this list
    const list = pickLists.find(l => l.id === listId);
    if (list && isTeamInList(team, list)) {
      toast.error(`Equipe ${team.teamNumber} já está em ${list.name}`);
      return;
    }

    const newItem = createPickListItem(team);

    setPickLists(prev => {
      const updated = prev.map(list => 
        list.id === listId 
          ? { ...list, teams: [...list.teams, newItem] }
          : list
      );
      console.log("Listas de seleção atualizadas após adicionar a equipe:", updated);
      return updated;
    });

    toast.success(`Equipe ${team.teamNumber} adicionado a ${pickLists.find(l => l.id === listId)?.name}`);
  };

  // Create new pick list
  const createNewList = () => {
    if (!newListName.trim()) {
      toast.error("Por favor, insira um nome de lista");
      return;
    }

    const newList: PickList = {
      id: Date.now(),
      name: newListName.trim(),
      description: newListDescription.trim(),
      teams: []
    };

    setPickLists(prev => [...prev, newList]);
    setNewListName("");
    setNewListDescription("");
    toast.success("Nova lista de seleção criada");
  };

  // Delete pick list
  const deleteList = (listId: number) => {
    setPickLists(prev => prev.filter(list => list.id !== listId));
    toast.success("Lista de seleção excluída");
  };

  // Update pick list teams order
  const updateListTeams = (listId: number, newTeams: PickListItem[]) => {
    setPickLists(prev => prev.map(list => 
      list.id === listId ? { ...list, teams: newTeams } : list
    ));
  };

  // Export pick lists
  const exportPickLists = () => {
    const dataStr = JSON.stringify(pickLists, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'pick-lists.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Listas de seleção exportada");
  };

  // Import pick lists
  const importPickLists = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Iniciando processo de importação do arquivo:", file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (!result) {
          toast.error("Erro ao ler o arquivo");
          return;
        }

        console.log("Conteúdo do arquivo lido, analisando JSON...");
        const importedData = JSON.parse(result);
        console.log("Parsed data:", importedData);
        
        // Validate that it's an array
        if (!Array.isArray(importedData)) {
          toast.error("Formato de arquivo inválido: Esperava-se uma matriz de listas de seleção");
          return;
        }

        // Validate each pick list has required fields
        const isValidPickList = (list: unknown): list is PickList => {
          const isValid = (
            typeof list === 'object' &&
            list !== null &&
            'id' in list &&
            'name' in list &&
            'description' in list &&
            'teams' in list &&
            Array.isArray((list as PickList).teams)
          );
          if (!isValid) {
            console.log("Lista de seleção inválida encontrada:", list);
          }
          return isValid;
        };

        const validPickLists = importedData.filter(isValidPickList);
        console.log("Listas de seleção válidas encontradas:", validPickLists.length, "Fora de: ", importedData.length);
        
        if (validPickLists.length === 0) {
          toast.error("Nenhuma lista de seleção válida encontrada no arquivo");
          return;
        }

        if (validPickLists.length !== importedData.length) {
          toast.warning(`${importedData.length - validPickLists.length} listas de seleção inválidas foram ignoradas`);
        }

        // Ensure unique IDs to avoid conflicts
        const currentMaxId = Math.max(0, ...pickLists.map(list => list.id));
        const importedWithNewIds = validPickLists.map((list, index) => ({
          ...list,
          id: currentMaxId + index + 1
        }));

        console.log("Definindo listas de seleção para dados importados...");
        // Replace existing lists
        setPickLists(importedWithNewIds);
        toast.success(`${validPickLists.length} listas de seleção importadas com sucesso`);
        
        // Clear the file input
        event.target.value = '';
      } catch (error) {
        console.error("Erro de importação:", error);
        toast.error("Erro ao importar listas de seleção: " + (error as Error).message);
        // Clear the file input on error too
        event.target.value = '';
      }
    };
    
    reader.onerror = () => {
      console.error("Erro no leitor de arquivo");
      toast.error("Erro ao ler o arquivo");
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  // Add team to alliance (finds next available position)
  const addTeamToAlliance = (teamNumber: string, allianceId: number) => {
    const alliance = alliances.find(a => a.id === allianceId);
    if (!alliance) return;

    // Find the next available position
    let position: 'captain' | 'pick1' | 'pick2' | 'pick3' | null = null;
    if (!alliance.captain) position = 'captain';
    else if (!alliance.pick1) position = 'pick1';
    else if (!alliance.pick2) position = 'pick2';
    else if (!alliance.pick3) position = 'pick3';

    if (!position) {
      toast.error(`Alliance ${alliance.allianceNumber} is full`);
      return;
    }

    const updatedAlliances = alliances.map(a => {
      if (a.id === allianceId) {
        return { ...a, [position]: teamNumber };
      }
      return a;
    });
    setAlliances(updatedAlliances);
    
    const positionNames = {
      captain: 'Captain',
      pick1: 'Pick 1',
      pick2: 'Pick 2', 
      pick3: 'Pick 3'
    };
    toast.success(`Equipe ${teamNumber} atribuído como ${positionNames[position]} na Aliança ${alliance.allianceNumber}`);
  };

  // Add team to next available position in alliance and remove from pick list
  const assignToAllianceAndRemove = (teamNumber: string, allianceIndex: number) => {
    const alliance = alliances[allianceIndex];
    if (!alliance) return;

    // Find next available position
    let position: 'captain' | 'pick1' | 'pick2' | 'pick3' | null = null;
    if (!alliance.captain) position = 'captain';
    else if (!alliance.pick1) position = 'pick1';
    else if (!alliance.pick2) position = 'pick2';
    else if (!alliance.pick3) position = 'pick3';

    if (!position) {
      toast.error(`Aliança ${alliance.allianceNumber} está completa`);
      return;
    }

    // Update alliance
    const updatedAlliances = alliances.map((a, index) => {
      if (index === allianceIndex) {
        return { ...a, [position]: teamNumber };
      }
      return a;
    });
    setAlliances(updatedAlliances);

    // Remove from all pick lists
    const updatedPickLists = pickLists.map(list => ({
      ...list,
      teams: list.teams.filter(team => team.text !== `Equipe ${teamNumber}`)
    }));
    setPickLists(updatedPickLists);

    const positionNames = {
      captain: 'Captain',
      pick1: 'Pick 1',
      pick2: 'Pick 2', 
      pick3: 'Pick 3'
    };
    toast.success(`Equipe ${teamNumber} adicionado à Aliança ${alliance.allianceNumber} como ${positionNames[position]} e removidos das listas de seleção`);
  };

  // Assign team from pick list to specific alliance position and remove from pick list
  const assignToAllianceFromPickList = (teamNumber: string, allianceIndex: number, position: number) => {
    const alliance = alliances[allianceIndex];
    if (!alliance) return;

    const positionKeys = ['captain', 'pick1', 'pick2', 'pick3'] as const;
    const positionKey = positionKeys[position];
    
    if (alliance[positionKey]) {
      toast.error(`Aliança ${alliance.allianceNumber} ${positionKey} posição já está ocupada pela Equipe ${alliance[positionKey]}`);
      return;
    }

    // Update alliance
    const updatedAlliances = alliances.map((a, index) => {
      if (index === allianceIndex) {
        return { ...a, [positionKey]: teamNumber };
      }
      return a;
    });
    setAlliances(updatedAlliances);

    // Remove team from all pick lists
    const updatedPickLists = pickLists.map(list => ({
      ...list,
      teams: list.teams.filter(team => team.text !== `Equipe ${teamNumber}`)
    }));
    setPickLists(updatedPickLists);

    const positionNames = {
      captain: 'Captain',
      pick1: 'Pick 1',
      pick2: 'Pick 2', 
      pick3: 'Pick 3 (Backup)'
    };
    toast.success(`Equipe ${teamNumber} atribuído como ${positionNames[positionKey]} da Aliança ${alliance.allianceNumber} e removidos das listas de seleção`);
  };

  // Handle alliance selection toggle
  const handleToggleAllianceSelection = () => {
    const newValue = !showAllianceSelection;
    setShowAllianceSelection(newValue);
    // If hiding alliance selection and currently on alliances tab, switch to teams tab
    if (!newValue && activeTab === "alliances") {
      setActiveTab("teams");
    }
  };

  // Filter and sort available teams
  const filteredAndSortedTeams = sortTeams(
    filterTeams(availableTeams, searchFilter),
    sortBy
  );

  return {
    // State
    availableTeams,
    pickLists,
    alliances,
    backups,
    newListName,
    newListDescription,
    searchFilter,
    sortBy,
    activeTab,
    showAllianceSelection,
    filteredAndSortedTeams,
    
    // State setters
    setNewListName,
    setNewListDescription,
    setSearchFilter,
    setSortBy,
    setActiveTab,
    setAlliances,
    setBackups,
    
    // Actions
    addTeamToList,
    createNewList,
    deleteList,
    updateListTeams,
    exportPickLists,
    importPickLists,
    addTeamToAlliance,
    assignToAllianceFromPickList,
    assignToAllianceAndRemove,
    handleToggleAllianceSelection
  };
};
