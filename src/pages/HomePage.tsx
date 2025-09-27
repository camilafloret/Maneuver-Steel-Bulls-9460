import ManeuverVerticalLogo from "../assets/Logotipo.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataAttribution } from "@/components/DataAttribution";
import { useState, useEffect } from "react";
import { loadLegacyScoutingData, loadScoutingData } from "../lib/scoutingDataUtils";
import { gameDB } from "../lib/dexieDB";
import { createAllTestData, clearAllTestData } from "../lib/testDataGenerator";
import { analytics } from '@/lib/analytics';
import { haptics } from '@/lib/haptics';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkExistingData = async () => {
      try {
        const existingData = await loadLegacyScoutingData();
        const existingScouters = await gameDB.scouters.count();
        if (existingData.length > 0 || existingScouters > 0) {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Erro ao verificar dados existentes:", error);
      }
    };

    checkExistingData();
  }, []);

  const loadDemoData = async () => {
    haptics.medium();
    setIsLoading(true);

    try {
      // Load all demo data using the consolidated test data generator
      await createAllTestData();

      // Update events list
      const savedEvents = localStorage.getItem('eventsList');
      let eventsList: string[] = [];
      
      if (savedEvents) {
        try {
          eventsList = JSON.parse(savedEvents);
        } catch {
          eventsList = [];
        }
      }
      
      // Add both demo events
      const demoEvents = ['2025mrcmp', '2025pawar'];
      demoEvents.forEach(event => {
        if (!eventsList.includes(event)) {
          eventsList.push(event);
        }
      });
      eventsList.sort();
      localStorage.setItem('eventsList', JSON.stringify(eventsList));
      localStorage.setItem('eventName', '2025mrcmp'); // Set default event

      // Also add the scouter names to the selectable list in localStorage
      const scouterNames = [
        "Sarah Chen", "Marcus Rodriguez", "Emma Thompson", "Alex Kim", 
        "Jordan Smith", "Riley Davis", "Casey Park", "Taylor Wilson"
      ];
      localStorage.setItem("scoutersList", JSON.stringify(scouterNames.sort()));

      const verifyData = await loadScoutingData();
      console.log("Página inicial - Verificação: carregada", verifyData.entries.length, "entradas do IndexedDB");
      console.log("Página inicial - Todos os dados de demonstração foram carregados com sucesso");

      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsLoaded(true);
      haptics.success();
      analytics.trackDemoDataLoad();
      
    } catch (error) {
      haptics.error();
      console.error("Página inicial - Erro ao carregar dados de demonstração:", error);
      // Show error details to help debug
      if (error instanceof Error) {
        console.error("Detalhes do erro:", error.message, error.stack);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = async () => {
    haptics.medium();
    
    try {
      // Use the consolidated clear function
      await clearAllTestData();
      
      // Clear additional items from localStorage
      localStorage.removeItem("scoutersList");
      localStorage.removeItem("currentScouter");
      localStorage.removeItem("scouterInitials");
      localStorage.removeItem("eventName");
      localStorage.removeItem("eventsList");
      
      setIsLoaded(false);
      analytics.trackDemoDataClear();
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      // Clear localStorage as fallback and update UI anyway
      localStorage.removeItem("scoutingData");
      localStorage.removeItem("scoutersList");
      localStorage.removeItem("currentScouter");
      localStorage.removeItem("scouterInitials");
      localStorage.removeItem("matchData");
      localStorage.removeItem("eventName");
      localStorage.removeItem("eventsList");
      
      // Also clear any pit assignment data as fallback
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('tba_event_teams_') || 
          key.startsWith('nexus_event_teams_') || 
          key.startsWith('nexus_pit_addresses_')
        )) {
          localStorage.removeItem(key);
        }
      }
      
      setIsLoaded(false);
      analytics.trackDemoDataClear();
    }
  };

  return (
    <main className="relative min-h-screen w-full">
      <div
        className={cn(
          "flex flex-col min-h-screen w-full justify-center items-center gap-6 pt-6 pb-24 2xl:pb-6",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      >
        <div className="flex flex-col w-auto justify-center items-center gap-6 scale-75 md:scale-75 lg:scale-100">
          <img
            src={ManeuverVerticalLogo}
            width="200"
            height="240"
            alt="Logotipo"
            className="dark"
          />
          <div className="text-center space-y-2">
            <p>
              <strong>Versão</strong>: 2025.1.2
            </p>
            <DataAttribution sources={['tba', 'nexus']} variant="compact" />
          </div>
        </div>

        {/* Demo Data Section */}
        <Card className="w-full max-w-md mx-4 mt-8 scale-75 md:scale-100">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold">Dados de demonstração</h2>
              <p className="text-sm text-muted-foreground">
                Carregue dados de amostra de observação, perfis de olheiros, dados de observação de boxes e cronograma de partidas do 2025mrcmp para explorar os recursos do aplicativo
              </p>

              {!isLoaded ? (
                <Button
                  onClick={loadDemoData}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Carregando..." : "Carregar dados de demonstração"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Dados de demonstração carregados com sucesso!
                  </div>
                  <p className="text-xs text-muted-foreground">
                    120 partidas • 60 equipes • 8 scouers • 5 pit • evento 2025mrcmp
                  </p>
                  <Button
                    onClick={clearData}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Limpar dados
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_70%,black)] dark:bg-black"></div>
    </main>
  );
};

export default HomePage;
