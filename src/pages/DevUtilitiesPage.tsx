import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  UserPlus, 
  Trash2, 
  Trophy, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { createTestScouterProfiles, clearTestData } from '@/lib/testDataGenerator';
import { backfillAchievementsForAllScouters } from '@/lib/achievementUtils';
import { getAllScouters } from '@/lib/scouterGameUtils';
import { gameDB, type Scouter, type MatchPrediction } from '@/lib/dexieDB';
import { toast } from 'sonner';

const DevUtilitiesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleCreateTestProfiles = async () => {
    setLoading(true);
    try {
      const profiles = await createTestScouterProfiles();
      showMessage(`✅ ${profiles.length} perfis de scouter de teste criados com sucesso!`, 'success');
    } catch (error) {
      console.error('Erro ao criar perfis de teste:', error);
      showMessage('❌ Falha ao criar perfis de teste', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      await clearTestData();
      showMessage('✅ Todos os dados do scouter foram apagados com sucesso!', 'success');
    } catch (erro) {
      console.error('Erro ao apagar dados:', erro);
      showMessage('❌ Falha ao apagar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackfillAchievements = async () => {
    setLoading(true);
    try {
      await backfillAchievementsForAllScouters();
      showMessage('✅ Preenchimento de conquistas concluído!', 'success');
    } catch (error) {
      console.error('Erro durante o preenchimento de conquistas:', error);
      showMessage('❌ Falha no preenchimento de conquistas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCurrentData = async () => {
    setLoading(true);
    try {
      const scouters = await getAllScouters();
      showMessage(`📊 O banco de dados atual possui ${scouters.length} scouters`, 'info');
    } catch (error) {
      console.error('Erro ao verificar os dados:', error);
      showMessage('❌ Falha ao verificar os dados atuais', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateQRTransfer = async () => {
    setLoading(true);
    try {
      // Create test profiles first (this gives us realistic test data)
      const testProfiles = await createTestScouterProfiles();
      
      if (testProfiles.length === 0) {showMessage('❌ Falha ao criar perfis de teste para simulação de transferência', 'error');
        return;
      }

      // Get the test data we just created
      const scoutersData = await gameDB.scouters.toArray();
      const predictionsData = await gameDB.predictions.toArray();

      // Simulate the exact QR transfer process from ScouterProfilesFountainScanner
      const profilesData = {
        scouters: scoutersData,
        predictions: predictionsData,
        exportedAt: new Date().toISOString(),
        version: "1.0"
      };

      // Clear the database first to simulate fresh transfer
      await gameDB.scouters.clear();
      await gameDB.predictions.clear();

      // Reimport the data (simulating QR scan process)
      const scoutersToImport: Scouter[] = profilesData.scouters;
      const predictionsToImport: MatchPrediction[] = profilesData.predictions;
      
      let scoutersAdded = 0;
      let predictionsAdded = 0;

      // Process scouters - exactly like QR transfer
      for (const scouter of scoutersToImport) {
        await gameDB.scouters.add(scouter);
        scoutersAdded++;
      }

      // Process predictions - exactly like QR transfer  
      for (const prediction of predictionsToImport) {
        try {
          await gameDB.predictions.add(prediction);
          predictionsAdded++;
        } catch {
          // Probably a duplicate ID constraint, skip it
          console.warn(`Ignorando previsão duplicada: ${prediction.id}`);
        }
      }

      // **CRITICAL**: Don't update localStorage scoutersList 
      // This is the key difference from normal nav user creation
      // In QR transfer, scouts are imported for data aggregation only
      // They should NOT appear in the nav user dropdown

      const message = `🔄 Simulação de Transferência via QR concluída! ${scoutersAdded} scouters de teste e ${predictionsAdded} previsões foram transferidos. Observação: os scouters transferidos NÃO aparecerão no menu de usuários (intencional).`;
      showMessage(message, 'success');
      toast.success(`Simulação de Transferência via QR: ${scoutersAdded} scouters de teste, ${predictionsAdded} previsões importadas`);  
    } catch (error) {
      console.error('Erro ao simular a transferência via QR:', error);
      showMessage('❌ Falha ao simular a transferência via QR', 'error');
    } finally {
      setLoading(false);
    }
  };

  const testProfiles = [
    { name: "Riley Davis", description: "Melhor desempenho - 390 apostas de previsões, 91% de acerto" },
    { name: "Alex Kim", description: "Alto desempenho - 290 apostas de previsões, 90% de acerto" },
    { name: "Sarah Chen", description: "Desempenho sólido - 210 apostas de previsões, 90% de acerto" },
    { name: "Marcus Rodriguez", description: "Bom desempenho - 150 apostas de previsões, 80% de acerto" },
    { name: "Taylor Wilson", description: "Desempenho razoável - 140 apostas de previsões, 75% de acerto" },
    { name: "Emma Thompson", description: "Aprendendo - 75 apostas de previsões, 67% de acerto" },
    { name: "Jordan Smith", description: "Com dificuldades - 45 apostas de previsões, 58% de acerto" },
    { name: "Casey Park", description: "Novo scouter - 15 apostas de previsões, 33% de acerto" },
  ];

  return (
    <div className="min-h-screen container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Utilitários de Desenvolvimento</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ferramentas para testar e gerenciar dados de scout durante o desenvolvimento
        </p>
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Somente desenvolvimento
        </Badge>
      </div>

      {message && (
        <Card className={`border-2 ${
          messageType === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' :
          messageType === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950' :
          'border-blue-500 bg-blue-50 dark:bg-blue-950'
        }`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {messageType === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {messageType === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
              {messageType === 'info' && <Database className="h-5 w-5 text-blue-600" />}
              <span className={
                messageType === 'success' ? 'text-green-800 dark:text-green-200' :
                messageType === 'error' ? 'text-red-800 dark:text-red-200' :
                'text-blue-800 dark:text-blue-200'
              }>
                {message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Test Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gerenciamento de dados de teste
            </CardTitle>
            <CardDescription>
              Crie ou limpe perfis de escoteiros de teste para testes de IU
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleCreateTestProfiles}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? 'Criando...': 'Criar Perfis de Teste'}
            </Button>

            <Button 
              onClick={handleClearData}
              disabled={loading}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? 'Limpando...': 'Limpar todos os dados'}
            </Button>

            <Separator />

            <Button 
              onClick={handleCheckCurrentData}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Database className="h-4 w-4 mr-2" />
              {loading ? 'Verificando...': 'Verificar dados atuais'}
            </Button>
          </CardContent>
        </Card>

        {/* Achievement Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Gestão de Conquistas
            </CardTitle>
            <CardDescription>
              Gerenciar e preencher conquistas para testes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleBackfillAchievements}
              disabled={loading}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {loading ? 'Processamento...' : 'Conquistas de preenchimento'}
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Isso verificará todos os scouters existentes e premiará quaisquer conquistas faltantes com base em suas estatísticas atuais.</p>
            </div>
          </CardContent>
        </Card>

        {/* QR Transfer Simulation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Simulação de Transferência de QR
            </CardTitle>
            <CardDescription>
              Crie perfis de teste e transfira-os por meio de um processo simulado de código fonte QR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSimulateQRTransfer}
              disabled={loading}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {loading ? 'Simulando...' : 'Criar e transferir perfis de teste'}
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Isso simula o fluxo de trabalho completo de transferência de perfil QR:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Cria 8 perfis de scouter de teste diversos com estatísticas realistas</li>
                <li>Simula o processo de exportação/importação de QR fountain code</li>
                <li><strong>Scouters de teste NÃO são adicionados ao menu de navegação</strong> (intencional)</li>
                <li>Verifica se os perfis transferidos funcionam corretamente para agregação de dados</li>
                <li>Perfeito para testar o fluxo de coleta de dados do lead scout</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Visualização do perfil de teste</CardTitle>
          <CardDescription>
            Os seguintes perfis de teste serão criados para mostrar diferentes estados da IU
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testProfiles.map((profile, index) => (
              <div key={profile.name} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Badge variant="outline" className="text-xs mt-0.5">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <div className="font-medium text-sm">{profile.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {profile.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Console Functions */}
      <Card>
        <CardHeader>
          <CardTitle>Funções do console</CardTitle>
          <CardDescription>
            Essas funções também estão disponíveis no console do navegador para testes rápidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-green-600 dark:text-green-400"># Criar perfis de teste</div>
            <div>window.testData.createTestProfiles()</div>
            <div className="text-green-600 dark:text-green-400 mt-3"># Limpar todos os dados</div>
            <div>window.testData.clearAll()</div>
            <div className="text-green-600 dark:text-green-400 mt-3"># Conquistas de preenchimento</div>
            <div>window.achievements.backfillAll()</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevUtilitiesPage;
