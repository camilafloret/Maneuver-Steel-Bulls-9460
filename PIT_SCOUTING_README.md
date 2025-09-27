# Recurso de Pit Scouting

O recurso de **pit scouting** permite que as equipes coletem informações básicas sobre os robôs antes do início das partidas. Esses dados são **auto-relatados pelas equipes** e podem ajudar no planejamento estratégico.


## Funcionalidades

### Coleta de Dados
- **Foto do Robô**: Tire uma foto do robô no pit
- **Peso**: Registre o peso do robô em libras
- **Drivetrain**: Selecione entre os tipos de drivetrain mais comuns (Swerve Drive, Tank Drive, Mecanum Drive, Outro)
- **Linguagem de Programação**: Registre qual linguagem a equipe utiliza (Java, C++, Python, LabVIEW, Outro)

### Capacidades de Pontuação
- **Pontuação de Coral**: Registrar as capacidades informadas para pontuação de coral no Auto e no Teleopardo (Níveis 1-4)
- **Pontuação de Alga**: Registrar as capacidades informadas para pontuação de alga no Auto e no Teleopardo (Arremessos na Rede, Processador)

### Capacidades de Autônomo
- **Posições de Início**: Registrar quais posições de início (0-5) o robô pode utilizar no modo autônomo e o que ele consegue pontuar a partir dessa posição

### Capacidades de Endgame
- **Tipos de Escalada**: Registrar se o robô consegue realizar escalada rasa (shallow climb), escalada profunda (deep climb) ou estacionar (park)

### Informações Adicionais
- **Notas**: Campo de texto livre para observações adicionais ou recursos especiais


## Uso

1. ## Uso

1. **Navegar até Pit Scouting**: Vá para Estratégia → Pit Scouting na barra lateral  
2. **Inserir Informações Básicas**: Preencha o número do time, nome do evento e suas iniciais  
3. **Tirar Foto**: Use o botão da câmera para tirar uma foto do robô  
4. **Preencher Especificações Técnicas**: Informe o peso, drivetrain e linguagem de programação  
5. **Marcar Capacidades**: Selecione todas as capacidades relatadas de pontuação, autonômicas e de fim de jogo  
6. **Adicionar Notas**: Inclua quaisquer observações adicionais  
7. **Salvar**: Clique em "Salvar dados de Pit" para armazenar as informações


## Gerenciamento de Dados

### Visualização dos Dados de Pit
- Os dados de pit scouting são integrados à página de Estatísticas do Time  
- Acesse pela aba "Dados de Pit" ao visualizar um time específico  
- Os dados são filtrados pelo evento selecionado, se aplicável  

### Armazenamento de Dados
- Os dados são armazenados localmente usando **localStorage**  
- Cada time pode ter múltiplas entradas de pit scouting (uma por evento)  
- Entradas existentes são carregadas automaticamente e podem ser atualizadas  

### Exportação/Importação de Dados
- Os dados de pit scouting podem ser apagados pela página **Limpar Dados**
- A exportação em **CSV** está disponível através dos utilitários de pit scouting 


## Detalhes de Implementação

### Arquivos Criados/Modificados
- `src/lib/pitScoutingTypes.ts` - Definições de tipos
- `src/lib/pitScoutingUtils.ts` - Utilitários de gerenciamento de dados
- `src/pages/PitScoutingPage.tsx` - Formulário principal de pit scouting
- `src/components/TeamStatsComponents/PitScoutingData.tsx` - Componente de visualização de dados
- `src/App.tsx` - Roteamento adicionado
- `src/components/DashboardComponents/app-sidebar.tsx` - Navegação adicionada
- `src/pages/TeamStatsPage.tsx` - Aba de dados de pit adicionada
- `src/pages/ClearDataPage.tsx` - Limpeza de dados de pit adicionada

### Data Structure
```typescript
interface PitScoutingEntry {
  id: string;
  teamNumber: string;
  eventName: string;
  scouterInitials: string;
  timestamp: number;
  robotPhoto?: string; // Base64 encoded
  weight?: number;
  drivetrain?: string;
  programmingLanguage?: string;
  reportedScoring?: {
    // Auto and teleop capabilities for coral and algae
  };
  reportedAutoCapabilities?: {
    // Starting positions 0-5
  };
  reportedEndgame?: {
    // Climb and park capabilities
  };
  notes?: string;
}
```

## Melhorias Futuras

Possíveis melhorias podem incluir:
- Integração com transferência de dados em JSON para backup/restauração
- Migração para IndexedDB
- Compressão e otimização de fotos
- Pesquisa e filtragem avançadas
- Exportação para sistemas de match scouting