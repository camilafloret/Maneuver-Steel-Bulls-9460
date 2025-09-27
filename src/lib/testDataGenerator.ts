import { gameDB } from './dexieDB';
import { savePitScoutingEntry } from './pitScoutingUtils';

// Import test data from JSON files
import scouterProfilesData from './testData/scouterProfiles.json';
import pitScoutingData from './testData/pitScoutingData.json';
import matchScheduleData from './testData/matchSchedule.json';
import matchScoutingData from './testData/matchScoutingData.json';
import teamsData from './testData/teams.json';

// Helper function to convert relative time to absolute timestamp
const getTimestamp = (timeSpec: { daysAgo?: number; hoursAgo?: number; minutesAgo?: number }): number => {
  const now = Date.now();
  if (timeSpec.daysAgo) return now - (timeSpec.daysAgo * 24 * 60 * 60 * 1000);
  if (timeSpec.hoursAgo) return now - (timeSpec.hoursAgo * 60 * 60 * 1000);
  if (timeSpec.minutesAgo) return now - (timeSpec.minutesAgo * 60 * 1000);
  return now;
};

export const createTestScouterProfiles = async () => {
  console.log('🧪 Criação de perfis de scouters de teste...');

  try {
    // Convert JSON data to the format expected by the database
    const testProfiles = scouterProfilesData.map(profile => ({
      ...profile,
      lastPredictionTime: profile.lastPredictionHoursAgo ? 
        Date.now() - (profile.lastPredictionHoursAgo * 60 * 60 * 1000) :
        profile.lastPredictionDaysAgo ?
        Date.now() - (profile.lastPredictionDaysAgo * 24 * 60 * 60 * 1000) :
        profile.lastPredictionMinutesAgo ?
        Date.now() - (profile.lastPredictionMinutesAgo * 60 * 1000) :
        Date.now(),
      achievements: profile.achievements.map(achievement => ({
        achievementId: achievement.achievementId,
        unlockedAt: getTimestamp(achievement)
      }))
    }));

    // Clear existing test profiles (optional - comment out if you want to keep existing data)
    // await gameDB.scouters.clear();
    // await gameDB.scouterAchievements.clear();

    for (const profile of testProfiles) {
      console.log(`Criando perfil para ${profile.name}...`);
      
      // Create or update the scouter
      await gameDB.scouters.put({
        name: profile.name,
        stakes: profile.stakes,
        stakesFromPredictions: profile.stakesFromPredictions,
        totalPredictions: profile.totalPredictions,
        correctPredictions: profile.correctPredictions,
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        createdAt: Date.now() - (1000 * 60 * 60 * 24 * 15), // Created 15 days ago
        lastUpdated: profile.lastPredictionTime,
      });

      // Add achievements
      for (const achievement of profile.achievements) {
        await gameDB.scouterAchievements.put({
          scouterName: profile.name,
          achievementId: achievement.achievementId,
          unlockedAt: achievement.unlockedAt,
        });
      }
    }

    console.log('✅ Perfis de scouter de teste criados com sucesso!');
    console.log('📊 Perfis criados:');
    testProfiles.forEach(profile => {
      const accuracy = Math.round((profile.correctPredictions / profile.totalPredictions) * 100);
      console.log(`  - ${profile.name}: ${profile.stakes} stakes, ${accuracy}% precisão, ${profile.achievements.length} achievements`);
    });

    return testProfiles;
  } catch (error) {
    console.error('❌ Erro ao criar perfis de teste:', error);
    throw error;
  }
};

export const createTestPitScoutingData = async () => {
  console.log('🔧 Criação de dados de pit scouting de teste...');

  try {
    let createdCount = 0;
    
    for (const entryData of pitScoutingData) {
      console.log(`Criando entrada de pit para equipe ${entryData.teamNumber}...`);
      
      await savePitScoutingEntry(entryData);
      createdCount++;
    }

    console.log('✅ Dados de pit scouting de teste criados com sucesso!');
    console.log(`📊 ${createdCount} entradas de pit scouting criadas:`);
    pitScoutingData.forEach(entry => {
      console.log(`  - Equipe ${entry.teamNumber} (${entry.eventName}) por ${entry.scouterInitials}`);
    });

    return pitScoutingData;
    } catch (error) {
      console.error('❌ Erro ao criar dados de pit scouting de teste:', error);
      throw error;
    }
};

export const createTestMatchScoutingData = async () => {
  console.log('🏁 Criação de dados de scouting de partidas de teste...');

  try {
    // Import the match scouting utilities 
    const { saveScoutingData, addIdsToScoutingData } = await import('./scoutingDataUtils');
    
    // Convert the data to the correct format with IDs
    const dataWithIds = addIdsToScoutingData(matchScoutingData);
    
    // Save the data
    await saveScoutingData({ entries: dataWithIds });

    console.log('✅ Dados de match scouting de teste criados com sucesso!');
    console.log(`📊 ${matchScoutingData.length} entradas de match scouting criadas`);
    console.log(`   - Equipes: ${new Set(matchScoutingData.map(m => m.selectTeam)).size} equipes diferentes`);
    console.log(`   - Partidas: ${new Set(matchScoutingData.map(m => m.matchNumber)).size} partidas diferentes`);

    return matchScoutingData;
  } catch (error) {
    console.error('❌ Erro ao criar dados de scouting de partidas de teste:', error);
    throw error;
  }
};

