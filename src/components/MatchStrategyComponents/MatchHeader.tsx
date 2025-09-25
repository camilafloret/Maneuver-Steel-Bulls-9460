import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MatchHeaderProps {
  matchNumber: string;
  isLookingUpMatch: boolean;
  onMatchNumberChange: (value: string) => void;
  onClearAll: () => void;
  onSaveAll: () => void;
}

export const MatchHeader = ({
  matchNumber,
  isLookingUpMatch,
  onMatchNumberChange,
  onClearAll,
  onSaveAll
}: MatchHeaderProps) => {
  const hasMatchData = localStorage.getItem("matchData");

  return (
    <div className="flex md:justify-between w-full flex-wrap md:flex-nowrap gap-2 pt-4">
      <div className="flex items-center gap-2 w-full md:w-auto pb-2 md:pb-0">
        <label htmlFor="match-number" className="font-semibold whitespace-nowrap">
          Match #:
        </label>
        <div className="relative">
          <Input
            id="match-number"
            type="text"
            placeholder="Optional"
            value={matchNumber}
            onChange={(e) => onMatchNumberChange(e.target.value)}
            className="w-24"
          />
          {isLookingUpMatch && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
        {matchNumber && !isLookingUpMatch && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Auto-fills from match data
          </span>
        )}
        {!hasMatchData && (
          <span className="text-xs text-orange-500 whitespace-nowrap">
            Load match data first
          </span>
        )}
      </div>
      
      <div className="flex items-center md:justify-end w-full md:w-auto gap-2">
        <Button 
          onClick={onClearAll} 
          variant="outline" 
          className="flex-1 md:flex-none px-3 py-2"
        >
          Clear All
        </Button>
        <Button 
          onClick={onSaveAll} 
          variant="outline" 
          className="flex-1 md:flex-none px-3 py-2"
        >
          Save All
        </Button>
      </div>
    </div>
  );
};
