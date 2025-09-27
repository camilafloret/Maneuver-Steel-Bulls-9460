import { gameDB } from './dexieDB';
import { checkForNewAchievements } from './achievementUtils';
import { ACHIEVEMENT_DEFINITIONS } from './achievementTypes';

export const debugAchievements = async (scouterName: string) => {
  console.log('🔍 Análise de depuração para', scouterName);
  
  // Get current scouter data
  const scouter = await gameDB.scouters.get(scouterName);
  if (!scouter) {
    console.log('❌ Scouter não encontrado');
    return;
  }
  
  console.log('📊 Estatísticas atuais do scouter:', {
    stakes: scouter.stakes,
    totalPredictions: scouter.totalPredictions,
    correctPredictions: scouter.correctPredictions,
    accuracy: Math.round((scouter.correctPredictions / scouter.totalPredictions) * 100),
    currentStreak: scouter.currentStreak,
    longestStreak: scouter.longestStreak
  });
  
  // Get current achievements
  const achievements = await gameDB.scouterAchievements
    .where('scouterName')
    .equals(scouterName)
    .toArray();
  
  console.log('🏆 Conquistas atuais:', achievements.length);
  achievements.forEach(achievement => {
    const def = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievement.achievementId);
    if (def) {
      console.log(`  - ${def.name} (+${def.stakesReward} stakes)`);
    }
  });
  
  // Calculate total stakes from achievements
  const totalStakesFromAchievements = achievements.reduce((sum, achievement) => {
    const def = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievement.achievementId);
    return sum + (def?.stakesReward || 0);
  }, 0);
  
  console.log('💰 Total de stakes provenientes de conquistas:', totalStakesFromAchievements);
  console.log('💰 Stakes base esperadas:', scouter.stakes - totalStakesFromAchievements);
  
  // Check which stakes achievements should be unlocked
  const stakesAchievements = ACHIEVEMENT_DEFINITIONS.filter(a => a.id.startsWith('stakes_'));
  console.log('🎯 Análise de conquistas de stakes:');
  
  stakesAchievements.forEach(achievement => {
    const isUnlocked = achievements.some(a => a.achievementId === achievement.id);
    const shouldBeUnlocked = scouter.stakes >= achievement.requirements.value;
    const status = isUnlocked ? '✅' : (shouldBeUnlocked ? '❌ AUSENTE' : '⏳');
    
    console.log(`  ${status} ${achievement.name}: precisa ${achievement.requirements.value}, tem ${scouter.stakes}`);
  });
  
  // Try manual achievement check
  console.log('🔄 Executando verificação manual de conquistas...');
  const newAchievements = await checkForNewAchievements(scouterName);
  
  if (newAchievements.length > 0) {
    console.log('🎉 Novas conquistas desbloqueadas:', newAchievements.map(a => a.name));
  } else {
    console.log('ℹ️ Nenhuma nova conquista para desbloquear');
  }
  
  // Get updated scouter data
  const updatedScouter = await gameDB.scouters.get(scouterName);
  if (updatedScouter && updatedScouter.stakes !== scouter.stakes) {
    console.log('💰 Stakes atualizados:', scouter.stakes, '->', updatedScouter.stakes);
  }
};

export const fixStakesAchievements = async () => {
  console.log('🔧 Tentando consertar conquistas de stakes...');
  
  const scouters = await gameDB.scouters.toArray();
  
  for (const scouter of scouters) {
    console.log(`\n🔍 Verificando ${scouter.name}...`);
    await debugAchievements(scouter.name);
  }
};
