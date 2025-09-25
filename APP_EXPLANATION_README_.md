# Maneuver – Advanced FRC Scouting Application 🚀

**Maneuver** é um aplicativo avançado de scouting para equipes **FIRST Robotics Competition (FRC)**.  
Permite coletar, analisar e compartilhar dados de partidas, equipes e estratégias, funcionando **offline** como **Progressive Web App (PWA)** em celular e desktop.  

---

## 🌟 Features

- **Match Scouting:** Registro completo de partidas (Auto, Teleop, Endgame).
- **Team Analysis:** Estatísticas detalhadas e comparações de equipes.
- **Strategy Planning:** Dashboards interativos e mapas de campo.
- **Alliance Selection:** Pick lists com drag-and-drop e exportação.
- **Pit Scouting:** Formulários de inspeção técnica e mapas do pit.
- **Scouter Profiles & Achievements:** Perfis persistentes, badges e gamificação.
- **Offline & PWA:** Instalável no navegador, funciona sem internet.
- **Data Transfer:** Compartilhamento de dados via JSON ou QR codes.

---

## 🖥️ Telas do Aplicativo

### 🏠 Home / Dashboard
- Tela inicial com atalhos para todos os módulos.  
- Opção **“Load Demo Data”** para explorar recursos sem dados reais.

### 🤖 Match Scouting
- Registro em tempo real do desempenho de equipes.  
- Inclui fases **Autonomous, Teleop e Endgame**.  
- Mapa do campo interativo para indicar posições e trajetórias.  
- Botão **Submit** salva os dados no banco local.

### 📊 Team Analysis
- Estatísticas consolidadas de cada equipe.  
- Comparação lado a lado entre times.  
- Mapas de posição mostrando padrões de atuação.

### 📈 Strategy Planning
- Dashboard estratégico com filtros, gráficos e estatísticas.  
- Planejamento de estratégias baseado em dados coletados.  
- Colunas configuráveis para diferentes tipos de análise.

### 🤝 Alliance Selection
- Criação de **pick lists** com drag-and-drop.  
- Visualização de estatísticas de equipes antes da escolha.  
- Exportação de listas para JSON ou QR.  
- Suporte a diferentes layouts (desktop/mobile).

### 🛠️ Pit Scouting
- Formulários detalhados de inspeção de robôs (auto, teleop, endgame, specs).  
- Upload de fotos e anotações técnicas.  
- Mapa do pit para visualizar localização das equipes.  
- Atribuição de scouters para cada pit.

### 🧑‍💻 Scouter Profiles & Achievements
- Perfis persistentes para cada scouter.  
- Pontuação de previsões e conquistas desbloqueáveis.  
- Sistema de gamificação para engajar a equipe.

### 🔄 Data Management / Transfer
- Exportação e importação de dados em JSON.  
- Transferência via **QR codes** usando Luby Transform.  
- Opções de **merge** (mesclar) ou **overwrite** (sobrescrever).  
- Garantia de sincronização entre todos os dispositivos.

---

## 🏗️ Technology Stack

| Camada       | Tecnologia |
|--------------|------------|
| Frontend     | React 19 + TypeScript |
| UI           | Tailwind CSS + shadcn/ui |
| Local DB     | Dexie (IndexedDB) |
| PWA          | vite-plugin-pwa (offline e instalável) |
| Data Transfer| Luby Transform (QR Codes) |
| Build Tool   | Vite |
| Analytics    | Google Analytics 4 |

---

## ⚡ Getting Started

### Prerequisites
- Node.js v16+
- npm ou yarn

### Installation
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