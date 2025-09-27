import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { transformToObjectFormat } from "@/lib/dataTransformation";
import { generateEntryId } from "@/lib/scoutingDataUtils";
import { saveScoutingEntry } from "@/lib/dexieDB";
import type { ScoutingDataWithId } from "@/lib/scoutingDataUtils";
import { ArrowRight } from "lucide-react";

const EndgamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const states = location.state;

  const [shallowClimbAttempted, setShallowClimbAttempted] = useState(false);
  const [deepClimbAttempted, setDeepClimbAttempted] = useState(false);
  const [parkAttempted, setParkAttempted] = useState(false);
  const [climbFailed, setClimbFailed] = useState(false);
  const [brokeDown, setBrokeDown] = useState(false);
  const [comment, setComment] = useState("");

  const getActionsFromLocalStorage = (phase: string) => {
    const saved = localStorage.getItem(`${phase}StateStack`);
    return saved ? JSON.parse(saved) : [];
  };

  const handleSubmit = async () => {
    try {
      const autoActions = getActionsFromLocalStorage("auto");
      const teleopActions = getActionsFromLocalStorage("teleop");
      
      const scoutingInputs = {
        matchNumber: states?.inputs?.matchNumber || "",
        alliance: states?.inputs?.alliance || "",
        scouterInitials: states?.inputs?.scouterInitials || "",
        selectTeam: states?.inputs?.selectTeam || "",
        eventName: states?.inputs?.eventName || localStorage.getItem("eventName") || "",
        startPoses: states?.inputs?.startPoses || [false, false, false, false, false, false],
        autoActions: autoActions,
        teleopActions: teleopActions,
        autoPassedStartLine: states?.inputs?.autoPassedStartLine || false,
        teleopPlayedDefense: states?.inputs?.teleopPlayedDefense || false,
        shallowClimbAttempted,
        deepClimbAttempted,
        parkAttempted,
        climbFailed,
        brokeDown,
        comment
      };

      const objectData = transformToObjectFormat(scoutingInputs);
      const uniqueId = generateEntryId(objectData);
      
      const entryWithId: ScoutingDataWithId = {
        id: uniqueId,
        data: objectData,
        timestamp: Date.now()
      };

      await saveScoutingEntry(entryWithId);

      localStorage.removeItem("autoStateStack");
      localStorage.removeItem("teleopStateStack");

      const currentMatchNumber = localStorage.getItem("currentMatchNumber") || "1";
      const nextMatchNumber = (parseInt(currentMatchNumber) + 1).toString();
      localStorage.setItem("currentMatchNumber", nextMatchNumber);

      toast.success("Dados de correspondência salvos com sucesso!");
      navigate("/game-start");
      
    } catch (error) {
      console.error("Erro ao salvar dados da partida:", error);
      toast.error("Erro ao salvar dados da partida");
    }
  };

  const handleBack = () => {
    navigate("/teleop-scoring", {
      state: {
        inputs: {
          ...states?.inputs,
          endgameData: {
            shallowClimbAttempted,
            deepClimbAttempted,
            parkAttempted,
            climbFailed,
            brokeDown,
            comment
          }
        }
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col items-center px-4 pt-6 pb-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold pb-4">Fim de Jogo</h1>
      </div>
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full h-full min-h-0 pb-4">
        {/* Match Info */}
        {states?.inputs && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Resumo da partida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {states.inputs.eventName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evento:</span>
                  <span className="font-medium">{states.inputs.eventName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Partida:</span>
                <span className="font-medium">{states.inputs.matchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aliança:</span>
                <Badge 
                  variant={states.inputs.alliance === "red" ? "destructive" : "default"}
                  className={states.inputs.alliance === "blue" ? "bg-blue-500 text-white" : "bg-red-500 text-white"}
                >
                  {states.inputs.alliance?.charAt(0).toUpperCase() + states.inputs.alliance?.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Equipe:</span>
                <span className="font-medium">{states.inputs.selectTeam}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Climbing Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Escalando</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant={shallowClimbAttempted ? "default" : "outline"}
                onClick={() => {
                  setShallowClimbAttempted(!shallowClimbAttempted);
                  if (!shallowClimbAttempted) {
                    setDeepClimbAttempted(false);
                    setParkAttempted(false);
                  }
                }}
                className="h-12"
                style={shallowClimbAttempted ? {
                  backgroundColor: '#3b82f6',
                  color: 'white'
                } : undefined}
              >
                {shallowClimbAttempted ? "✓ " : ""}Tentativa de escalada rasa
              </Button>
              
              <Button
                variant={deepClimbAttempted ? "default" : "outline"}
                onClick={() => {
                  setDeepClimbAttempted(!deepClimbAttempted);
                  if (!deepClimbAttempted) {
                    setShallowClimbAttempted(false);
                    setParkAttempted(false);
                  }
                }}
                className="h-12"
                style={deepClimbAttempted ? {
                  backgroundColor: '#16a34a',
                  color: 'white'
                } : undefined}
              >
                {deepClimbAttempted ? "✓ " : ""}Tentativa de escalada profunda
              </Button>
              
              <Button
                variant={parkAttempted ? "default" : "outline"}
                onClick={() => {
                  setParkAttempted(!parkAttempted);
                  if (!parkAttempted) {
                    setShallowClimbAttempted(false);
                    setDeepClimbAttempted(false);
                  }
                }}
                className="h-12"
                style={parkAttempted ? {
                  backgroundColor: '#ca8a04',
                  color: 'white'
                } : undefined}
              >
                {parkAttempted ? "✓ " : ""}Tentou estacionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Issues Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Problemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant={climbFailed ? "destructive" : "outline"}
                onClick={() => setClimbFailed(!climbFailed)}
                className="h-12"
              >
                {climbFailed ? "✓ " : ""}Escalada falhou
              </Button>
              
              <Button
                variant={brokeDown ? "destructive" : "outline"}
                onClick={() => setBrokeDown(!brokeDown)}
                className="h-12"
              >
                {brokeDown ? "✓ " : ""}Quebrado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="w-full flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Comentários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="comment">Notas adicionais</Label>
              <Textarea
                id="comment"
                placeholder="Insira quaisquer observações ou notas adicionais sobre a partida..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full pb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-12 text-lg"
          >
            Voltar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-2 h-12 text-lg font-semibold"
            style={{
              backgroundColor: '#16a34a',
              color: 'white'
            }}
          >
            Enviar dados da partida
            <ArrowRight className="ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndgamePage;