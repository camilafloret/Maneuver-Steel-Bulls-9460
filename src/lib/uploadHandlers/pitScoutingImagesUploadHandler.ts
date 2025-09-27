import { toast } from "sonner";
import { importPitScoutingImagesOnly } from "@/lib/pitScoutingUtils";

export const handlePitScoutingImagesUpload = async (jsonData: unknown): Promise<void> => {
  if (!jsonData || typeof jsonData !== 'object') {
    toast.error("Formato de dados de imagens de pit scouting inválido");
    return;
  }

  const data = jsonData as Record<string, unknown>;
  
  if (data.type !== 'pit-scouting-images-only' || !('entries' in data) || !Array.isArray(data.entries)) {
    toast.error("Formato de dados de imagens de pit scouting inválido");
    return;
  }

  try {
    const result = await importPitScoutingImagesOnly(data as {
      type: string;
      entries: Array<{
        teamNumber: string;
        eventName: string;
        robotPhoto: string;
        timestamp: number;
      }>;
    });
    
    if (result.updated === 0 && result.notFound > 0) {
      toast.error(`Nenhuma entrada de pit scouting correspondente encontrada para ${result.notFound} equipes. Por favor, importe primeiro os dados de pit scouting em texto e depois adicione as imagens.`);
    } else if (result.notFound > 0) {
      toast.warning(`Atualizadas ${result.updated} equipes com imagens. ${result.notFound} equipes não encontradas - verifique se as entradas de pit scouting existem primeiro.`);
    } else {
      toast.success(`Atualizadas com sucesso ${result.updated} equipes com imagens!`);
    }
  } catch (error) {
    console.error('Erro ao importar imagens de pit scouting:', error);
    toast.error("Falha ao importar imagens de pit scouting");
  }
};
