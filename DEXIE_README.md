# Implementação do Banco de Dados com Dexie.js

Este projeto agora utiliza [Dexie.js](https://dexie.org/) para gerenciamento do IndexedDB, fornecendo uma API muito mais limpa e poderosa para operações de banco de dados.

## Migração da Implementação Antiga

O app migra automaticamente os dados de:
1. Implementação manual antiga do IndexedDB
2. Armazenamento no localStorage

A migração acontece automaticamente na inicialização do app e é registrada no console.

## Nova Estrutura do Banco de Dados

### Interface ScoutingEntryDB
```typescript
interface ScoutingEntryDB {
  id: string;                    // ID único da entrada
  teamNumber?: string;           // Extraído para indexação
  matchNumber?: string;          // Extraído para indexação
  alliance?: string;             // Extraído para indexação
  scouterInitials?: string;      // Extraído para indexação
  eventName?: string;            // Extraído para indexação
  data: Record<string, unknown>; // Objeto completo de dados de scouting
  timestamp: number;             // Hora de criação da entrada
}
```

### Esquema do Banco de Dados
- **Versão 1**: Índices básicos para teamNumber, matchNumber, alliance, scouterInitials, timestamp
- **Versão 2**: Índice eventName adicionado

## Visão geral da API

### Operações básicas
```typescript
import { 
  saveScoutingEntry, 
  saveScoutingEntries, 
  loadAllScoutingEntries,
  deleteScoutingEntry,
  clearAllScoutingData 
} from './lib/dexieDB';

// Save single entry
await saveScoutingEntry(entryWithId);

// Save multiple entries
await saveScoutingEntries(entriesArray);

// Load all entries
const entries = await loadAllScoutingEntries();

// Delete entry
await deleteScoutingEntry(entryId);

// Clear all data
await clearAllScoutingData();
```

### Consulta por critérios
```typescript
import { 
  loadScoutingEntriesByTeam,
  loadScoutingEntriesByMatch,
  loadScoutingEntriesByEvent,
  queryScoutingEntries 
} from './lib/dexieDB';

// Load by team
const teamEntries = await loadScoutingEntriesByTeam('1234');

// Load by match
const matchEntries = await loadScoutingEntriesByMatch('42');

// Load by event
const eventEntries = await loadScoutingEntriesByEvent('2025mrcmp');

// Advanced filtering
const filteredEntries = await queryScoutingEntries({
  teamNumbers: ['1234', '5678'],
  eventNames: ['2025mrcmp'],
  alliances: ['red'],
  dateRange: { start: startTimestamp, end: endTimestamp }
});
```

### Estatísticas e Metadados
```typescript
import { getDBStats, getFilterOptions } from './lib/dexieDB';

// Get database statistics
const stats = await getDBStats();
// Returns: { totalEntries, teams, matches, scouters, events, oldestEntry, newestEntry }

// Get filter options for UI
const options = await getFilterOptions();
// Returns: { teams, matches, events, alliances, scouters }
```

### Importação / Exportação
```typescript
import { exportScoutingData, importScoutingData } from './lib/dexieDB';

// Export all data
const exportData = await exportScoutingData();

// Import data (append or overwrite)
const result = await importScoutingData(importData, 'append');
```

## Benefícios do Dexie.js

1. **API mais limpa**: Muito mais simples do que usar IndexedDB diretamente  
2. **Melhor suporte a TypeScript**: Tipagem completa e segura  
3. **Gerenciamento automático de esquema**: Atualizações de versão tratadas automaticamente  
4. **Consultas poderosas**: Filtros complexos e índices compostos  
5. **Melhor tratamento de erros**: Baseado em Promises com mensagens de erro claras  
6. **Performance**: Consultas otimizadas e operações em lote  
7. **Preparado para o futuro**: Fácil de adicionar novos recursos e índices  

## Detalhes da Migração

### Migração Automática
- Executada na inicialização do app  
- Verifica se existem dados nos sistemas de armazenamento antigos  
- Migra para o Dexie se necessário  
- Mantém backups dos dados originais  
- Registra o progresso da migração nos logs  

### Migração Manual
```typescript
import migrationUtils from './lib/migrationUtils';

// Check if migration is needed
const status = await migrationUtils.checkMigrationNeeded();

// Perform migration
const result = await migrationUtils.performMigration();

// Clean up old data (optional)
const cleanup = await migrationUtils.cleanupOldData();
```

## Compatibilidade

A nova implementação mantém compatibilidade retroativa:  
- Os componentes existentes continuam funcionando sem alterações  
- `loadLegacyScoutingData()` ainda retorna o formato esperado  
- As funções de transformação de dados permanecem as mesmas  
- Todas as APIs existentes são preservadas  

## Desenvolvimento

### Adicionando Novos Índices
Para adicionar novos índices, incremente a versão do banco de dados em `dexieDB.ts`:  

```typescript
this.version(3).stores({
  scoutingData: 'id, teamNumber, matchNumber, alliance, scouterInitials, eventName, newField, timestamp'
});
```

### Consultas Personalizadas
Use a poderosa API de consultas do Dexie para operações complexas:

```typescript
// Example: Find all entries for a team in the last 30 days
const recentEntries = await db.scoutingData
  .where('[teamNumber+timestamp]')
  .between(['1234', Date.now() - 30 * 24 * 60 * 60 * 1000], ['1234', Date.now()])
  .toArray();
```

## Arquivos Alterados

- `src/lib/dexieDB.ts` - Nova implementação com Dexie  
- `src/lib/migrationUtils.ts` - Utilitários de migração  
- `src/lib/scoutingDataUtils.ts` - Atualizado para usar o Dexie  
- `src/main.tsx` - Adicionada migração automática na inicialização  

## Próximos Passos

1. Testar a migração com os dados existentes  
2. Monitorar os logs do console para verificar o status da migração  
3. Substituir gradualmente as importações diretas de `indexedDBUtils.ts` por `dexieDB.ts`  
4. Remover `indexedDBUtils.ts` após a conclusão da migração