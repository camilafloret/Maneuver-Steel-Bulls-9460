import React, { useState, useEffect } from 'react';

// Import hooks and components
import { useTBAData } from '@/hooks/useTBAData';
import ApiKeyForm from '@/components/MatchResultsComponents/ApiKeyForm';
import MatchDataLoader from '@/components/TBADataComponents/MatchDataLoader';
import { MatchSelector } from '@/components/MatchResultsComponents/MatchSelector';
import { ProcessingResults } from '@/components/MatchResultsComponents/ProcessingResults';
import { DataTypeSelector, type TBADataType } from '@/components/TBADataComponents/DataTypeSelector';
import { EventConfigurationCard } from '@/components/TBADataComponents/EventConfigurationCard';
import { DataOperationsCard } from '@/components/TBADataComponents/DataOperationsCard';
import { EventSwitchConfirmDialog } from '@/components/TBADataComponents/EventSwitchConfirmDialog';
import { EventTeamsDisplay } from '@/components/TBADataComponents/EventTeamsDisplay';
import { PitDataDisplay } from '@/components/TBADataComponents/PitDataDisplay';
import { DataStatusCard } from '@/components/TBADataComponents/DataStatusCard';
import { DataAttribution } from '@/components/DataAttribution';
import { getNexusPitData, storePitData, getStoredPitData, getNexusEvents, extractAndStoreTeamsFromPitAddresses, type NexusPitAddresses, type NexusPitMap } from '@/lib/nexusUtils';
import { clearEventData, hasStoredEventData, setCurrentEvent, getCurrentEvent, isDifferentEvent } from '@/lib/eventDataUtils';
import { toast } from 'sonner';

interface ProcessingResult {
  matchNumber: number;
  winner: string;
  predictionsCount: number;
  correctPredictions: number;
  stakesAwarded: number;
}

