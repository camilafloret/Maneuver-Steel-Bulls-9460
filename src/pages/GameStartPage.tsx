import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import GameStartSelectTeam from "@/components/GameStartComponents/GameStartSelectTeam";
import { EventNameSelector } from "@/components/GameStartComponents/EventNameSelector";
import { createMatchPrediction, getPredictionForMatch } from "@/lib/scouterGameUtils";
import { AlertTriangle } from "lucide-react";

const GameStartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const states = location.state;

  const parsePlayerStation = () => {
    const playerStation = localStorage.getItem("playerStation");
    if (!playerStation) return { alliance: "", teamPosition: 0 };
    
    if (playerStation === "lead") {
      return { alliance: "", teamPosition: 0 };
    }
    
    const parts = playerStation.split("-");
    if (parts.length === 2) {
      const alliance = parts[0];
      const position = parseInt(parts[1]);
      return { alliance, teamPosition: position };
    }
    
    return { alliance: "", teamPosition: 0 };
  };

  const stationInfo = parsePlayerStation();

  const getInitialMatchNumber = () => {
    if (states?.inputs?.matchNumber) {
      return states.inputs.matchNumber;
    }
    
    const storedMatchNumber = localStorage.getItem("currentMatchNumber");
    return storedMatchNumber || "1";
  };

  const [alliance, setAlliance] = useState(
    states?.inputs?.alliance || stationInfo.alliance || ""
  );
  const [matchNumber, setMatchNumber] = useState(getInitialMatchNumber());
  const [debouncedMatchNumber, setDebouncedMatchNumber] = useState(matchNumber);
  const [selectTeam, setSelectTeam] = useState(states?.inputs?.selectTeam || "");
  const [eventName, setEventName] = useState(
    states?.inputs?.eventName || localStorage.getItem("eventName") || ""
  );
  const [predictedWinner, setPredictedWinner] = useState<"red" | "blue" | "none">("none");

  // Debounce matchNumber for team selection
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedMatchNumber(matchNumber);
    }, 500);
    return () => clearTimeout(timeout);
  }, [matchNumber]);

  // Effect to save match number to localStorage when it changes
  useEffect(() => {
    if (matchNumber) {
      localStorage.setItem("currentMatchNumber", matchNumber);
    }
  }, [matchNumber]);

  // Effect to load existing prediction when match/event changes
  useEffect(() => {
    const loadExistingPrediction = async () => {
      const currentScouter = getCurrentScouter();
      if (currentScouter && eventName && matchNumber) {
        try {
          const existingPrediction = await getPredictionForMatch(currentScouter, eventName, matchNumber);
          if (existingPrediction) {
            setPredictedWinner(existingPrediction.predictedWinner);
          } else {
            setPredictedWinner("none");
          }
        } catch (error) {
          console.error("Error loading existing prediction:", error);
          setPredictedWinner("none");
        }
      }
    };

    loadExistingPrediction();
  }, [matchNumber, eventName]);

  // Function to handle prediction changes and save them immediately
  const handlePredictionChange = async (newPrediction: "red" | "blue" | "none") => {
    setPredictedWinner(newPrediction);
    
    const currentScouter = getCurrentScouter();
    if (newPrediction !== "none" && currentScouter && eventName && matchNumber) {
      try {
        await createMatchPrediction(currentScouter, eventName, matchNumber, newPrediction);
        toast.success(`Previsão atualizada: aliança ${newPrediction} para vencer`);
      } catch (error) {
        console.error("Erro ao salvar previsão:", error);
        toast.error("Falha ao salvar a previsão");
      }
    }
  };

  const getCurrentScouter = () => {
    return (
      localStorage.getItem("currentScouter") ||
      localStorage.getItem("scouterInitials") ||
      ""
    );
  };

  const validateInputs = () => {
    const currentScouter = getCurrentScouter();
    const inputs = {
      matchNumber,
      alliance,
      selectTeam,
      scouterInitials: currentScouter,
      eventName,
    };
    const hasNull = Object.values(inputs).some((val) => !val || val === "");

    if (!currentScouter) {
      toast.error("Selecione primeiro um scouter na barra lateral");
      return false;
    }

    if (!eventName) {
      toast.error("Defina primeiro um nome/código de evento");
      return false;
    }

    if (hasNull) {
      toast.error("Preencha todos os campos para prosseguir");
      return false;
    }
    return true;
  };

  const handleStartScouting = async () => {
    if (!validateInputs()) return;

    const currentScouter = getCurrentScouter();

    // Save prediction if one was made
    if (predictedWinner !== "none" && currentScouter && eventName && matchNumber) {
      try {
        await createMatchPrediction(currentScouter, eventName, matchNumber, predictedWinner);
        toast.success(`Previsão salva: aliança ${predictedWinner} para vencer`);
      } catch (error) {
        console.error("Erro ao salvar previsão:", error);
        toast.error("Falha ao salvar a previsão");
      }
    }

    // Save inputs to localStorage (similar to ProceedBackButton logic)
    localStorage.setItem("matchNumber", matchNumber);
    localStorage.setItem("selectTeam", selectTeam);
    localStorage.setItem("alliance", alliance);

    localStorage.setItem("autoStateStack", JSON.stringify([]));
    localStorage.setItem("teleopStateStack", JSON.stringify([]));

    navigate("/auto-start", {
      state: {
        inputs: {
          matchNumber,
          alliance,
          scouterInitials: currentScouter,
          selectTeam,
          eventName,
        },
      },
    });
  };

  const handleGoBack = () => {
    navigate("/");
  };


  const handleMatchNumberChange = (value: string) => {
    setMatchNumber(value);
  };

  useEffect(() => {
    if (!matchNumber) return;
    const timeout = setTimeout(() => {
      localStorage.setItem("currentMatchNumber", matchNumber);
    }, 500);
    return () => clearTimeout(timeout);
  }, [matchNumber]);

  const currentScouter = getCurrentScouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 pt-6 pb-8 md:pb-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold pb-4">Início do Jogo</h1>
      </div>
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full flex-1 pb-8 md:pb-4">
        
        {!currentScouter && (
          <Card className="w-full border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-amber-700">
                  Selecione um scouter na barra lateral antes de começar
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Informações da partida</CardTitle>
            {currentScouter && (
              <p className="text-sm text-muted-foreground">
                Scouting como:{" "}
                <span className="font-medium">{currentScouter}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label>Nome/Código do Evento</Label>
              <EventNameSelector
                currentEventName={eventName}
                onEventNameChange={setEventName}
              />
              <p className="text-xs text-muted-foreground">
                O nome do evento será incluído em todos os dados de observação desta sessão
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="match-number">Número da partida</Label>
                <span className="text-xs text-muted-foreground">
                  Incrementos automáticos após cada partida
                </span>
              </div>
              <Input
                id="match-number"
                type="number"
                inputMode="numeric"
                placeholder="Digite o número da partida"
                value={matchNumber}
                onChange={(e) => handleMatchNumberChange(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Alliance Selection with Buttons */}
            <div className="space-y-2">
              <Label>Aliança</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={alliance === "red" ? "default" : "outline"}
                  onClick={() => setAlliance("red")}
                  className={`h-12 text-lg font-semibold ${
                    alliance === "red" 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  }`}
                >
                  <Badge 
                    variant={alliance === "red" ? "secondary" : "destructive"} 
                    className={`w-3 h-3 p-0 mr-2 ${alliance === "red" ? "bg-white" : "bg-red-500"}`}
                  />
                  Aliança Vermelha
                </Button>
                <Button
                  variant={alliance === "blue" ? "default" : "outline"}
                  onClick={() => setAlliance("blue")}
                  className={`h-12 text-lg font-semibold ${
                    alliance === "blue" 
                      ? "bg-blue-500 hover:bg-blue-600 text-white" 
                      : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  <Badge 
                    variant={alliance === "blue" ? "secondary" : "default"} 
                    className={`w-3 h-3 p-0 mr-2 ${alliance === "blue" ? "bg-white" : "bg-blue-500"}`}
                  />
                  Aliança Azul
                </Button>
              </div>
            </div>

            {/* Alliance Prediction Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Previsão da Aliança (Opcional)</Label>
                <span className="text-xs text-muted-foreground">
                  Ganhe pontos por previsões corretas
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={predictedWinner === "red" ? "default" : "outline"}
                  onClick={() => handlePredictionChange("red")}
                  className={`h-10 text-sm font-medium ${
                    predictedWinner === "red" 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  }`}
                >
                  Vitórias Vermelha
                </Button>
                <Button
                  variant={predictedWinner === "blue" ? "default" : "outline"}
                  onClick={() => handlePredictionChange("blue")}
                  className={`h-10 text-sm font-medium ${
                    predictedWinner === "blue" 
                      ? "bg-blue-500 hover:bg-blue-600 text-white" 
                      : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  Vitórias Azul
                </Button>
                <Button
                  variant={predictedWinner === "none" ? "default" : "outline"}
                  onClick={() => handlePredictionChange("none")}
                  className="h-10 text-sm font-medium"
                >
                  Sem previsão
                </Button>
              </div>
              {predictedWinner !== "none" && (
                <p className="text-xs text-muted-foreground">
                  Prevendo que a <span className="font-medium capitalize">{predictedWinner} Aliança</span> vencerá esta partida
                </p>
              )}
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <Label>Seleção de Equipe</Label>
              <GameStartSelectTeam
                defaultSelectTeam={selectTeam}
                setSelectTeam={setSelectTeam}
                selectedMatch={debouncedMatchNumber}
                selectedAlliance={alliance}
                preferredTeamPosition={stationInfo.teamPosition}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex-1 h-12 text-lg"
          >
            Back
          </Button>
          <Button
            onClick={handleStartScouting}
            className="flex-2 h-12 text-lg font-semibold"
            disabled={!matchNumber || !alliance || !selectTeam || !currentScouter || !eventName}
          >
            Comece o Scouting
          </Button>
        </div>

        {/* Status Indicator */}
        {matchNumber && alliance && selectTeam && currentScouter && eventName && (
          <Card className="w-full border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">Preparar</Badge>
                <span className="text-sm text-green-700 dark:text-green-300">
                  {eventName} • Partida {matchNumber} •{" "}
                  {alliance.charAt(0).toUpperCase() + alliance.slice(1)} Aliança
                  • Equipe {selectTeam} • {currentScouter}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom spacing for mobile */}
        <div className="h-8 md:h-6" />
      </div>
    </div>
  );
};

export default GameStartPage;
