import { useState, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { createDecoder, binaryToBlock } from "luby-transform";
import { toUint8Array } from "js-base64";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as pako from 'pako';
import { type CompressedEntry } from '@/lib/compressionUtils';

interface FountainPacket {
  type: string;
  sessionId: string;
  packetId: number;
  k: number;
  bytes: number;
  checksum: string;
  indices: number[];
  data: string; // Base64 encoded binary data
}

interface UniversalFountainScannerProps {
  onBack: () => void;
  onSwitchToGenerator?: () => void;
  dataType: 'scouting' | 'match' | 'scouter' | 'combined' | 'pit-scouting' | 'pit-images';
  expectedPacketType: string;
  saveData: (data: unknown) => void;
  validateData: (data: unknown) => boolean;
  getDataSummary: (data: unknown) => string;
  title: string;
  description: string;
  completionMessage: string;
}

const UniversalFountainScanner = ({ 
  onBack, 
  onSwitchToGenerator,
  dataType,
  expectedPacketType,
  saveData,
  validateData,
  getDataSummary,
  title,
  description,
  completionMessage
}: UniversalFountainScannerProps) => {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [reconstructedData, setReconstructedData] = useState<unknown>(null);
  const [progress, setProgress] = useState({ received: 0, needed: 0, percentage: 0 });
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [compressionDetected, setCompressionDetected] = useState<boolean | null>(null);
  const [missingPackets, setMissingPackets] = useState<number[]>([]);
  const [totalPackets, setTotalPackets] = useState<number | null>(null);
  
  // Use refs for immediate access without React state delays
  const decoderRef = useRef<unknown>(null);
  const packetsRef = useRef<Map<number, FountainPacket>>(new Map());
  const sessionRef = useRef<string | null>(null);
  const totalPacketsRef = useRef<number | null>(null);

  // Helper function to add debug messages (dev-only)
  const addDebugMsg = (message: string) => {
    if (import.meta.env.DEV) {
      setDebugLog(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`]);
    }
  };

  // Calculate missing packets based on seen packet IDs
  const calculateMissingPackets = () => {
    const packetIds = Array.from(packetsRef.current.keys()).sort((a, b) => a - b);
    
    if (packetIds.length === 0) return [];
    
    const missing: number[] = [];
    const minId = packetIds[0];
    const maxId = packetIds[packetIds.length - 1];
    
    // Check for gaps in the sequence
    for (let i = minId; i <= maxId; i++) {
      if (!packetsRef.current.has(i)) {
        missing.push(i);
      }
    }
    
    // Update total packets estimate if we have a reasonable range
    const estimatedTotal = maxId;
    if (estimatedTotal !== totalPacketsRef.current) {
      totalPacketsRef.current = estimatedTotal;
      setTotalPackets(estimatedTotal);addDebugMsg(`📊 Pacotes totais estimados: ${estimatedTotal} (com base no ID máximo do pacote: ${maxId})`);
    }
    
    return missing;
  };

  const handleQRScan = (result: { rawValue: string; }[]) => {
    try {
      const packet: FountainPacket = JSON.parse(result[0].rawValue);
      addDebugMsg(`🎯 Pacote escaneado ${packet.packetId} com índices [${packet.indices.join(',')}]`);
      addDebugMsg(`🆔 Sessão: ${packet.sessionId.slice(-8)}`);
      
      if (packet.type !== expectedPacketType) {
        addDebugMsg(`❌ Formato de código QR inválido - esperado ${expectedPacketType}, recebido ${packet.type}`);
        toast.error("Formato de código QR inválido");
        return;
      }

      addDebugMsg(`📊 Pacotes antes do processamento: ${packetsRef.current.size}`);

      // SIMPLIFIED SESSION HANDLING - Don't reset on session changes
      if (!sessionRef.current) {
        addDebugMsg(`🆕 Primeira sessão: k=${packet.k}, bytes=${packet.bytes}`);
        sessionRef.current = packet.sessionId;
        setCurrentSession(packet.sessionId);
        decoderRef.current = createDecoder();
        toast.info(`Sessão iniciada: ${packet.sessionId.slice(-8)}`);
      } else if (sessionRef.current !== packet.sessionId) {
        // Just log the session change but DON'T reset anything
        addDebugMsg(`🔄 Mudança de sessão detectada: ${sessionRef.current.slice(-4)} → ${packet.sessionId.slice(-4)}`);
        addDebugMsg(`📌 Continuando com o mesmo decodificador (ignorando a mudança de sessão)`);
      }

      addDebugMsg(`📊 Pacotes após verificação de sessão: ${packetsRef.current.size}`);

      // Check if we already have this packet
      if (packetsRef.current.has(packet.packetId) && !allowDuplicates) {
        addDebugMsg(`🔁 Pacote duplicado ${packet.packetId} ignorado`);
        addDebugMsg(`🔍 Atual: índices [${packet.indices.join(',')}]`);
        return;
      }

      // Store the packet
      packetsRef.current.set(packet.packetId, packet);
      addDebugMsg(`📦 Pacote ${packet.packetId} adicionado, total: ${packetsRef.current.size}`);

      // Debug: Show all packet IDs we have
      const allPacketIds = Array.from(packetsRef.current.keys()).sort();
      addDebugMsg(`🔢 Todos os IDs de pacotes: [${allPacketIds.join(',')}]`);

      // Use decoder
      if (decoderRef.current) {
        try {
          // Convert base64 back to binary and create block
          const binaryData = toUint8Array(packet.data);
          const block = binaryToBlock(binaryData);

          // Add block to decoder
          addDebugMsg(`🔧 Adicionando bloco ao decodificador...`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isOkay = (decoderRef.current as any).addBlock(block);
          addDebugMsg(`📊 Resultado do decodificador: ${isOkay ? 'CONCLUÍDO!' : 'Precisa de mais'}`);
          
          if (isOkay) {
            addDebugMsg("🎉 DECODIFICAÇÃO CONCLUÍDA!");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedData = (decoderRef.current as any).getDecoded();
            addDebugMsg(`📊 Tamanho dos dados decodificados: ${decodedData.length} bytes`);
            
            let parsedData: unknown;
            
            try {
              // Check if data is gzip compressed (starts with magic bytes 1f 8b)
              const isGzipCompressed = decodedData.length > 2 && 
                                      decodedData[0] === 0x1f && 
                                      decodedData[1] === 0x8b;
              
              if (isGzipCompressed) {
                addDebugMsg("🗜️ Dados comprimidos detectados, descomprimindo...");
                setCompressionDetected(true);
                
                // Decompress gzip
                const decompressed = pako.ungzip(decodedData);
                const jsonString = new TextDecoder().decode(decompressed);
                const decompressedData = JSON.parse(jsonString);
                
                // Check if this is smart compression format
                if (decompressedData && typeof decompressedData === 'object' && 
                    decompressedData.meta && decompressedData.meta.compressed) {
                      addDebugMsg("🔧 Formato de compressão inteligente detectado, expandindo dados...");
                      addDebugMsg(`🔍 Quantidade de entradas comprimidas: ${decompressedData.entries?.length || 0}`);
                      addDebugMsg(`🔍 Chaves da primeira entrada comprimida: ${decompressedData.entries?.[0] ? Object.keys(decompressedData.entries[0]).join(', ') : 'nenhuma'}`);
                  // Rebuild dictionaries for expansion
                  const scouterDict = decompressedData.meta.scouterDict || [];
                  const eventDict = decompressedData.meta.eventDict || [];
                  const allianceReverse = ['redAlliance', 'blueAlliance'] as const;
                  addDebugMsg(`🔍 Dicionário de scouters: ${scouterDict.length} entradas`);
                  addDebugMsg(`🔍 Dicionário de eventos: ${eventDict.length} entradas`);
                  
                  // Expand compressed entries back to full format
                  const expandedEntries = decompressedData.entries.map((compressed: CompressedEntry, index: number) => {
                    addDebugMsg(`🔍 Expandindo entrada ${index}: ${JSON.stringify(compressed).substring(0, 100)}...`);
                    const expanded: Record<string, unknown> = {};
                    
                    // Expand dictionary-compressed fields
                    if (typeof compressed.a === 'number') expanded.alliance = allianceReverse[compressed.a];
                    if (typeof compressed.s === 'number') expanded.scouterInitials = scouterDict[compressed.s];
                    if (typeof compressed.sf === 'string') expanded.scouterInitials = compressed.sf;
                    if (typeof compressed.e === 'number') expanded.eventName = eventDict[compressed.e];
                    if (typeof compressed.ef === 'string') expanded.eventName = compressed.ef;
                    
                    // Expand basic fields
                    if (compressed.m) expanded.matchNumber = compressed.m;
                    if (compressed.t) expanded.selectTeam = compressed.t;
                    
                    // Expand packed boolean start positions
                    if (typeof compressed.p === 'number') {
                      expanded.startPoses0 = !!(compressed.p & 1);
                      expanded.startPoses1 = !!(compressed.p & 2);
                      expanded.startPoses2 = !!(compressed.p & 4);
                      expanded.startPoses3 = !!(compressed.p & 8);
                      expanded.startPoses4 = !!(compressed.p & 16);
                      expanded.startPoses5 = !!(compressed.p & 32);
                    } else {
                      expanded.startPoses0 = false;
                      expanded.startPoses1 = false;
                      expanded.startPoses2 = false;
                      expanded.startPoses3 = false;
                      expanded.startPoses4 = false;
                      expanded.startPoses5 = false;
                    }
                    
                    // Expand auto coral counts (default to 0 if not present)
                    if (Array.isArray(compressed.ac)) {
                      expanded.autoCoralPlaceL1Count = compressed.ac[0] || 0;
                      expanded.autoCoralPlaceL2Count = compressed.ac[1] || 0;
                      expanded.autoCoralPlaceL3Count = compressed.ac[2] || 0;
                      expanded.autoCoralPlaceL4Count = compressed.ac[3] || 0;
                    } else {
                      // Ensure these fields exist even if not in compressed data
                      expanded.autoCoralPlaceL1Count = 0;
                      expanded.autoCoralPlaceL2Count = 0;
                      expanded.autoCoralPlaceL3Count = 0;
                      expanded.autoCoralPlaceL4Count = 0;
                    }
                    
                    // Expand other auto counts
                    if (Array.isArray(compressed.ao)) {
                      expanded.autoCoralPlaceDropMissCount = compressed.ao[0] || 0;
                      expanded.autoCoralPickPreloadCount = compressed.ao[1] || 0;
                      expanded.autoCoralPickStationCount = compressed.ao[2] || 0;
                      expanded.autoCoralPickMark1Count = compressed.ao[3] || 0;
                      expanded.autoCoralPickMark2Count = compressed.ao[4] || 0;
                      expanded.autoCoralPickMark3Count = compressed.ao[5] || 0;
                    } else {
                      expanded.autoCoralPlaceDropMissCount = 0;
                      expanded.autoCoralPickPreloadCount = 0;
                      expanded.autoCoralPickStationCount = 0;
                      expanded.autoCoralPickMark1Count = 0;
                      expanded.autoCoralPickMark2Count = 0;
                      expanded.autoCoralPickMark3Count = 0;
                    }
                    
                    // Expand auto algae
                    if (Array.isArray(compressed.aa)) {
                      expanded.autoAlgaePlaceNetShot = compressed.aa[0] || 0;
                      expanded.autoAlgaePlaceProcessor = compressed.aa[1] || 0;
                      expanded.autoAlgaePlaceDropMiss = compressed.aa[2] || 0;
                      expanded.autoAlgaePlaceRemove = compressed.aa[3] || 0;
                      expanded.autoAlgaePickReefCount = compressed.aa[4] || 0;
                    } else {
                      expanded.autoAlgaePlaceNetShot = 0;
                      expanded.autoAlgaePlaceProcessor = 0;
                      expanded.autoAlgaePlaceDropMiss = 0;
                      expanded.autoAlgaePlaceRemove = 0;
                      expanded.autoAlgaePickReefCount = 0;
                    }
                    
                    // Expand teleop coral
                    if (Array.isArray(compressed.tc)) {
                      expanded.teleopCoralPlaceL1Count = compressed.tc[0] || 0;
                      expanded.teleopCoralPlaceL2Count = compressed.tc[1] || 0;
                      expanded.teleopCoralPlaceL3Count = compressed.tc[2] || 0;
                      expanded.teleopCoralPlaceL4Count = compressed.tc[3] || 0;
                      expanded.teleopCoralPlaceDropMissCount = compressed.tc[4] || 0;
                      expanded.teleopCoralPickStationCount = compressed.tc[5] || 0;
                      expanded.teleopCoralPickCarpetCount = compressed.tc[6] || 0;
                    } else {
                      expanded.teleopCoralPlaceL1Count = 0;
                      expanded.teleopCoralPlaceL2Count = 0;
                      expanded.teleopCoralPlaceL3Count = 0;
                      expanded.teleopCoralPlaceL4Count = 0;
                      expanded.teleopCoralPlaceDropMissCount = 0;
                      expanded.teleopCoralPickStationCount = 0;
                      expanded.teleopCoralPickCarpetCount = 0;
                    }
                    
                    // Expand teleop algae
                    if (Array.isArray(compressed.ta)) {
                      expanded.teleopAlgaePlaceNetShot = compressed.ta[0] || 0;
                      expanded.teleopAlgaePlaceProcessor = compressed.ta[1] || 0;
                      expanded.teleopAlgaePlaceDropMiss = compressed.ta[2] || 0;
                      expanded.teleopAlgaePlaceRemove = compressed.ta[3] || 0;
                      expanded.teleopAlgaePickReefCount = compressed.ta[4] || 0;
                      expanded.teleopAlgaePickCarpetCount = compressed.ta[5] || 0;
                    } else {
                      expanded.teleopAlgaePlaceNetShot = 0;
                      expanded.teleopAlgaePlaceProcessor = 0;
                      expanded.teleopAlgaePlaceDropMiss = 0;
                      expanded.teleopAlgaePlaceRemove = 0;
                      expanded.teleopAlgaePickReefCount = 0;
                      expanded.teleopAlgaePickCarpetCount = 0;
                    }
                    
                    // Expand endgame booleans (including autoPassedStartLine)
                    if (typeof compressed.g === 'number') {
                      expanded.shallowClimbAttempted = !!(compressed.g & 1);
                      expanded.deepClimbAttempted = !!(compressed.g & 2);
                      expanded.parkAttempted = !!(compressed.g & 4);
                      expanded.climbFailed = !!(compressed.g & 8);
                      expanded.playedDefense = !!(compressed.g & 16);
                      expanded.brokeDown = !!(compressed.g & 32);
                      expanded.autoPassedStartLine = !!(compressed.g & 64);
                    } else {
                      expanded.shallowClimbAttempted = false;
                      expanded.deepClimbAttempted = false;
                      expanded.parkAttempted = false;
                      expanded.climbFailed = false;
                      expanded.playedDefense = false;
                      expanded.brokeDown = false;
                      expanded.autoPassedStartLine = false;
                    }
                    
                    // Keep comment
                    if (compressed.c) expanded.comment = compressed.c;
                    
                    if (index === 0) {
                        addDebugMsg(`🔍 Chaves expandidas de exemplo: ${Object.keys(expanded).join(', ')}`);
                        addDebugMsg(`🔍 Pontuação expandida de exemplo: ${JSON.stringify({
                        autoCoralL1: expanded.autoCoralPlaceL1Count,
                        teleopCoralL1: expanded.teleopCoralPlaceL1Count,
                        autoAlgaeNet: expanded.autoAlgaePlaceNetShot,
                        teleopAlgaeNet: expanded.teleopAlgaePlaceNetShot,
                        autoPassedStartLine: expanded.autoPassedStartLine
                      })}`);
                    }
                    
                    // Use preserved original ID (should always exist since compression preserves it)
                    const originalId = compressed.id;
                    if (!originalId) {
                      throw new Error(`ID ausente na entrada comprimida no índice ${index}. 
                        Isso pode indicar dados corrompidos ou um formato de compressão incompatível. 
                        Por favor, regenere os códigos QR ou entre em contato com o suporte se o problema persistir.`
                      );}
                    
                    return {
                      id: originalId,
                      data: expanded,
                      timestamp: Date.now()
                    };
                  });
                  
                  parsedData = { entries: expandedEntries };
                  addDebugMsg(`✅ Descompressão inteligente bem-sucedida (${expandedEntries.length} entradas expandidas)`);
                  addDebugMsg(`🔍 Dados da primeira entrada expandida: ${JSON.stringify(expandedEntries[0]?.data).substring(0, 150)}...`);
                  } else {
                    // Formato JSON padrão
                    addDebugMsg("📄 Formato JSON padrão detectado");
                    parsedData = decompressedData;
                  }
              } else {
                // Uncompressed data - standard JSON decoding
                addDebugMsg("📄 Dados não comprimidos detectados");
                setCompressionDetected(false);
                const jsonString = new TextDecoder().decode(decodedData);
                parsedData = JSON.parse(jsonString);
                addDebugMsg("✅ Parsing JSON bem-sucedido");
              }
            } catch (error) {
              addDebugMsg(`❌ Falha no processamento dos dados: ${error instanceof Error ? error.message : String(error)}`);
              toast.error("Falha ao processar os dados reconstruídos");
              return;
            }
            
            // Debug: Log the structure of the parsed data
            addDebugMsg(`🔍 Tipo de dados analisados: ${typeof parsedData}`);
            addDebugMsg(`🔍 Chaves dos dados: ${parsedData && typeof parsedData === 'object' ? Object.keys(parsedData as Record<string, unknown>).join(', ') : 'N/D'}`);
            if (parsedData && typeof parsedData === 'object' && 'entries' in parsedData) {
              const entries = (parsedData as { entries: unknown }).entries;
              addDebugMsg(`🔍 Tipo de entradas: ${typeof entries}, quantidade: ${Array.isArray(entries) ? entries.length : 'N/D'}`);
            }
            
            if (validateData(parsedData)) {
              setReconstructedData(parsedData);
              setIsComplete(true);
              setProgress({ received: packetsRef.current.size, needed: packetsRef.current.size, percentage: 100 });
              
              saveData(parsedData);
              toast.success(completionMessage);
            } else {
              addDebugMsg("❌ Dados reconstruídos falharam na validação");
              addDebugMsg(`❌ Estrutura dos dados: ${JSON.stringify(parsedData).substring(0, 200)}...`);
              toast.error("Os dados reconstruídos são inválidos");
            }
            return;
          }
        } catch (error) {
            addDebugMsg(`🚨 Erro de bloco: ${error instanceof Error ? error.message : String(error)}`);
            toast.error("Falha ao processar o pacote");
          return;
        }
      }

      // Update progress estimate (IMPROVED: No artificial 95% cap)
      const received = packetsRef.current.size;
      let estimatedNeeded = Math.max(packet.k + 5, 10); // Slightly more conservative estimate
      let progressPercentage = (received / estimatedNeeded) * 100;
      
      // If we're beyond the initial estimate, use a more dynamic approach
      if (received > estimatedNeeded) {
        // Once we exceed the estimate, assume we need ~20% more than current
        estimatedNeeded = Math.ceil(received * 1.2);
        progressPercentage = (received / estimatedNeeded) * 100;
        addDebugMsg(`🔄 Estimativa ajustada: agora são necessários ~${estimatedNeeded} pacotes`);
      }
      
      // Cap at 99% instead of 95% to show we're still working
      progressPercentage = Math.min(progressPercentage, 99);
      
      setProgress({ 
        received, 
        needed: estimatedNeeded, 
        percentage: progressPercentage 
      });
      
      // Calculate and update missing packets
      const missing = calculateMissingPackets();
      setMissingPackets(missing);
      
      addDebugMsg(`📈 Progresso: ${received}/${estimatedNeeded} (${progressPercentage.toFixed(1)}%)`);
      
      // Log missing packets info
      if (missing.length > 0 && missing.length <= 20) {
        addDebugMsg(`🔍 Pacotes ausentes: [${missing.join(', ')}]`);
      } else if (missing.length > 20) {
        addDebugMsg(`🔍 ${missing.length} pacotes ausentes: [${missing.slice(0, 5).join(', ')}, ..., ${missing.slice(-5).join(', ')}]`);
      } else {
        addDebugMsg(`✅ Nenhum pacote ausente no intervalo atual!`);
      }
      // Add debugging when we're getting close to completion but decoder isn't ready
      if (received > packet.k && progressPercentage > 90) {
        addDebugMsg(`🔍 Contagem alta de pacotes, mas ainda sem conclusão: k=${packet.k}, recebidos=${received}`);
        addDebugMsg(`🔍 Verificação do estado do decodificador necessária – pode precisar de mais pacotes que o mínimo teórico`);
        
        // Alert user if we've scanned significantly more than expected
        if (received > estimatedNeeded * 1.5) {
          addDebugMsg(`⚠️ A LEITURA PODE ESTAR PRESA: ${received} pacotes >> ${estimatedNeeded} estimados`);
          addDebugMsg(`💡 Considere verificar o gerador para os controles de navegação dos pacotes`);
        }
      }

    } catch (error) {
      addDebugMsg(`❌ Erro na leitura do QR: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Erro na leitura do QR:", error);
      toast.error("Erro ao processar o código QR");
    }
  };

  const resetScanner = () => {
    sessionRef.current = null;
    setCurrentSession(null);
    decoderRef.current = null;
    packetsRef.current.clear();
    totalPacketsRef.current = null;
    setProgress({ received: 0, needed: 0, percentage: 0 });
    setIsComplete(false);
    setReconstructedData(null);
    setDebugLog([]);
    setCompressionDetected(null);
    setMissingPackets([]);
    setTotalPackets(null);
    addDebugMsg("🔄 Scanner reiniciado");
  };

  const handleComplete = () => {
    toast.success(`Dados de ${dataType} carregados com sucesso!`);
    navigate("/");
  };

  if (isComplete && reconstructedData) {
    return (
      <div className="h-screen w-full flex flex-col items-center px-4 pt-6 pb-6">
        <div className="flex flex-col gap-4 max-w-md w-full">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-green-600">Reconstrução Concluída!</CardTitle>
              <CardDescription>
                {completionMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {getDataSummary(reconstructedData)}
                </Badge>
                <Badge variant="outline">
                  {progress.received} packets received
                </Badge>
              </div>

              <div className="w-full space-y-2">
                <Button
                  onClick={handleComplete}
                  className="w-full"
                >
                  Continue to App
                </Button>
                
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="w-full"
                >
                  Escanear Mais Dados
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground text-start space-y-1">
            <p>• Dados salvos no armazenamento local</p>
            <p>• Pronto para uso em todo o app</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center gap-6 px-4 pt-[var(--header-height)]">
      <div className="flex flex-col items-center gap-4 max-w-md w-full max-h-full overflow-y-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between w-full">
          <Button 
            onClick={onBack} 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2"
          >
            ← Back
          </Button>
          {onSwitchToGenerator && (
            <Button 
              onClick={onSwitchToGenerator} 
              variant="outline" 
              size="sm"
            >
              Alternar para o Gerador
            </Button>
          )}
        </div>

        {/* Scanning Instructions */}
        {currentSession && (
          <Alert>
            <AlertTitle>📱 Instruções de Leitura</AlertTitle>
            <AlertDescription>
              Leia os pacotes de código fountain em qualquer ordem. A reconstrução será concluída automaticamente quando dados suficientes forem recebidos.
            </AlertDescription>
          </Alert>
        )}

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {currentSession && (
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Badge variant="secondary">
                  Sessão: ...{currentSession.slice(-8)}
                </Badge>
                <Badge variant="outline">
                  {progress.received} pacotes
                </Badge>
                <Badge variant="outline">
                  {progress.percentage.toFixed(1)}%
                </Badge>
                {compressionDetected === true && (
                  <Badge variant="default" className="bg-green-600">
                    🗜️ Comprimido
                  </Badge>
                )}
                {compressionDetected === false && (
                  <Badge variant="outline">
                    📄 Padrão
                  </Badge>
                )}
              </div>
            )}

            <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg">
              <Scanner
                components={{ finder: false }}
                styles={{ 
                  video: { 
                    borderRadius: "7.5%",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  } 
                }}
                onScan={handleQRScan}
                onError={() =>
                  toast.error("QR Scanner Error")
                }
              />
            </div>

            {progress.received > 0 && (
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{progress.percentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={Math.min(progress.percentage, 100)}
                  className="w-full"
                />
                
                {/* Missing packets indicator */}
                {missingPackets.length > 0 && totalPackets && (
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground">Pacotes ausentes</span>
                      <Badge variant="outline" className="text-xs">
                        {missingPackets.length} ausentes
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded max-h-16 overflow-y-auto">
                      {missingPackets.length <= 30 ? (
                        <span>#{missingPackets.join(', #')}</span>
                      ) : (
                        <span>
                          #{missingPackets.slice(0, 10).join(', #')} 
                          <span className="text-orange-500"> ... and {missingPackets.length - 10} mais</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Complete packets indicator when no missing */}
                {missingPackets.length === 0 && totalPackets && progress.received > 5 && (
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Todos os pacotes no intervalo #{1} - #{totalPackets}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 w-full flex-wrap">
              {currentSession && (
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="flex-1 min-w-0"
                >
                  Reiniciar Leitor
                </Button>
              )}
              
              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={() => setAllowDuplicates(!allowDuplicates)}
                  variant={allowDuplicates ? "default" : "outline"}
                  className="flex-1 min-w-0"
                  size="sm"
                >
                  {allowDuplicates ? "Allow Dupes ✓" : "Skip Dupes"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {debugLog.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-sm">Registro de Depuração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {debugLog.map((log, index) => (
                  <div key={index} className="font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UniversalFountainScanner;
