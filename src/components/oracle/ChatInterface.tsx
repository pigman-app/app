import { motion } from 'framer-motion';
import { Send, Mic, Bot, CheckCircle, Target, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { ChatMessage } from '../../mocks/strategy';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onCreateDream?: () => void;
  showHeader?: boolean;
  fullScreen?: boolean;
}

export default function ChatInterface({ messages, onSendMessage, onCreateDream, showHeader = true, fullScreen = false }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Detectar se a mensagem contém resposta estruturada (Viável, Estratégia, Trilha)
  const parseStructuredResponse = (content: string) => {
    const hasViable = content.includes('Viável') || content.includes('viável');
    const hasStrategy = content.includes('Estratégia') || content.includes('estratégia');
    const hasTrail = content.includes('Trilha') || content.includes('trilha') || content.includes('Mapa de Sonhos');
    
    return { hasViable, hasStrategy, hasTrail };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`flex-1 flex flex-col ${
        fullScreen 
          ? 'bg-transparent p-0' 
          : 'bg-white dark:bg-gray-800 rounded-card-lg p-4 md:p-6 shadow-soft-shadow'
      } min-h-0`}
    >
      {/* Header (opcional) */}
      {showHeader && (
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-pink to-pink-600 flex items-center justify-center shadow-soft-shadow">
            <span className="text-2xl">🐷</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Financial Oracle
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chat gamificado com IA - Conversa com Pig-Man
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-green" />
          </div>
        </div>
      )}

      {/* Messages Container - Ocupa todo espaço disponível */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 min-h-0">
        {messages.map((message, index) => {
          const isUser = message.type === 'user';
          const structured = !isUser ? parseStructuredResponse(message.content) : null;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isUser
                    ? 'bg-gradient-to-br from-brand-pink to-pink-600'
                    : 'bg-gradient-to-br from-brand-green to-green-600'
                }`}
              >
                {isUser ? (
                  <span className="text-xl">🐷</span>
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </motion.div>

              {/* Message Bubble */}
              <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isUser && (
                  <div className="text-xs font-semibold text-brand-green mb-1 px-2">
                    IA PigMan
                  </div>
                )}
                
                <div
                  className={`rounded-card-lg p-4 ${
                    isUser
                      ? 'bg-brand-pink text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.isAudio && isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-4 h-4" />
                      <span className="text-xs opacity-80">Áudio</span>
                    </div>
                  )}

                  {/* Resposta Estruturada da IA */}
                  {structured && !isUser && (
                    <div className="space-y-3">
                      {structured.hasViable && (
                        <div className="flex items-center gap-2 bg-brand-green/20 dark:bg-brand-green/30 px-3 py-2 rounded-card">
                          <CheckCircle className="w-4 h-4 text-brand-green" />
                          <span className="text-sm font-semibold text-brand-green">Viável! ✅</span>
                        </div>
                      )}
                      {structured.hasStrategy && (
                        <div className="flex items-center gap-2 bg-brand-yellow/20 dark:bg-brand-yellow/30 px-3 py-2 rounded-card">
                          <Target className="w-4 h-4 text-brand-yellow" />
                          <span className="text-sm font-semibold text-brand-yellow">Estratégia 🎯</span>
                        </div>
                      )}
                      {structured.hasTrail && (
                        <div className="flex items-center gap-2 bg-brand-pink/20 dark:bg-brand-pink/30 px-3 py-2 rounded-card">
                          <Calendar className="w-4 h-4 text-brand-pink" />
                          <span className="text-sm font-semibold text-brand-pink">Trilha criada 📅</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Botão de Ação se tiver trilha */}
                  {structured?.hasTrail && onCreateDream && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onCreateDream}
                      className="mt-3 w-full bg-brand-pink text-white font-semibold py-2.5 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
                    >
                      <Target className="w-4 h-4" />
                      Acessa a trilha
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}

                  <p className={`text-xs mt-2 ${
                    isUser ? 'opacity-70' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input Area - Fixo no bottom */}
      <div className="flex items-center gap-2 flex-shrink-0 pt-2 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte ao Pig-Man..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center hover:bg-pink-600 transition-colors"
        >
          <Send className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
}



