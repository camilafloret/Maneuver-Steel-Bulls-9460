export interface PageHelpConfig {
  title: string;
  content: string[];
  useDialog?: boolean; // Optional flag to force dialog mode
  gifUrl?: string; // Optional GIF URL for tutorials
}

export const PAGE_HELP_CONFIG: Record<string, PageHelpConfig> = {
  "/": {
    title: "Bem-vindo ao Maneuver Steel Bulls 9460!",
    content: ["Esta é a página inicial do Maneuver, sua solução completa de scouting para FRC.",
      "Para começar, você pode carregar dados de demonstração para explorar os recursos do aplicativo ou usar o menu lateral para navegar entre as diferentes seções.",
      "Os dados de demonstração incluem 51 partidas de exemplo e 14 equipes para ajudar você a entender como o sistema de scouting funciona.",
      "Use o menu lateral para acessar formulários de scouting, gerenciamento de dados e ferramentas de estratégia.",
      "Cada página possui ajuda detalhada disponível por meio de dicas (tooltips) ou diálogos.",
      "Clique no ícone ❓ em cada página para ver dicas rápidas ou tutoriais mais detalhados.",
      "Instale o aplicativo Maneuver em seu dispositivo para a melhor experiência. No Android, vá para as configurações do navegador, ative 'Adicionar à Tela Inicial' e siga as instruções. No Safari no iOS, use o botão de compartilhamento e selecione 'Adicionar à Tela Inicial'." ,
      "Para mais informações, visite nosso repositório no GitHub."
    ]
  },
  "/game-start": {
    title: "Configurações de Início do Jogo",
    useDialog: true,
    content: [
      "![Game Start Demo](./assets/tutorials/game-start-demo.gif)",
      "Nesta página você inicia cada sessão de scouting configurando os detalhes da partida.",
      "1. Certifique-se de que seu nome do scouter esteja selecionado primeiro no menu lateral.",
      "2. Adicione ou selecione o nome do evento.",
      "3. Insira o número da partida que você vai analisar (os números das partidas serão incrementados automaticamente).",
      "5. Escolha a cor da sua aliança (Vermelha/Azul) de acordo com sua posição.",
      "6. Selecione o número da equipe que você estará observando ou insira um número de equipe caso os dados da partida não estejam disponíveis.",
      "7. Confira todas as informações antes de prosseguir para a fase Auto.",
      "Dica: Selecionar seu papel faz com que a cor da aliança e o slot da equipe sejam escolhidos automaticamente, acelerando o processo."]
  },
  "/auto-start": {
    title: "Configurações de Posição Autônoma",
    useDialog: true,
    content: [
      "![Autonomous Demo](./assets/tutorials/auto-phase-demo.gif)",
      "Defina a posição inicial do robô para a fase autônoma.",
      "1. Observe o mapa do campo mostrando as posições da zona inicial.",
      "2. Clique no campo onde seu robô começa a partida.",
      "3. Confirme se a posição correta foi selecionada (você verá um selo verde).",
      "4. Revise os detalhes da partida no menu lateral para garantir a precisão.",
      "5. Clique em 'Continuar para Pontuação Autônoma' para começar a registrar o desempenho autônomo.",
      "A posição inicial influencia as oportunidades de pontuação autônoma e a análise de estratégia."
    ]
  },
  "/auto-scoring": {
    title: "Pontuação Autônoma",
    useDialog: true,
    content: [
      "![Auto Scoring Demo](./assets/tutorials/auto-scoring-demo.gif)",
      "Registre todas as atividades de pontuação durante o período autônomo (primeiros 15 segundos).",
      "1. Use a seção Pontuação no Recife para acompanhar a colocação de corais nos diferentes níveis do recife.",
      "2. Clique nos botões de coleta de coral quando o robô pegar peças de coral.",
      "3. Registre a coleta e o processamento de algas na seção Algas.",
      "4. Ative a opção 'Cruzou a Linha de Partida' se o robô apenas sair da sua zona inicial.",
      "5. Use o botão 'Desfazer Última Ação' para corrigir quaisquer erros.",
      "6. Fique atento ao indicador piscante 'Terminando em Breve!' quando o período autônomo estiver acabando.",
      "O menu lateral mostra suas ações recentes e as informações atuais da partida para referência."
    ]
  },
  "/teleop-scoring": {
    title: "Pontuação Teleoperada",
    useDialog: true,
    content: [
      "![Teleop Scoring Demo](./assets/tutorials/teleop-scoring-demo.gif)",
      "Registre todas as atividades de pontuação durante o período teleoperado (2 minutos e 15 segundos).",
      "1. Use a seção Pontuação no Recife para acompanhar a colocação de corais nos diferentes níveis (L1, L2, L3, L4),",
      "2. Clique nos botões de coleta quando o robô pegar peças de coral ou algas,",
      "3. Acompanhe o processamento de algas e a pontuação na rede na seção Algas,",
      "4. Ative a opção 'Jogou na Defesa' quando o robô defender ativamente contra os oponentes,",
      "5. Monitore o menu lateral Ações Recentes para verificar seus registros,",
      "6. Use 'Desfazer Última Ação' para corrigir quaisquer erros de registro,",
      "7. Clique em 'Continuar para Fim de Jogo' quando seu robô for realizar ações de fim de jogo,",
      "💡 Dica: As contagens atuais de coral/algas mostram o que o robô está carregando no momento."
    ]
  },
  "/endgame": {
    title: "Fim de jogo",
    useDialog: true,
    content: [
      "![Endgame Demo](./assets/tutorials/endgame-demo.gif)",
      "Finalize a partida registrando as atividades de fim de jogo e observações finais.",
      "1. Na seção Escalada, selecione uma opção: Escalada Rasa, Escalada Profunda ou Estacionado.",
      "2. Marque quaisquer problemas que ocorreram: 'Falha na Escalada' ou 'Quebrou'.",
      "3. Adicione comentários detalhados sobre o desempenho do robô, estratégia ou eventos importantes.",
      "4. Revise o resumo da partida para garantir que todas as informações estejam corretas.",
      "5. Clique em 'Enviar Dados da Partida' para salvar o relatório completo de scouting.",
      "Seus dados serão salvos e você retornará para Início de Jogo para a próxima partida."
    ]
  },
  "/team-stats": {
    title: "Estatísticas da Equipe",
    content: [
      "Analise o desempenho da equipe em todas as partidas coletadas.",
      "1. Selecione uma equipe no menu suspenso para visualizar suas estatísticas.",
      "2. Veja métricas principais: média de pontos totais, pontuação por local, posições autônomas, dados do pit scouting e comentários.",
      "3. Use o recurso Comparar com para analisar o desempenho em relação a outras equipes.",
      "4. Use o filtro de evento para refinar as estatísticas por eventos específicos.",
      "Esses dados ajudam na seleção de alianças e no planejamento da estratégia de partida."
    ]
  },
  "/match-strategy": {
    title: "Estratégia de Jogo",
    content: [
      "Planeje a estratégia para as próximas partidas usando os dados coletados.",
      "1. Desenhe no campo para visualizar os caminhos do robô e as zonas de pontuação.",
      "2. Alterne entre as abas para planejar a pontuação e os caminhos em diferentes fases do jogo.",
      "3. Insira as equipes de cada aliança ou digite o número da partida para preencher os dados automaticamente.",
      "4. Compare as habilidades das alianças em cada fase do jogo.",
      "💡 Dica: Usar o botão Salvar Tudo cria uma imagem com todos os desenhos de cada fase, números das equipes e número da partida."
    ]
  },
  "/pick-list": {
    title: "Listas de Seleção e Seleção de Alianças",
    useDialog: true,
    content: [
      "Crie e gerencie listas de ranqueamento de equipes para a seleção de alianças com gerenciamento de alianças integrado.",
      "",
      "**Gerenciamento de Listas de Seleção:**",
      "  - Criar Listas – Use a seção 'Criar Listas de Seleção' para adicionar novas listas de ranqueamento com nomes e descrições personalizadas.",
      "  - Múltiplas Listas – Crie listas especializadas (ex.: Especialistas em Auto, Mestres da Escalada, Equipes Versáteis).",
      "  - Adicionar Equipes – Clique no botão '+' ao lado de qualquer equipe em Equipes Disponíveis para adicioná-la a uma pick list.",
      "  - Reordenar Equipes – Arraste e solte equipes dentro das Listas de Seleção para ajustar sua ordem de prioridade.",
      "  - Remover Equipes – Exclua equipes das listas ou delete listas inteiras quando não forem mais necessárias.",
      "  - Estado Vazio – Quando não houver Listas de Seleção, você verá orientações úteis para criar sua primeira lista.",
      "",
      "**Análise de Equipes:**",
      "  - Painel de Equipes Disponíveis – Navegue por todas as equipes com estatísticas completas e opções de ordenação.",
      "  - Opções de Ordenação – Organize equipes por número, total de corais, algas, desempenho em Auto, taxa de escalada e mais.",
      "  - Filtro de Busca – Encontre rapidamente equipes específicas usando a caixa de pesquisa.",
      "  - Estatísticas de Desempenho – Veja métricas detalhadas para cada equipe, incluindo médias e número de partidas.",
      "",
      "**Integração com Seleção de Alianças:**",
      "  - Alternar Alianças – Use o botão 'Mostrar/Ocultar Alianças' para habilitar os recursos de seleção de alianças.",
      "  - Atribuição Rápida – Adicione equipes diretamente às posições de aliança a partir do painel de Equipes Disponíveis ou das pick lists.",
      "  - Tabela de Alianças – Gerencie 8 alianças com capitão e posições de escolha, além de equipes reservas.",
      "  - Posicionamento Inteligente – As equipes são automaticamente atribuídas à próxima posição disponível (Capitão → Escolha 1 → Escolha 2 → Escolha 3).",
      "  - Prevenção de Conflitos – As equipes são automaticamente removidas das pick lists quando atribuídas a alianças.",
      "  - Confirmar Alianças – Confirme as seleções finais de alianças para uso no planejamento de partidas.",
      "",
      "**Gerenciamento de Dados:**",
      "  - Exportar – Baixe suas pick lists como arquivos JSON para backup ou compartilhamento com membros da equipe.",
      "  - Importar – Carregue pick lists exportadas anteriormente com validação aprimorada e tratamento de erros.",
      "  - Persistência de Dados – Todas as listas e alianças são salvas automaticamente no seu dispositivo.",
      "",
      "**Dicas Profissionais:**",
      "  - Crie múltiplas pick lists especializadas para diferentes necessidades estratégicas.",
      "  - Use a seleção de alianças durante o processo real de escolha em competições.",     
      "  - Exporte pick lists antes dos eventos como backup e para compartilhar com a drive team.",
      "  - Importe os dados das equipes pela página de dados do TBA primeiro para preencher as equipes disponíveis.",
      "  - Ordene as equipes por diferentes métricas para identificar especialistas x robôs versáteis.",
      "  - Use a busca para localizar rapidamente equipes específicas durante a seleção de alianças."
    ]
  },
  "/json-transfer": {
    title: "Transferência de Dados JSON",
    useDialog: true,
    content: [
      "![JSON Transfer Demo](./assets/tutorials/json-transfer-demo.gif)","Exporte seus dados de scouting ou importe dados de outros dispositivos.",
      "1. 'Baixar Dados de Scouting em JSON' – Exporta todos os seus dados no formato JSON para backup ou compartilhamento",
      "2. 'Baixar Dados de Scouting em CSV' – Cria um arquivo compatível com planilhas para análise no Excel, Google Sheets, etc.",
      "3. 'Carregar Dados JSON' – Importa dados de scouting de outros dispositivos ou restaura a partir de um backup.",
      "4. Arquivos JSON mantêm toda a estrutura dos dados, enquanto CSV é otimizado para análise em planilhas.",
      "5. O upload sobrescreverá seus dados locais atuais, portanto exporte antes se quiser mantê-los.",
      "💡 Dica: Use JSON para transferências entre dispositivos e CSV para análise de dados em ferramentas de planilha."
    ]
  },
  "/api-data": {
    title: "Gerenciamento de Dados de API",
    useDialog: true,
    content: [
      "Sistema unificado de gerenciamento de dados integrando a API do The Blue Alliance e o Nexus para FRC, permitindo a importação completa de dados de competições.",
      "",
      "**Começando:**",
      "1. Chave de API do TBA – Obtenha sua chave de API em thebluealliance.com/account (necessária para operações com o TBA).",
      "2. Chave de API do Nexus – Obtenha sua chave de API em frc.nexus/en/api (necessária para operações com o Nexus).",
      "3. Seleção de Evento – Insira a chave do evento (ex.: '2024chcmp', '2024week0', '2024necmp') da competição.",
      "4. Armazenamento de Sessão – Escolha 'Lembrar apenas durante a sessão' para manter as credenciais temporariamente.",
      "5. Seleção da Fonte de Dados – Escolha entre The Blue Alliance e Nexus for FRC de acordo com suas necessidades.",
      "",
      "**Integração The Blue Alliance:**",
      "**Cronograma de Partidas** – Importe as escalações das equipes e os horários das partidas qualificatórias.",
      "  - Carrega todas as partidas qualificatórias com as atribuições de equipes.",
      "  - Preenche os menus suspensos de equipes nos formulários de scouting e na estratégia de partida.",
      "  - Habilita a validação do número da partida durante o scouting.",
      "",
      "**Resultados das Partidas** – Verifique as previsões em relação aos resultados reais das partidas.",
      "  - Importe os placares das partidas concluídas e as alianças vencedoras.",
      "  - Usado para validar previsões de scouting e atribuir apostas.",
      "  - Mostra os placares das alianças vermelha/azul e os vencedores das partidas.",
      "",
      "**Equipes do Evento** – Carregue a lista completa de equipes para pit scouting e análise.",
      "  - Baixa todas as equipes que participam do evento.",
      "  - Cria um banco de dados local de equipes para atribuições de pit e pick lists.",
      "  - Visualize as equipes em um layout de grade organizado com opções de filtro.",
      "",
      "**Integração FRC Nexus:**",
      "**Pit de Dados Avançados** – Importe dados de pit com endereços e mapas de pit para uma experiência de pit scouting aprimorada.",
      "",
      "**Gerenciamento Consolidado de Dados:**",
      "**Interface Unificada** – Página única para todas as necessidades de importação de dados externos.",
      "  - Cache Inteligente – Reduz chamadas à API e melhora o desempenho.",
      "  - Validação de Dados – Verificação automática e tratamento de erros.",
      "  - Integração com Backup – Exportação/importação simples com sistemas QR e JSON.",
      "",
      "**Boas Práticas:**",
      "  - As chaves de evento são encontradas nas páginas de evento do TBA (formato da URL: /event/EVENTKEY).",
      "  - Importe os dados das equipes no início dos eventos para garantir cobertura completa do pit scouting.",
      "  - Use os dados de resultados das partidas para validar e melhorar a precisão do seu scouting.",
      "  - A atualização regular dos dados garante que você tenha as informações mais recentes da competição.",
      "  - Exporte os dados importados como backup antes das principais competições."
    ]
  },
  "/qr-data-transfer": {
    title: "Centro de Transferência de Dados QR",
    useDialog: true,
    content: [
      "![QR Data Transfer Demo](./assets/tutorials/qr-scouting-demo.gif)",
      "Sistema abrangente de transferência de dados baseado em código QR para todos os tipos de troca de dados de reconhecimento.",
      "",
      "**Recursos consolidados de transferência de QR:**",
      "  - Transferência de Dados de Scouting – Compartilhe os dados de scouting de partidas entre dispositivos.",
      "  - Transferência do Cronograma de Partidas – Distribua os cronogramas do evento para toda a equipe.",
      "  - Transferência de Pick List – Compartilhe listas e rankings para a seleção de alianças.",
      "  - Todos os Tipos de Dados – Interface unificada para qualquer necessidade de transferência de dados.",
      "",
      "**Gerar Códigos de Fonte:**",
      "1. Selecione o tipo de dado que deseja compartilhar (dados de scouting, cronogramas de partidas, etc.).",
      "2. Escolha a velocidade de transferência – use velocidades mais lentas em condições de pouca luz ou em dispositivos mais antigos.",
      "3. Clique em 'Gerar e Iniciar Ciclo Automático' para começar a sequência de códigos QR.",
      "4. Mantenha o dispositivo que gera os códigos estável e garanta boas condições de iluminação.",
      "5. Os códigos QR irão alternar automaticamente – deixe os receptores escanearem no próprio ritmo.",
      "",
      "**Códigos de Fonte de Digitalização:**",
      "1. Posicione a câmera do seu dispositivo para visualizar claramente os códigos QR exibidos.",
      "2. A barra de progresso mostra o status da reconstrução à medida que você escaneia múltiplos códigos.",
      "3. Continue escaneando até atingir 100% de conclusão.",
      "4. Use 'Resetar Scanner' para limpar o progresso e recomeçar, se necessário.",
      "5. Escolha 'Continuar para o App' quando terminar ou 'Escanear Mais Dados' para transferências adicionais.",
      "",
      "**Tecnologia de Código Fonte:**",
      "  - Divide grandes conjuntos de dados em segmentos menores e gerenciáveis de códigos QR.",
      "  - A codificação redundante garante a integridade dos dados mesmo com leituras perdidas.",
      "  - Funciona totalmente offline – ideal quando Wi-Fi/internet não está disponível.",
      "  - Correção automática de erros e validação de dados.",
      "",
      "**Boas Práticas:**",
      "  - Os líderes de scouting devem usar isso para coletar dados dos scouts durante os eventos – ideal para coletar informações em lotes, sem precisar registrar após cada partida.",
      "  - Transfira os dados para as equipes de drive no pit para atualizações de estratégia em tempo real.",
      "  - Compartilhe com outras equipes que usam o Maneuver para scouting colaborativo.",
      "  - Use boa iluminação e mantenha os dispositivos estáveis durante a transferência.",
      "  - Reserve tempo para a leitura completa – apressar pode causar corrupção de dados."
    ]
  },
  "/strategy-overview": {
    title: "Visão Geral da Estratégia",
    useDialog: true,
    content: [
      "![Strategy Overview Demo](./assets/tutorials/strategy-overview-demo.gif)",
      "Análise completa do desempenho das equipes com ferramentas avançadas de filtragem e visualização.",
      "1. Use o 'Filtro de Evento' para analisar competições específicas ou visualizar todos os dados combinados.",
      "2. Altere o 'Tipo de Agregação' (Média, Mediana, Máximo, Percentil 75) para ver diferentes perspectivas estatísticas.",
      "3. 'Seção de Gráficos' – Alterne entre gráficos de barras para métricas individuais ou gráficos de dispersão para análise de correlação.",
      "4. 'Configurações de Coluna' – Mostre/oculte colunas de dados específicas ou use pré-definições rápidas (Essencial, Auto, Teleop, etc.).",
      "5. 'Filtros de Coluna' – Defina filtros numéricos (>, >=, <, <=, =, !=) para encontrar equipes que atendam a critérios específicos.",
      "6. 'Tabela de Dados' – Ordene por qualquer coluna, visualize estatísticas agregadas de todas as partidas coletadas.",
      "7. Use gráficos de dispersão para encontrar correlações entre métricas (ex.: pontuação de coral vs algas).",
      "Perfeito para seleção de alianças, identificação de pontos fortes/fracos das equipes e planejamento estratégico."
    ]
  },
  "/clear-data": {
    title: "Limpar Dados",
    content: [
      "  - Gerencie e limpe os dados de scouting quando necessário.",
      "  - Use com cuidado, pois esta ação não pode ser desfeita.",
      "  - Considere exportar dados importantes antes de limpar.",
      "  - Útil para começar do zero em novas competições ou para remover dados de teste."
    ]
  },
  "/scout-management": {
    title: "Painel de Gerenciamento de Scouts",
    useDialog: true,
    content: [
      "Painel completo para monitorar o desempenho dos scouts e gerenciar estatísticas de scouting.",
      "1. **Seletor de Visualização** – Alterne entre três modos de visualização:",
      "  - Gráfico de Barras – Ranqueamento visual dos scouts pela métrica selecionada.",
      "  - Gráfico de Linhas – Acompanhe a evolução do desempenho dos scouts ao longo do tempo.",
      "  - Tabela – Estatísticas detalhadas com classificação de medalhas para os 3 melhores scouts.",
      "2. **Seletor de Métrica** – Escolha qual métrica de desempenho analisar:",
      "  - Stakes – Total de stakes conquistados pelo scout.",
      "  - Total de Previsões – Número de previsões realizadas.",
      "  - Previsões Corretas – Número de previsões acertadas.",
      "  - Precisão % – Percentual de previsões corretas.",
      "  - Sequência Atual – Sequência ativa de previsões corretas.",
      "  - Melhor Sequência – Maior sequência alcançada.",
      "**Perfil Individual do Scout** – Selecione qualquer scout para ver estatísticas detalhadas e distintivos de desempenho.",
      "**Estatísticas Resumidas** – Cartões de visão geral mostrando total de scouts, previsões, stakes e precisão média.",
      "**Sistema de Medalhas** – A visualização em tabela mostra classificações de ouro 🥇, prata 🥈 e bronze 🥉 para os melhores desempenhos.",
      "Perfeito para acompanhar o engajamento dos scouts, identificar os melhores desempenhos e gerenciar equipes de scouts durante as competições.",
      "💡 Dica: Tem scouts desengajados? Stakes são uma ótima maneira de gamificar o scouting e incentivar a participação e a análise aprofundada dos seus dados."
    ]
  },
  "/pit-assignments": {
    title: "Atribuições de Pit",
    useDialog: true,
    content: [
      "Organize e gerencie as atribuições de pit scouting entre os membros da equipe com ferramentas completas de acompanhamento e gerenciamento de tarefas.",
      "**Começando:**",
      "1. **Adicionar Scouts** – Use a seção Gerenciamento de Scouts para adicionar membros da equipe que realizarão o pit scouting",
      "2. **Importar Dados das Equipes** – As equipes devem ser importadas da página de dados do TBA antes de criar as atribuições",
      "3. **Informações do Evento** – Visualize os detalhes do evento atual e a contagem de equipes (carregados automaticamente a partir dos dados do TBA)",
      "",
      "**Modos de Atribuição:**",
      "**Atribuição por Bloco** – Divide automaticamente as equipes em blocos consecutivos para cada scout.",
      "  - As equipes são ordenadas numericamente e distribuídas de forma equilibrada.",
      "  - Cada scout recebe um bloco sequencial de equipes (ex.: Equipes 1-10, 11-20, etc.).",
      "  - Perfeito para cobertura sistemática com sobreposição mínima em eventos com locais de pit sequenciais.",
      "",
      "**Atribuição Manual** – Clique para designar equipes individuais a scouters específicos.",
      "  - Selecione um scouter nos botões coloridos e clique nos cartões das equipes para atribuir.",
      "  - Clique com o botão direito nos cartões das equipes para remover atribuições.",
      "  - É necessário confirmar as atribuições antes que os scouters possam marcar as equipes como concluídas.",
      "",
      "**Dois Modos de Visualização:**",
      "**Cartões de Equipe** – Layout em grade visual com atribuições codificadas por cores.",
      "  - Cada equipe é exibida como um cartão com codificação de cores do scouter.",
      "  - Fácil de visualizar a distribuição das atribuições rapidamente.",
      "  - Acompanhamento interativo de atribuição e conclusão.",
      "",
      "**Visualização em Tabela** – Tabela ordenável com recursos de busca e filtragem.",
      "  - Ordene por número da equipe, scouter atribuído ou status de conclusão.",
      "  - Pesquise equipes ou scouters específicos.",
      "  - Exporte as atribuições para CSV para compartilhamento externo.",
      "",
      "**Acompanhamento de Progresso:**",
      "  - Barras de progresso visuais mostram a porcentagem de conclusão.",
      "  - Legenda de scouters codificada por cores com contagem de atribuições.",
      "  - Atualizações em tempo real à medida que as equipes são marcadas como concluídas.",
      "  - Indicadores claros para equipes não atribuídas.",
      "",
      "**Dicas Profissionais:**",
      "  - Atribuições por bloco funcionam melhor em eventos grandes com necessidade de cobertura consistente.",
      "  - Atribuições manuais são ideais quando você precisa de pares específicos scouter-equipe.",
      "  - Use a função de busca na visualização em tabela para encontrar rapidamente equipes específicas.",
      "  - Exporte os dados regularmente para fazer backup do progresso das atribuições.",
      "  - As atribuições permanecem até serem limpas manualmente, perfeito para eventos de vários dias.",
      "  - Importar novos dados de evento da página de dados do TBA substituirá automaticamente o evento atual."
    ]
  }
};

export const getPageHelp = (pathname: string): PageHelpConfig | null => {
  return PAGE_HELP_CONFIG[pathname] || null;
};
