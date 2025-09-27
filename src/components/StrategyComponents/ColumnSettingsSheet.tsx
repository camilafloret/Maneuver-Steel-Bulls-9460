import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/animate-ui/radix/checkbox";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Columns3, Eye, EyeOff, Save, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface ColumnConfig {
  key: string;
  label: string;
  category: string;
  visible: boolean;
  numeric: boolean;
  percentage?: boolean;
}

interface SavedPreset {
  name: string;
  columns: string[];
  createdAt: string;
}

interface ColumnSettingsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  columnConfig: ColumnConfig[];
  onToggleColumn: (key: string) => void;
  onApplyPreset: (preset: string) => void;
}

export const ColumnSettingsSheet = ({
  isOpen,
  onOpenChange,
  columnConfig,
  onToggleColumn,
  onApplyPreset,
}: ColumnSettingsSheetProps) => {
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Load saved presets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("columnPresets");
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (error) {
        console.error("Falha ao carregar predefinições salvas:", error);
      }
    }
  }, []);

  // Save preset to localStorage
  const savePreset = (name: string) => {
    const visibleColumns = columnConfig.filter(col => col.visible).map(col => col.key);
    const newPreset: SavedPreset = {
      name,
      columns: visibleColumns,
      createdAt: new Date().toISOString(),
    };
    
    const updatedPresets = [...savedPresets.filter(p => p.name !== name), newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem("columnPresets", JSON.stringify(updatedPresets));
    setNewPresetName("");
    setShowSaveInput(false);
  };

  // Apply saved preset
  const applySavedPreset = (preset: SavedPreset) => {
    // First hide all columns
    columnConfig.filter(col => col.visible).forEach(col => onToggleColumn(col.key));
    // Then show only the preset columns
    preset.columns.forEach(columnKey => {
      const column = columnConfig.find(col => col.key === columnKey);
      if (column && !column.visible) {
        onToggleColumn(columnKey);
      }
    });
  };

  // Delete saved preset
  const deletePreset = (presetName: string) => {
    const updatedPresets = savedPresets.filter(p => p.name !== presetName);
    setSavedPresets(updatedPresets);
    localStorage.setItem("columnPresets", JSON.stringify(updatedPresets));
  };

  // Group columns by category
  const columnsByCategory = columnConfig.reduce((grouped, col) => {
    if (!grouped[col.category]) {
      grouped[col.category] = [];
    }
    grouped[col.category].push(col);
    return grouped;
  }, {} as Record<string, ColumnConfig[]>);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns3 className="h-4 w-4 mr-2" />
          Personalizar colunas
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Personalizar colunas da tabela</SheetTitle>
          <SheetDescription>
            Selecione quais colunas exibir na tabela de estatísticas da equipe
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6 px-4 overflow-y-scroll pb-4">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Ações rápidas
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => columnConfig.filter(col => !col.visible).forEach(col => onToggleColumn(col.key))}
              >
                <Eye className="h-4 w-4 mr-1" />
                Mostrar tudo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyPreset("basic")}
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Somente básico
              </Button>
            </div>
          </div>

          {/* Column Presets */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Predefinições comuns
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyPreset("essential")}
                className="text-xs"
              >
                Essencial
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyPreset("aggregates")}
                className="text-xs"
              >
                Agregados
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyPreset("auto")}
                className="text-xs"
              >
                Foco Autônomo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyPreset("teleop")}
                className="text-xs"
              >
                Foco Teleoperado
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyPreset("endgame")}
                className="text-xs col-span-2"
              >
                Foco Fim de Jogo
              </Button>
            </div>
          </div>

          {/* Custom Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Predefinições personalizadas
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaveInput(!showSaveInput)}
                className="h-auto p-1 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Salvar corrente
              </Button>
            </div>

            {/* Save New Preset Input */}
            {showSaveInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nome predefinido..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="flex-1 h-8 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newPresetName.trim()) {
                      savePreset(newPresetName.trim());
                    }
                    if (e.key === "Escape") {
                      setShowSaveInput(false);
                      setNewPresetName("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => newPresetName.trim() && savePreset(newPresetName.trim())}
                  disabled={!newPresetName.trim()}
                  className="h-8 px-2"
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Saved Presets List */}
            {savedPresets.length > 0 ? (
              <div className="space-y-2">
                {savedPresets.map((preset) => (
                  <div key={preset.name} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {preset.columns.length} colunas
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applySavedPreset(preset)}
                        className="h-7 px-2 text-xs"
                      >
                        Aplicar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePreset(preset.name)}
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                Nenhuma predefinição personalizada salva ainda
              </div>
            )}
          </div>

          <Separator />
          
          {/* Column Categories */}
          {Object.entries(columnsByCategory).map(([category, columns]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {category}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const categoryVisible = columns.every(col => col.visible);
                    if (categoryVisible) {
                      // Hide all columns in this category
                      columns.filter(col => col.visible).forEach(col => onToggleColumn(col.key));
                    } else {
                      // Show all columns in this category
                      columns.filter(col => !col.visible).forEach(col => onToggleColumn(col.key));
                    }
                  }}
                  className="h-auto p-1 text-xs"
                >
                  {columns.every(col => col.visible) ? "Hide All" : "Show All"}
                </Button>
              </div>
              <div className="space-y-2">
                {columns.map(col => (
                  <div key={col.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={col.key}
                      checked={col.visible}
                      onCheckedChange={() => onToggleColumn(col.key)}
                    />
                    <label 
                      htmlFor={col.key} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                    >
                      {col.label}
                    </label>
                    {col.numeric && (
                      <Badge variant="outline" className="text-xs">
                        Numérico
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