const APIDataPage: React.FC = () => {
  // Shared state for API configuration
  const [apiKey, setApiKey] = useState('');
  const [nexusApiKey, setNexusApiKey] = useState('');
  const [eventKey, setEventKey] = useState('');
  const [rememberForSession, setRememberForSession] = useState(false);
  const [dataType, setDataType] = useState<TBADataType>('match-data');
  
  // Event data management
  const [clearingEventData, setClearingEventData] = useState(false);
  const [storedDataExists, setStoredDataExists] = useState(false);
  
  // Event switch confirmation
  const [showEventSwitchDialog, setShowEventSwitchDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  
  // Processing results state
  const [processedResults, setProcessedResults] = useState<ProcessingResult[]>([]);
  
  // Nexus data state
  const [pitDataLoading, setPitDataLoading] = useState(false);
  const [pitData, setPitData] = useState<{
    addresses: NexusPitAddresses | null;
    map: NexusPitMap | null;
  }>({ addresses: null, map: null });
  
  // Debug Nexus state
  const [debugNexusLoading, setDebugNexusLoading] = useState(false);

  // Use the TBA data hook
  const {
    matchDataLoading,
    matchResultsLoading,
    eventTeamsLoading,
    matches,
    teams,
    isStored,
    fetchMatchDataFromTBA,
    loadMatchResults,
    loadEventTeams,
    handleStoreTeams,
    handleClearStored,
  } = useTBAData();

  // Check for stored data when event key changes
  useEffect(() => {
    if (eventKey.trim()) {
      setStoredDataExists(hasStoredEventData(eventKey));
    } else {
      setStoredDataExists(false);
    }
  }, [eventKey]);

  // Handler to clear all event data
  const handleClearAllEventData = async () => {
    if (!eventKey.trim()) {
      toast.error('Nenhum evento selecionado');
      return;
    }

    setClearingEventData(true);
    try {
      clearEventData(eventKey);
      setStoredDataExists(false);
      
      // Reset component state
      setPitData({ addresses: null, map: null });
      setProcessedResults([]);
    } catch (error) {
      console.error('Erro ao limpar os dados do evento:', error);
      toast.error('Falha ao limpar alguns dados do evento');
    } finally {
      setClearingEventData(false);
    }
  };

  // Helper function to check if confirmation is needed before data operations
  const executeWithConfirmation = (action: () => void) => {
    if (isDifferentEvent(eventKey)) {
      setPendingAction(() => action);
      setShowEventSwitchDialog(true);
    } else {
      action();
    }
  };

  const handleConfirmEventSwitch = () => {
    pendingAction();
    setShowEventSwitchDialog(false);
    setPendingAction(() => {});
  };

  const handleCancelEventSwitch = () => {
    setShowEventSwitchDialog(false);
    setPendingAction(() => {});
  };

  // Handler functions that call the hook functions with current state
  const handleLoadMatchData = () => {
    executeWithConfirmation(() => {
      fetchMatchDataFromTBA(apiKey, eventKey, rememberForSession, setApiKey);
    });
  };

  const handleLoadMatchResults = () => {
    executeWithConfirmation(() => {
      loadMatchResults(apiKey, eventKey, rememberForSession, setApiKey);
    });
  };

  const handleLoadEventTeams = () => {
    executeWithConfirmation(() => {
      loadEventTeams(apiKey, eventKey, rememberForSession, setApiKey);
    });
  };

  const handleLoadPitData = async () => {
    if (!nexusApiKey.trim()) {
      toast.error('Por favor, insira sua chave de API do Nexus');
      return;
    }

    if (!eventKey.trim()) {
      toast.error('Por favor, insira uma chave de evento');
      return;
    }

    executeWithConfirmation(async () => {
      setPitDataLoading(true);
      try {
        // First check if pit data is already stored
      const storedData = getStoredPitData(eventKey);
      if (storedData.addresses || storedData.map) {
        setPitData(storedData);
        toast.success('Dados de pit carregados do armazenamento local');
        
        // Update current event in localStorage after successful load
        setCurrentEvent(eventKey.trim());
        
        setPitDataLoading(false);
        return;
      }

      // If not stored, fetch from Nexus API
      const fetchedData = await getNexusPitData(eventKey, nexusApiKey);
      setPitData(fetchedData);
      
      // Store the data locally
      storePitData(eventKey, fetchedData.addresses, fetchedData.map);
      
      // Update current event in localStorage after successful load
      setCurrentEvent(eventKey.trim());
      
      // Extract and store teams from pit addresses for pit assignments
      let extractedTeamCount = 0;
      if (fetchedData.addresses && Object.keys(fetchedData.addresses).length > 0) {
        try {
          const extractedTeams = extractAndStoreTeamsFromPitAddresses(eventKey, fetchedData.addresses);
          extractedTeamCount = extractedTeams.length;
          console.log(`Extraiu ${extractedTeamCount} equipes de endereços de pit para atribuições de pit`);
        } catch (error) {
          console.warn('Falha ao extrair equipes dos endereços do pit:', error);
        }
      }
      
      const addressCount = fetchedData.addresses ? Object.keys(fetchedData.addresses).length : 0;
      const hasMap = fetchedData.map !== null;
      
      if (addressCount > 0 && hasMap) {
        const message = extractedTeamCount > 0
        ? `Dados de pit carregados: ${addressCount} endereços, mapa do pit e ${extractedTeamCount} equipes extraídas para atribuição de pits`
        : `Dados de pit carregados: ${addressCount} endereços e mapa do pit`;
        toast.success(message);
      } else if (addressCount > 0) {
        const message = extractedTeamCount > 0
        ? `Carregados ${addressCount} endereços de pit e ${extractedTeamCount} equipes extraídas para atribuição de pits (mapa não disponível)`
        : `Carregados ${addressCount} endereços de pit (mapa não disponível)`;
        toast.success(message);
      } else if (hasMap) {
        toast.warning('Mapa do pit carregado, mas nenhum endereço de equipe encontrado');
      } else {
        toast.warning('Nenhum dado de pit disponível para este evento');
      }
      
      // Clear API key from memory if not remembering for session
      if (!rememberForSession) {
        setNexusApiKey("");
        sessionStorage.removeItem("nexusApiKey");
      }
    } catch (error) {
      console.error('Erro ao carregar dados de pit:', error);
      toast.error(error instanceof Error ? error.message : 'Falha ao carregar dados de pit');
    } finally {
      setPitDataLoading(false);
    }
    });
  };

  const handleDebugNexus = async () => {
    if (!nexusApiKey.trim()) {
      toast.error('Por favor, insira sua chave de API do Nexus');
      return;
    }

    setDebugNexusLoading(true);
    try {
      const eventsData = await getNexusEvents(nexusApiKey);      
      const eventCount = Object.keys(eventsData).length;
      toast.success(`Carregados ${eventCount} eventos da API do Nexus`);
      
      // Clear API key from memory if not remembering for session
      if (!rememberForSession) {
        setNexusApiKey("");
        sessionStorage.removeItem("nexusApiKey");
      }
    } catch (error) {
      console.error('Erro ao carregar eventos do Nexus:', error);
      toast.error(error instanceof Error ? error.message : 'Falha ao carregar eventos do Nexus');
    } finally {
      setDebugNexusLoading(false);
    }
  };

  const handleProcessingComplete = (results: ProcessingResult[]) => {
    setProcessedResults(results);
  };

  // Create handlers with correct signatures for the components
  const handleStoreTeamsWithEventKey = () => {
    handleStoreTeams(eventKey);
  };

  const handleClearStoredWithEventKey = () => {
    handleClearStored(eventKey);
  };

  return (
    <div className="min-h-screen container mx-auto p-4 space-y-6 max-w-7xl">
      <div className="text-start">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dados de API</h1>
            <p className="text-muted-foreground">
              Importe cronogramas de partidas, resultados e listas de equipes da The Blue Alliance ou informações de boxes do Nexus para o FRC.
            </p>
          </div>
          {/* Attribution for TBA and Nexus APIs */}
          <div className="hidden md:block">
            <DataAttribution sources={['tba', 'nexus']} variant="full" />
          </div>
        </div>
        <div className="md:hidden mt-2">
          <DataAttribution sources={['tba', 'nexus']} variant="compact" />
        </div>
      </div>

      {/* Configuration Cards - Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Key Form */}
        <div className="lg:col-span-1 h-full">
          <ApiKeyForm
            apiKey={apiKey}
            setApiKey={setApiKey}
            nexusApiKey={nexusApiKey}
            setNexusApiKey={setNexusApiKey}
            rememberForSession={rememberForSession}
            setRememberForSession={setRememberForSession}
          />
        </div>

        <div className='flex flex-col justify-between gap-6 lg:col-span-1'>
          {/* Event Configuration */}
          <div className="lg:col-span-1">
            <EventConfigurationCard
              eventKey={eventKey}
              setEventKey={setEventKey}
              hasStoredData={storedDataExists}
              onClearAllData={handleClearAllEventData}
              clearingData={clearingEventData}
            />
          </div>

          {/* Data Type Selection */}
          <div className="lg:col-span-1">
            <DataTypeSelector
              dataType={dataType}
              setDataType={setDataType}
            />
          </div>
        </div>
        
      </div>

      {/* Data Status Card */}
      <DataStatusCard eventKey={eventKey} />

      {/* Data Operations */}
      <DataOperationsCard
        dataType={dataType}
        eventKey={eventKey}
        apiKey={apiKey}
        nexusApiKey={nexusApiKey}
        matchDataLoading={matchDataLoading}
        matchResultsLoading={matchResultsLoading}
        eventTeamsLoading={eventTeamsLoading}
        pitDataLoading={pitDataLoading}
        debugNexusLoading={debugNexusLoading}
        onLoadMatchData={handleLoadMatchData}
        onLoadMatchResults={handleLoadMatchResults}
        onLoadEventTeams={handleLoadEventTeams}
        onLoadPitData={handleLoadPitData}
        onDebugNexus={handleDebugNexus}
      />

      {/* Match Data Loader */}
      {dataType === 'match-data' && (
        <MatchDataLoader />
      )}

      {/* Match Results Section */}
      {dataType === 'match-results' && (
        <>
          <MatchSelector matches={matches} onProcessingComplete={handleProcessingComplete} />
          
          {processedResults.length > 0 && (
            <ProcessingResults results={processedResults} />
          )}
        </>
      )}

      {/* Event Teams Display */}
      {dataType === 'event-teams' && (
        <EventTeamsDisplay
          teams={teams}
          eventKey={eventKey}
          isStored={isStored}
          onStoreTeams={handleStoreTeamsWithEventKey}
          onClearStored={handleClearStoredWithEventKey}
        />
      )}

      {/* Pit Data Display */}
      {dataType === 'pit-data' && (
        <PitDataDisplay
          addresses={pitData.addresses}
          map={pitData.map}
          eventKey={eventKey}
        />
      )}

      {/* Event Switch Confirmation Dialog */}
      <EventSwitchConfirmDialog
        open={showEventSwitchDialog}
        onOpenChange={setShowEventSwitchDialog}
        onConfirm={handleConfirmEventSwitch}
        onCancel={handleCancelEventSwitch}
        currentEvent={getCurrentEvent()}
        newEvent={eventKey}
        hasStoredData={getCurrentEvent() ? hasStoredEventData(getCurrentEvent()) : false}
      />
    </div>
  );
};

export default APIDataPage;
