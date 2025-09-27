import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/animate-ui/radix/checkbox";
import { Label } from "@/components/ui/label";
import { type GroundPickupCapabilities } from "@/lib/pitScoutingTypes";

interface GroundPickupSectionProps {
  groundPickupCapabilities: GroundPickupCapabilities;
  setGroundPickupCapabilities: React.Dispatch<React.SetStateAction<GroundPickupCapabilities>>;
}

export const GroundPickupSection = ({
  groundPickupCapabilities,
  setGroundPickupCapabilities,
}: GroundPickupSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacidades de Coleta do Chão</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="coralGroundPickup"
              checked={groundPickupCapabilities.coralGroundPickup}
              onCheckedChange={(checked) =>
                setGroundPickupCapabilities(prev => ({ ...prev, coralGroundPickup: checked === true }))
              }
            />
            <Label htmlFor="coralGroundPickup">Pode pegar coral do chão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="algaeGroundPickup"
              checked={groundPickupCapabilities.algaeGroundPickup}
              onCheckedChange={(checked) =>
                setGroundPickupCapabilities(prev => ({ ...prev, algaeGroundPickup: checked === true }))
              }
            />
            <Label htmlFor="algaeGroundPickup">Pode pegar algas do chão</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