export const createTestMatchSchedule = async () => {
  console.log('📅 Criando cronograma de jogos de teste...');

  try {
    // Save match schedule to localStorage (same approach as HomePage.tsx)
    localStorage.setItem('matchData', JSON.stringify(matchScheduleData));

    console.log('✅ Cronograma de jogos de teste criado com sucesso!');
    console.log(`📊 Cronograma criado com ${matchScheduleData.length} partidas`);

    return matchScheduleData;
  } catch (error) {
    console.error('❌ Erro ao criar cronograma de jogo de teste:', error);
    throw error;
  }
};

export const createAllTestData = async () => {
  console.log('🚀 Criando todos os dados de teste...');
  
  try {
    await createTestScouterProfiles();
    await createTestPitScoutingData();
    await createTestMatchSchedule();
    await createTestMatchScoutingData();
    createTestEventTeams(); // Add event teams creation
    
    console.log('✅ Todos os dados de teste criados com sucesso!');
    console.log('');
    console.log('📋 Dados de demonstração disponíveis:');
    console.log('  - Perfis de scouter com conquistas');
    console.log('  - Entradas de pit scouting');
    console.log('  - Cronograma de partidas e dados de scouting');
    console.log('  - Dados de equipes do evento (formatos TBA e Nexus)');
    console.log('');
    console.log('💡 Agora você pode usar a página de Alocação de Pits para testar a atribuição de equipes!');
    } catch (error) {
      console.error('❌ Erro ao criar dados de teste:', error);
      throw error;
    }
};

export const clearTestData = async () => {
  console.log('🧹 Limpando todos os dados de teste...');
  try {
    await gameDB.scouters.clear();
    await gameDB.scouterAchievements.clear();
    
    // Also clear pit scouting data
    const { clearAllPitScoutingData } = await import('./pitScoutingUtils');
    await clearAllPitScoutingData();
    
    // Clear match scouting data by saving empty data
    try {
      const { saveScoutingData } = await import('./scoutingDataUtils');
      await saveScoutingData({ entries: [] });
    } catch {
      console.log('Falha na limpeza dos dados da partida, pulando...');
    }
    
    // Clear match schedule from localStorage
    try {
      localStorage.removeItem('matchData');
    } catch {
      console.log('Falha na limpeza do cronograma da partida, pulando...');
    }
    
    // Clear event teams data for pit assignments
    clearTestEventTeams();
    
    // Clear pit assignments from localStorage
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pit_assignments_')) {
          localStorage.removeItem(key);
          console.log(`  🗑️  Atribuições de pit removidas: ${key}`);
        }
      }
    } catch {
      console.log('Atribuições de pit foram limpas e ignoradas...');
    }
    
    console.log('✅ Todos os dados de teste foram apagados!');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
};

/**
 * Create demo event teams data for testing the pit assignments page
 */
export const createTestEventTeams = () => {
  console.log('🏆 Criação de dados de equipes de eventos de teste...');
  
  try {
    // Create single demo event with all teams (realistic scenario)
    const demoEvent = {
      eventKey: '2025mrcmp',
      eventName: 'FMA District Championship',
      teams: teamsData,
      source: 'tba' as const
    };

    // Store TBA-style event teams
    const storageKey = `tba_event_teams_${demoEvent.eventKey}`;
    const data = {
      teamNumbers: demoEvent.teams,
      lastFetched: Date.now(),
      eventName: demoEvent.eventName
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`  📋 Evento TBA criado: ${demoEvent.eventName} (${demoEvent.teams.length} equipes)`);

    console.log('✅ Dados de equipes de teste do evento criados com sucesso!');
    console.log(`📋 Criado 1 evento de demonstração com ${demoEvent.teams.length} equipes`);
    
    return { [demoEvent.eventKey]: demoEvent };
  } catch (error) {
    console.error('❌ Erro ao criar equipes de eventos de teste:', error);
    throw error;
  }
};

/**
 * Clear all event teams data (both TBA and Nexus)
 */
export const clearTestEventTeams = () => {
  console.log('🧹 Limpando dados de equipes de eventos de teste...');
  
  try {
    // Clear TBA event teams
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('tba_event_teams_') || key.startsWith('nexus_event_teams_') || key.startsWith('nexus_pit_addresses_'))) {
        localStorage.removeItem(key);
        console.log(`  🗑️  Removida: ${key}`);
      }
    }
    
    console.log('✅ Dados de equipes de teste do evento limpos!');
    } catch (error) {
      console.error('❌ Erro ao limpar dados de equipes de teste do evento:', error);
      throw error;
    }
};

/**
 * Clear all demo data from the application
 */
export const clearAllTestData = async () => {
  console.log('🧹 Limpando todos os dados de teste...');
  
  try {
    await clearTestData();
    clearTestEventTeams();
    
    console.log('✅ Todos os dados de teste foram limpos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar todos os dados de teste:', error);
    throw error;
  }
};

// Export the data for direct access if needed
export { 
  scouterProfilesData, 
  pitScoutingData, 
  matchScheduleData, 
  matchScoutingData,
  teamsData 
};
