import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatInterface from '../components/oracle/ChatInterface';
import { chatMessages } from '../mocks/strategy';

interface ChatProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat') => void;
}

export default function Chat({ onNavigate }: ChatProps) {
  const [messages, setMessages] = useState(chatMessages);

  const handleSendMessage = (message: string) => {
    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date(),
      isAudio: false,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simular resposta da IA (em produção, isso viria de uma API)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: 'Entendi sua mensagem! Em breve teremos integração completa com IA para responder suas perguntas sobre finanças. 🐷',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleCreateDream = () => {
    // Navegar para estratégia ou criar modal
    onNavigate?.('strategy');
  };

  return (
    <div className="h-full flex flex-col px-4 pt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-4 flex-shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Oracle
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Chat gamificado com Pig-Man
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Chat Interface - Full Screen */}
      <div className="flex-1 flex flex-col min-h-0" style={{ height: 'calc(100vh - 12rem)' }}>
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onCreateDream={handleCreateDream}
          showHeader={false}
          fullScreen={true}
        />
      </div>
    </div>
  );
}

