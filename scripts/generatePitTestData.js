// Script to generate 80+ teams of pit scouting data for QR code scaling tests
// Run with: node scripts/generatePitTestData.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data pools for realistic variation
const drivetrains = ['Swerve', 'Tank Drive', 'West Coast', 'Mecanum', 'H-Drive'];
const programmingLanguages = ['Java', 'C++', 'Python', 'LabVIEW'];
const scouterInitials = ['SC', 'MR', 'AK', 'ET', 'AN', 'JD', 'KL', 'RW', 'TM', 'BH'];
const events = ['2025pawar', '2025mrcmp', '2025njfla', '2025ontor', '2025casd'];

// Generate random scoring data that looks realistic
const generateAutoScoring = () => {
  const positions = {};
  for (let i = 0; i <= 4; i++) {
    // Most teams focus on L4 coral, some variance in other levels
    positions[`position${i}`] = {
      coralL1: Math.random() < 0.1 ? Math.floor(Math.random() * 2) : 0,
      coralL2: Math.random() < 0.2 ? Math.floor(Math.random() * 2) : 0,
      coralL3: Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0,
      coralL4: Math.floor(Math.random() * 4), // Most common
      algaeNet: Math.random() < 0.1 ? Math.floor(Math.random() * 2) : 0,
      algaeProcessor: Math.random() < 0.05 ? 1 : 0
    };
  }
  return positions;
};

const generateTeleopScoring = () => ({
  coralL1: Math.floor(Math.random() * 4),
  coralL2: Math.floor(Math.random() * 5),
  coralL3: Math.floor(Math.random() * 7),
  coralL4: Math.floor(Math.random() * 10),
  totalAlgae: Math.floor(Math.random() * 8),
  algaeNetShots: Math.random() < 0.4,
  algaeProcessor: Math.random() < 0.6
});

const generateEndgame = () => ({
  canShallowClimb: Math.random() < 0.7,
  canDeepClimb: Math.random() < 0.4,
  canPark: Math.random() < 0.9
});

const generateNotes = (teamNumber) => {
  const noteTemplates = [
    `Equipe ${teamNumber} - Colocação de coral forte, auto consistente`,
    `Equipe ${teamNumber} - Tempos de ciclo rápidos, bom piloto`,
    `Equipe ${teamNumber} - Escalador confiável, capacidades defensivas`,
    `Equipe ${teamNumber} - Especialista em algas, arremessos precisos na rede`,
    `Equipe ${teamNumber} - Robô versátil, boa estratégia`,
    `Equipe ${teamNumber} - Design inovador, mecanismos únicos`,
    `Equipe ${teamNumber} - Desempenho consistente, sem problemas graves`,
    `Equipe ${teamNumber} - Robô rápido, estilo de jogo agressivo`
  ];
  return noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
};

// Generate 85 teams worth of data
const generateTestData = (numTeams = 85) => {
  const teams = [];
  
  for (let i = 0; i < numTeams; i++) {
    // Use realistic team numbers (mix of 3-4 digit numbers)
    const teamNumber = i < 20 ? 
      (100 + Math.floor(Math.random() * 900)).toString() : // Some 3-digit teams
      (1000 + Math.floor(Math.random() * 8000)).toString(); // Most 4-digit teams
    
    const team = {
      teamNumber,
      eventName: events[Math.floor(Math.random() * events.length)],
      scouterInitials: scouterInitials[Math.floor(Math.random() * scouterInitials.length)],
      weight: 80 + Math.floor(Math.random() * 45), // 80-125 lbs
      drivetrain: drivetrains[Math.floor(Math.random() * drivetrains.length)],
      programmingLanguage: programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)],
      groundPickupCapabilities: {
        coralGroundPickup: Math.random() < 0.8, // Most can pick up coral
        algaeGroundPickup: Math.random() < 0.6  // Fewer can pick up algae
      },
      reportedAutoScoring: generateAutoScoring(),
      reportedTeleopScoring: generateTeleopScoring(),
      reportedEndgame: generateEndgame(),
      notes: generateNotes(teamNumber)
      // Intentionally NO robotPhoto field for QR code testing
    };
    
    teams.push(team);
  }
  
  return teams;
};

// Generate the data
console.log('Gerando 85 equipes de dados de teste para pit scouting...');
const teams = generateTestData(85);

// Format as proper PitScoutingData structure
const testData = {
  entries: teams.map((team, index) => ({
    ...team,
    id: `pit-${team.teamNumber}-${team.eventName}-test-${index}`,
    timestamp: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000) // Random timestamp within last week
  })),
  lastUpdated: Date.now()
};

// Write to file
const outputPath = path.join(__dirname, '..', 'src', 'lib', 'testData', 'pitScoutingTestData85Teams.json');
fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));

console.log(`✅ Geradas ${testData.entries.length} equipes de dados de teste`);
console.log(`📁 Salvo em: ${outputPath}`);
console.log(`📊 Tamanho do arquivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
console.log(`\n🔧 Para usar estes dados:`);
console.log(`1. Importe este arquivo JSON através da página de Transferência de Dados JSON`);
console.log(`2. Teste a geração de códigos QR com mais de 80 equipes (sem imagens)`);
console.log(`3. Verifique se a quantidade de códigos QR permanece gerenciável (8-12 códigos)`);