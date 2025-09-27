# Maneuver – Aplicação de Scouting FRC Avançado 🚀

Um aplicativo de scouting completo e mobile-first para equipes da FIRST Robotics Competition (FRC).
O Maneuver oferece ferramentas poderosas para scouting de partidas, análise de equipes, pit scouting, seleção de alianças e gerenciamento de dados.


## 🚀 Funcionalidades

- **Coleta de Dados Completa**: Acompanhe o desempenho nas fases **autônoma**, **teleoperada** e **fim de jogo** com entrada em tempo real
- **Mapas de Campo Interativos**: Interfaces visuais para definir **posições iniciais** e **estratégias**
- **Suporte ao Jogo 2025**: Pontuação de **coral** (4 níveis), **gerenciamento de algas** e **análise de escaladas**
- **Integração com Estratégia de Partidas**: Importe dados de partidas a partir da **API do The Blue Alliance** e do **Nexus**
- **Field Canvas**: Desenhe e anote estratégias de partidas, com **preenchimento automático pelo número da partida**

- **Dashboard Multi-Abas**: Métricas detalhadas de desempenho em **Geral**, **Autônomo**, **Teleoperado** e **Fim de Jogo**
- **Análises Avançadas**: Visão geral de estratégia com **filtros**, **ordenação**, **gráficos** e múltiplos tipos de agregação
- **Comparação de Equipes**: Análises lado a lado com indicadores visuais e significância estatística
- **Análise de Posições**: Mapas de campo mostrando preferências de posição inicial e taxas de sucesso
- **Seleção de Alianças**: Listas *drag-and-drop*, layouts desktop/mobile, inicializador de alianças e tabelas de seleção


### 🏆 Perfis de Scouters & Conquistas
- **Perfis Persistentes**: Rastreamento de staking, pontuação de previsões e sistema de conquistas
- **Conquistas**: Badges desbloqueáveis e acompanhamento de progresso dos scouters


### 🏗️ Pit Scouting & Atribuições
- **Interface Completa de Pit Scouting**: Formulários para specs do robô, fotos, autônomo/teleoperado/fim de jogo e notas técnicas
- **Ferramentas de Atribuição**: Controle de atribuições, configuração de eventos, visualização do mapa de pits e clusterização espacial


### 📱 Gerenciamento & Transferência de Dados
- **Transferência Flexível**: Arquivos JSON e *códigos de fonte* para grandes volumes de dados
- **Armazenamento Local**: Dados persistentes com merge/sobrescrita via IndexedDB (Dexie)


### 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build**: Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Banco Local**: Dexie (IndexedDB) - `src/lib/dexieDB.ts`
- **Transferência**: JSON & *Fountain Codes* (QR)
- **PWA**: vite-plugin-pwa (offline + cache)
- **Analytics**: Google Analytics 4 - `src/lib/analytics`


## 🚀 Começando

### Pré-requisitos
- Node.js (v16 ou superior)
- npm (preferido) ou yarn

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/Maneuver-Steel-Bulls-9460.git

# Entrar no diretório
cd Maneuver-Steel-Bulls-9460

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

### 📖 Uso

### Início Rápido
1. **Dados de Demonstração**: Clique em *"Load Demo Data"* na página inicial para explorar todos os recursos
2. **Fluxos Centrais**: Scouting de partidas → Análise de equipes → Planejamento de estratégias → Seleção de alianças
3. **Transferência de Dados**: Use **QR codes** ou arquivos **JSON** para compartilhar dados entre dispositivos

