import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// TEST CONTROL - Set to true to force show the prompt
const FORCE_SHOW_INSTALL_PROMPT = false;

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(prompt);
      
      // Check if user previously dismissed and if enough time has passed
      const lastDismissed = localStorage.getItem('install-prompt-dismissed');
      const now = Date.now();
      const daysSinceLastDismiss = lastDismissed ? 
        (now - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999;
      
      // Show prompt if never dismissed OR it's been 7 days since last dismissal
      if (!lastDismissed || daysSinceLastDismiss >= 7) {
        setTimeout(() => setShowPrompt(true), 5000);
        analytics.trackEvent('pwa_install_prompt_shown');
      } else {
        console.log(`Prompt de instalação suprimido. ${Math.ceil(7 - daysSinceLastDismiss)} dias restantes.`);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Force show for testing - trigger the real install prompt
    if (FORCE_SHOW_INSTALL_PROMPT) {
      console.log('🧪 FORÇAR A EXIBIÇÃO DO PROMPT DE INSTALAÇÃO PARA TESTE');
      
      // Simple approach - just show the prompt after 2 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {      
      // Platform-aware install instructions
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      let instructions = '';
      if (isIOS) {
        instructions = 'Para instalar este app no iOS:\n\n1. Toque no botão Compartilhar (□↗) no Safari\n2. Role para baixo e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar" para instalar o Maneuver';
      } else if (isMobile) {
        instructions = 'Para instalar este app:\n\n1. Toque no menu (⋮) do seu navegador\n2. Procure por "Instalar app" ou "Adicionar à Tela de Início"\n3. Toque para instalar o Maneuver';
      } else {
        instructions = 'Para instalar este app:\n\n1. Procure pelo ícone de instalação (⊕) na barra de endereços do seu navegador\n2. Clique nele para instalar o Maneuver\n3. Ou use o menu do navegador: Configurações > Instalar Maneuver';
      }
      
      alert(instructions + '\n\nAproveite o acesso offline!');
      
      setShowPrompt(false);
      return;
    }

    // Clear any previous dismissal since user is now installing
    localStorage.removeItem('install-prompt-dismissed');
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      analytics.trackEvent('pwa_install_prompt_result', { outcome });
      
      if (outcome === 'accepted') {
        analytics.trackPWAInstall();
      } else {
        // User dismissed the browser's install dialog
        localStorage.setItem('install-prompt-dismissed', Date.now().toString());
      }
    } catch (error) {
      console.error('Erro de prompt de instalação:', error);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // Store dismissal timestamp
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
    
    setShowPrompt(false);
    analytics.trackEvent('pwa_install_prompt_dismissed');
  };

  // Show if we have showPrompt true AND (we're in force mode OR we have a real prompt)
  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg">
      <CardContent>
        <div className="relative">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDismiss}
            className="absolute -top-2 -left-2 h-6 w-6 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col">
            <div className="flex-1 justify-center items-center">
              <div className='flex items-center justify-center gap-2 py-1'>
                <Download className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="font-semibold text-sm">Instalar Maneuver Steel Bulls 9460</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center py-1">
                Instale este aplicativo para acesso mais rápido e uso offline
              </p>
              {FORCE_SHOW_INSTALL_PROMPT && !deferredPrompt && (
                <p className="text-xs text-yellow-600 mt-1 font-mono text-center">
                  🧪 MODO DE TESTE - Guiará para instalação manual
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleInstall} className="flex-1">
                  Instalar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}