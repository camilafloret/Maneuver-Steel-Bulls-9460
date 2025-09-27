# Maneuver – Aplicação de Scouting FRC Avançado 🚀

**Maneuver** é um aplicativo avançado de scouting para equipes **FIRST Robotics Competition (FRC)**.  
Permite coletar, analisar e compartilhar dados de partidas, equipes e estratégias, funcionando **offline** como **Progressive Web App (PWA)** em celular e desktop.  


## 🌟 Características

- **Scouting de Partida:** Registro completo de partidas (Autônomo, Teleoperado, Fim de Jogo).
- **Análises de Equipe:** Estatísticas detalhadas e comparações de equipes.
- **Planejamento Estratégico:** Dashboards interativos e mapas de campo.
- **Seleção de Aliança:** Listas de seleção com drag-and-drop e exportação.
- **Pit Scouting:** Formulários de inspeção técnica e mapas do pit.
- **Perfil de Scouter & Conquistas:** Perfis persistentes, badges e gamificação.
- **Offline & PWA:** Instalável no navegador, funciona sem internet.
- **Transferência de Dados:** Compartilhamento de dados via JSON ou QR codes.


## 🖥️ Telas do Aplicativo

### 🏠 Início / Painel
- Tela inicial com atalhos para todos os módulos.  
- Opção **“Carregar dados de demonstração”** para explorar recursos sem dados reais.

### 🤖 Scouting de Partidas
- Registro em tempo real do desempenho de equipes.  
- Inclui fases **Autônomo, Teleoperado e Fim de Jogo**.  
- Mapa do campo interativo para indicar posições e trajetórias.  
- Botão **Enviar** salva os dados no banco local.

### 📊 Análise de Equipe
- Estatísticas consolidadas de cada equipe.  
- Comparação lado a lado entre times.  
- Mapas de posição mostrando padrões de atuação.

### 📈 Planejamento Estratégico
- Dashboard estratégico com filtros, gráficos e estatísticas.  
- Planejamento de estratégias baseado em dados coletados.  
- Colunas configuráveis para diferentes tipos de análise.

### 🤝 Seleção de Aliança
- Criação de **lista de seleção** com drag-and-drop.  
- Visualização de estatísticas de equipes antes da escolha.  
- Exportação de listas para JSON ou QR.  
- Suporte a diferentes layouts (desktop/mobile).

### 🛠️ Pit Scouting
- Formulários detalhados de inspeção de robôs (auto, teleop, fim de jogo, specs).  
- Upload de fotos e anotações técnicas.  
- Mapa do pit para visualizar localização das equipes.  
- Atribuição de scouters para cada pit.

### 🧑‍💻 Perfil de Scouter & Conquistas
- Perfis persistentes para cada scouter.  
- Pontuação de previsões e conquistas desbloqueáveis.  
- Sistema de gamificação para engajar a equipe.

### 🔄 Gestão / Transferência de Dados
- Exportação e importação de dados em JSON.  
- Transferência via **QR codes** usando Luby Transform.  
- Opções de **merge** (mesclar) ou **overwrite** (sobrescrever).  
- Garantia de sincronização entre todos os dispositivos.


## 🏗️ Stack Tecnológico

| Camada       | Tecnologia |
|--------------|------------|
| Frontend     | React 19 + TypeScript |
| UI           | Tailwind CSS + shadcn/ui |
| Local DB     | Dexie (IndexedDB) |
| PWA          | vite-plugin-pwa (offline e instalável) |
| Data Transfer| Luby Transform (QR Codes) |
| Build Tool   | Vite |
| Analytics    | Google Analytics 4 |


## ⚡ Começando

### Pré-requisitos
- Node.js v16+
- npm ou yarn

### Instalação
```bash
git clone https://github.com/seu-usuario/maneuver.git
cd maneuver
npm install

### Running the App (Development)
npm run dev

### Production Build
npm run build
npm run preview

src/
├── components/          # UI e funcionalidades
├── pages/               # Páginas principais
├── lib/                 # Funções auxiliares e DB
├── hooks/               # React hooks personalizados
├── assets/              # Imagens e arquivos estáticos
└── layouts/             # Componentes de layout