import { GenericSelector } from "@/components/ui/generic-selector";
import type { SortOption } from "@/lib/pickListTypes";

interface SortSelectorProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const sortOptions = [
  { value: "number" as const, label: "Número da Equipe" },
  { value: "totalCoral" as const, label: "Total de Coral (Geral)" },
  { value: "totalAlgae" as const, label: "Total de Algas (Geral)" },
  { value: "autoCorals" as const, label: "Corais no Auto" },
  { value: "teleopCorals" as const, label: "Corais no Teleop" },
  { value: "coralL1" as const, label: "Coral Nível 1 (Geral)" },
  { value: "coralL2" as const, label: "Coral Nível 2 (Geral)" },
  { value: "coralL3" as const, label: "Coral Nível 3 (Geral)" },
  { value: "coralL4" as const, label: "Coral Nível 4 (Geral)" },
  { value: "climb" as const, label: "Taxa de Escalada" },
  { value: "matches" as const, label: "Partidas Jogadas" }
];

export const SortSelector = ({ sortBy, onSortChange }: SortSelectorProps) => {
  const sortValues = sortOptions.map(option => option.value);
  
  const displayFormat = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    return option?.label || value;
  };
  
  const handleValueChange = (value: string) => {
    onSortChange(value as SortOption);
  };

  return (
    <GenericSelector
      label="Ordenar Equipes Por"
      value={sortBy}
      availableOptions={sortValues}
      onValueChange={handleValueChange}
      placeholder="Ordenar por..."
      displayFormat={displayFormat}
    />
  );
};
