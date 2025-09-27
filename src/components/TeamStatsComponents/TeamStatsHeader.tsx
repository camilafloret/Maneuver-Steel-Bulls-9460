import { TeamSelector } from "@/components/MatchStrategyComponents/TeamSelector";
import { GenericSelector } from "@/components/ui/generic-selector";

interface TeamStatsHeaderProps {
  selectedTeam: string;
  compareTeam: string;
  selectedEvent: string;
  availableTeams: string[];
  availableEvents: string[];
  onSelectedTeamChange: (value: string) => void;
  onCompareTeamChange: (value: string) => void;
  onSelectedEventChange: (value: string) => void;
}

export const TeamStatsHeader = ({
  selectedTeam,
  compareTeam,
  selectedEvent,
  availableTeams,
  availableEvents,
  onSelectedTeamChange,
  onCompareTeamChange,
  onSelectedEventChange
}: TeamStatsHeaderProps) => {
  // Filter available teams for comparison (exclude selected team)
  const compareTeamOptions = availableTeams.filter(teamNum => teamNum !== selectedTeam);

  return (
    <div className="w-full pt-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center gap-2">
          <label className="font-medium shrink-0">Selecione a Equipe:</label>
          <div className="min-w-[120px] max-w-[200px]">
            <TeamSelector
              index={0}
              label="Selecione a Equipe"
              labelColor=""
              value={selectedTeam}
              availableTeams={availableTeams}
              onValueChange={onSelectedTeamChange}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium shrink-0">Comparar a:</label>
          <div className="min-w-[120px] max-w-[200px]">
            <TeamSelector
              index={1}
              label="Comparar a Equipe"
              labelColor=""
              value={compareTeam}
              availableTeams={compareTeamOptions}
              onValueChange={onCompareTeamChange}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium shrink-0">Evento:</label>
          <GenericSelector
            label="Selecione o evento"
            value={selectedEvent}
            availableOptions={["all", ...availableEvents]}
            onValueChange={onSelectedEventChange}
            placeholder="Todos os eventos"
            displayFormat={(val) => val}
            className="min-w-[120px] max-w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};
