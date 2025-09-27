import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertTeamRole } from "@/lib/utils";

interface DeviceInfoCardProps {
  playerStation: string;
}

export const DeviceInfoCard = ({ playerStation }: DeviceInfoCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Informações do Dispositivo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Estação do Jogador:</span> {convertTeamRole(playerStation)}
        </p>
        <p className="text-sm">
          <span className="font-medium">Última Atualização:</span> {new Date().toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};
