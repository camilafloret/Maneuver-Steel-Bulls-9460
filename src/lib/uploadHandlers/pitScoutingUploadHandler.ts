import { toast } from "sonner";
import { importPitScoutingData } from "@/lib/pitScoutingUtils";
import type { PitScoutingEntry } from "@/lib/pitScoutingTypes";
import type { UploadMode } from "./scoutingDataUploadHandler";

export const handlePitScoutingUpload = async (jsonData: unknown, mode: UploadMode): Promise<void> => {
  if (!jsonData || typeof jsonData !== 'object' || !('entries' in jsonData)) {
    toast.error("Formato de dados de imagens de pit scouting inválido");
    return;
  }

  const data = jsonData as { entries: unknown[]; lastUpdated?: number };
  
  try {
    const result = await importPitScoutingData(
      { 
        entries: data.entries as PitScoutingEntry[], // Runtime validation happens in importPitScoutingData
        lastUpdated: data.lastUpdated || Date.now()
      },
      mode === 'overwrite' ? 'overwrite' : 'append'
    );
    
    const message = mode === 'overwrite' 
      ? `Substituídas ${result.imported} entradas de pit scouting`
      : `Importadas ${result.imported} entradas de pit scouting${result.duplicatesSkipped > 0 ? `, ${result.duplicatesSkipped} duplicadas ignoradas` : ''}`;

    toast.success(message);
  } catch (error) {
    console.error('Erro ao importar dados de pit scouting:', error);
    toast.error("Falha ao importar dados de pit scouting");
  }
};