### Fluxos Principais
- **Scouting de Partida**: Início da partida → Fase Autônoma → Teleoperada → Fim de Jogo → Enviar
- **Análise de Equipes**: Selecionar equipe → Visualizar estatísticas em múltiplas abas → Comparar com outras → Analisar posições
- **Planejamento de Estratégia**: Visão geral no dashboard → Gráficos interativos → Configuração de colunas → Filtros por evento
- **Seleção de Alianças**: Criar listas de seleção → Pesquisar equipes → Ordenar com drag-and-drop → Exportar/Compartilhar
- **Pit Scouting**: Atribuir scouters → Preencher formulários de pit → Visualizar mapa de pits → Exportar dados de pits
- **Conquistas**: Acompanhar progresso dos scouters → Desbloquear badges → Visualizar ranking


## 🏗️ Estrutura do Projeto
```bash
src/
├── components/ # Componentes reutilizáveis de UI
│   ├── AutoComponents/ # Componentes da fase autônoma
│   ├── DashboardComponents/ # Elementos principais do dashboard
│   ├── DataTransferComponents/ # Funcionalidades de importação/exportação
│   ├── TeamStatsComponents/ # Ferramentas de análise de equipes
│   ├── StrategyComponents/ # Visão geral e análise de estratégias
│   ├── PickListComponents/ # Ferramentas de seleção de alianças
│   ├── MatchStrategyComponents/ # Planejamento de partidas
│   ├── PitScoutingComponents/ # Formulários e exibição de pit scouting
│   ├── PitAssignmentComponents/ # Atribuição e mapeamento de pits
│   └── ui/ # Componentes básicos de UI (shadcn/ui)
├── pages/ # Páginas/rotas da aplicação
├── lib/ # Funções utilitárias e helpers
├── hooks/ # Custom hooks do React
├── assets/ # Imagens e arquivos estáticos
└── layouts/ # Componentes de layout de páginas
```

## 🔧 Arquitetura & Notas de Desenvolvimento
- **O banco de dados é a referência principal**: A maior parte do estado do app e importações/exportações fluem através de `src/lib/dexieDB.ts` (`db`, `pitDB`, `gameDB`).


## 🤝 Contribuindo

Contribuições para o Maneuver Steel Bulls 9460 são bem-vindas! Veja como ajudar:

1. **Faça um fork do repositório**
2. **Crie uma branch de feature**: `git checkout -b feature/minha-feature`
3. **Implemente suas alterações** seguindo o estilo de código existente
4. **Teste tudo cuidadosamente**
5. **Abra um Pull Request** descrevendo suas mudanças e benefícios


### Diretrizes de Desenvolvimento
- Use **TypeScript** para garantir segurança de tipos
- Siga boas práticas do React e padrões de hooks
- Mantenha o design responsivo para compatibilidade mobile
- Teste as funcionalidades de transferência de dados
- Documente novos recursos ou mudanças

### Checklist de PR
- Rodar typecheck: `npm run build` e corrigir erros
- Rodar linter: `npm run lint` e corrigir issues
- Teste rápido: `npm run dev` → verifique páginas afetadas; se houver mudanças no DB, confirme migração/backup


## 📝 Licença
Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.


## 🙏 Agradecimentos
- [**FIRST Robotics Competition**](https://www.firstinspires.org/robotics/frc) por inspirar este projeto 
- [**VihaanChhabria**](https://github.com/VihaanChhabria) e o projeto [**VScouter**](https://github.com/VihaanChhabria/VScouter) pela base inicial e inspiração
- [**The Blue Alliance**](https://www.thebluealliance.com/) pela API de dados de partidas
- [**shadcn/ui**](https://ui.shadcn.com/) pela excelente biblioteca de componentes
- [**Luby Transform**](https://www.npmjs.com/package/luby-transform?activeTab=versions) pela robustez na transferência de dados
- [**Maneuver**](https://github.com/ShinyShips/Maneuver) por compartilhar o código open-source e permitir a modificação conforme a necessidade


## 📞 Suporte
Para dúvidas, problemas ou solicitações de recursos:
- Abra uma *issue* no GitHub
- Entre em contato com a equipe de desenvolvimento
- Confira a documentação e os dados de demonstração


**Construído com ❤️ para a comunidade FRC**
