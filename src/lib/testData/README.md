# Dados de Demonstração para Atribuições de Pit 

Este repositório contém dados de demonstração para testar a página de Atribuições de Pit e outras partes do aplicativo de scouting.

## Arquivos

### `teams.json`
Lista de 60 números de times únicos extraídos do cronograma de partidas. Usados para atribuição de pits, planejamento de estratégias, estatísticas e geração de listas de picks:
- 11, 25, 56, 75, 102, 103, 193, 222, 223, 272, etc.

Esses times são usados em toda a aplicação para:
- Atribuição de pits
- Planejamento de estratégias de partidas
- Estatísticas de times
- Geração de listas de picks

### `matchSchedule.json`
Cronograma completo de 120 partidas mostrando a alocação dos times nas alianças vermelha e azul.

### `pitScoutingData.json`
Entradas de scouting de pit de exemplo para vários times.

### `scouterProfiles.json`
Perfis de scouters de demonstração, com conquistas e estatísticas.

### `matchScoutingData.json`
Entradas de scouting de partidas de exemplo.

## Uso

### Configuração Rápida (Console do Navegador)
```javascript
// Import and run in browser console
import { setupDemoEventTeams } from '@/lib/teamUtils';
setupDemoEventTeams();
```

### Configuração de Programação
```typescript
import { setupDemoEventTeams, clearDemoEventTeams } from '@/lib/teamUtils';
import { createAllTestData } from '@/lib/testDataGenerator';

// Set up just event teams
setupDemoEventTeams();

// Or set up all demo data
await createAllTestData();

// Clear event teams
clearDemoEventTeams();
```

### Eventos de Demonstração Disponíveis

Após executar `setupDemoEventTeams()`, você terá acesso a estes eventos de demonstração:

1. **2024dcmp** - FIRST Championship - Washington
   - Fonte: TBA
   - Equipes: Todos os 60 times do cronograma de partidas
   
2. **2024mdbet** - Bethesda Robotics Invitational  
   - Fonte: TBA
   - Equipes: 40 times (Subconjunto)
   
3. **2024vabla** - Blacksburg Regional
   - Fonte: Nexus (Inclui endereços de pit)
   - Equipes: 30 times (Subconjunto diferente)

## Testando a Página de Atribuições de Pit

1. Execute a configuração de demonstração
2. Navegue até a página de Pit Assignments
3. Você verá os eventos de demonstração disponíveis no dropdown
4. Adicione alguns scouters na seção de gerenciamento
5. Experimente os diferentes modos de atribuição:
   - **Sequencial**: Atribui os times em ordem
   - **Espacial**: Usa os endereços de pit (para eventos Nexus)
   - **Manual**: Clique para atribuir times individualmente

## Integração com Outras Páginas

Os dados de times foram projetados para funcionar com:

- **Página de Estatísticas da Equipe**: Mostra estatísticas dos tempos de demonstração
- **Página de Estratégia**: Usa listas de tempos para análise
- **Página de Lista de Pick**: Usa os horários para gerar listas de escolhas
- **Página de Estratégia de Jogo**: Referência dos horários no planejamento de partidas

## Data Persistence

Os dados de demonstração são armazenados no localStorage com estas chaves:
- `tba_event_teams_*` - Dados da equipe no estilo TBA
- `nexus_event_teams_*` - Dados da equipe no estilo Nexus
- `nexus_pit_addresses_*` - Mapeamentos de endereços de boxes para eventos Nexus

## Cleaning Up

Para remover os dados de demonstração:
```typescript
import { clearDemoEventTeams } from '@/lib/teamUtils';
clearDemoEventTeams();
```

Ou para limpar tudo:
```typescript
import { clearAllTestData } from '@/lib/testDataGenerator';
await clearAllTestData();
```