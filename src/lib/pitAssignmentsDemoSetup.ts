/**
 * Script de demonstração para testar a página de alocação dos pits com dados de equipes
 * Execute isto no console do navegador para configurar os dados de demonstração
 */

import { setupDemoEventTeams, clearDemoEventTeams } from './teamUtils';

// Função para ser chamada no console do navegador
(window as any).setupPitAssignmentsDemo = () => {
  console.log('🚀 Configurando dados de demonstração de Alocação de Pits...');
  setupDemoEventTeams();
  console.log('');
  console.log('✅ Configuração de demonstração concluída!');
  console.log('💡 Navegue até a página de Alocação de Pits para ver os dados de demonstração em ação.');
  console.log('📋 Você deverá ver 3 eventos de demonstração com equipes disponíveis para alocação.');
};

(window as any).clearPitAssignmentsDemo = () => {
  console.log('🧹 Limpando os dados de demonstração de Alocação de Pits...');
  clearDemoEventTeams();
  console.log('✅ Dados de demonstração limpos!');
};

// Configuração automática se este script for importado
if (typeof window !== 'undefined') {
  console.log('Funções de demonstração de Alocação de Pits disponíveis:');
  console.log('- setupPitAssignmentsDemo() - Criar equipes de eventos de demonstração');
  console.log('- clearPitAssignmentsDemo() - Limpar equipes de eventos de demonstração');
}
