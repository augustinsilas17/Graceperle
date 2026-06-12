import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, X, Shield, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface AiChatWidgetProps {
  onAddToCart: (productId: string) => void;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onAddTestimonial: (authorName: string, comment: string, rating: number) => void;
  products: Product[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialUserInput?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChatWidget({ 
  onAddToCart, 
  onOpenCart, 
  onOpenProfile, 
  onAddTestimonial, 
  products,
  isOpen: controlledIsOpen,
  onOpenChange,
  initialUserInput
}: AiChatWidgetProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setLocalIsOpen(open);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour. Je suis l'assistant Concierge de l'Atelier Aurum Beads. Quel joyau d'art ou perles fines puis-je vous aider à découvrir aujourd'hui ?"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [typingStatus, setTypingStatus] = useState("Le Concierge d'Art réfléchit...");
  const [quickReplyTab, setQuickReplyTab] = useState<'decouverte' | 'commande' | 'temoignage'>('decouverte');

  // Load initial user input when opened via trigger
  useEffect(() => {
    if (isOpen && initialUserInput) {
      setUserInput(initialUserInput);
      if (initialUserInput.toLowerCase().includes('témoignage') || initialUserInput.toLowerCase().includes('temoignage')) {
        setQuickReplyTab('temoignage');
      } else if (initialUserInput.toLowerCase().includes('commande') || initialUserInput.toLowerCase().includes('panier')) {
        setQuickReplyTab('commande');
      }
    }
  }, [isOpen, initialUserInput]);

  // Rotate typing visual human state messages
  useEffect(() => {
    if (!isLoading) return;

    const phrases = [
      "Le Concierge d'Art étudie sa parure...",
      "Vérification des stocks d'Or Vendôme...",
      "Polissage des mots de Haute Joaillerie...",
      "Cisélage méticuleux de votre réponse..."
    ];
    let index = 0;
    setTypingStatus(phrases[0]);

    const interval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setTypingStatus(phrases[index]);
    }, 1600);

    return () => clearInterval(interval);
  }, [isLoading]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dismiss notification banner after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickSend = async (text: string) => {
    if (isLoading || !text.trim()) return;
    setIsLoading(true);

    const updatedMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Network response not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      // Perform actions intercepted from AI instruction
      if (data.action) {
        const { type, productId } = data.action;
        if (type === 'ADD_TO_CART' && productId) {
          onAddToCart(productId);
          const foundProduct = products.find(p => p.id === productId);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `✨ [Confirmation] J'ai bien ajouté le "${foundProduct?.name || productId}" à votre panier d'achat !`
            }]);
          }, 800);
        } else if (type === 'OPEN_CART') {
          setTimeout(() => {
            onOpenCart();
          }, 800);
        } else if (type === 'OPEN_PROFILE') {
          setTimeout(() => {
            onOpenProfile();
          }, 800);
        } else if (type === 'ADD_TESTIMONIAL') {
          const { authorName, comment, rating } = data.action;
          onAddTestimonial(authorName || 'Invité d\'Honneur', comment || '', rating || 5);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `✨ [L'Atelier vous remercie] Quel immense honneur ! J'ai bien enregistré et publié votre beau témoignage sur notre vitrine d'Or Vendôme. C'est précieux pour notre maison.`
            }]);
          }, 800);
        }
      }

    } catch (err) {
      console.error("Chat quick send error", err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Navré, j'éprouve une petite difficulté de connexion avec nos serveurs de l'Atelier. Veuillez réessayer d'ici une minute."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: currentInput } as Message];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Network response not ok');
      }

      const data = await response.json();
      
      // Append chatbot reply
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      // Perform actions intercepted from AI instruction
      if (data.action) {
        const { type, productId } = data.action;
        if (type === 'ADD_TO_CART' && productId) {
          onAddToCart(productId);
          const foundProduct = products.find(p => p.id === productId);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `✨ [Confirmation] J'ai bien ajouté le "${foundProduct?.name || productId}" à votre panier d'achat !`
            }]);
          }, 800);
        } else if (type === 'OPEN_CART') {
          setTimeout(() => {
            onOpenCart();
          }, 800);
        } else if (type === 'OPEN_PROFILE') {
          setTimeout(() => {
            onOpenProfile();
          }, 800);
        } else if (type === 'ADD_TESTIMONIAL') {
          const { authorName, comment, rating } = data.action;
          onAddTestimonial(authorName || 'Invité d\'Honneur', comment || '', rating || 5);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `✨ [L'Atelier vous remercie] Quel immense honneur ! J'ai bien enregistré et publié votre beau témoignage sur notre vitrine d'Or Vendôme. C'est précieux pour notre maison.`
            }]);
          }, 800);
        }
      }

    } catch (err) {
      console.error("Chat widgets error", err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Navré, j'éprouve une petite difficulté de connexion avec nos serveurs de l'Atelier. Veuillez réessayer d'ici une minute."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation réinitialisée. Comment puis-je vous accompagner dans vos choix de joaillerie d'art ?"
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Small floating bubble advice notification */}
      {showNotification && !isOpen && (
        <div className="bg-[#0c0c0c] border border-[#d4af37]/30 text-white p-3 shadow-2xl max-w-xs mb-3 rounded-sm text-left animate-bounce relative">
          <button 
            onClick={() => setShowNotification(false)}
            className="absolute top-1 right-1 text-zinc-500 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-start gap-2 pr-4">
            <Sparkles className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">Aurum Concierge IA</p>
              <p className="text-[9px] text-zinc-400 mt-0.5 leading-snug">Besoin de conseils ou prês à commander ? Échangez en direct avec notre Concierge d'Art !</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setShowNotification(false);
          }}
          className="flex h-14 w-14 items-center justify-center bg-[#0c0c0c] text-[#d4af37] border border-[#d4af37]/40 shadow-2xl rounded-full transition-transform hover:scale-110 active:scale-95 focus:outline-none ring-2 ring-[#d4af37]/10"
        >
          <Sparkles className="h-6 w-6 stroke-[1.8] animate-pulse" />
        </button>
      )}

      {/* Sliding Beautiful Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-[#0c0c0c] border border-zinc-900 shadow-2xl flex flex-col overflow-hidden text-left animate-fade-in rounded-sm">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-900 px-4 py-3.5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                  Aurum Assistant IA
                </h4>
                <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Conciergerie Sans Hallucination</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetChat}
                className="p-1 text-zinc-600 hover:text-white rounded-sm"
                title="Recommencer l'échange"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-500 hover:text-white rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-950/20">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#d4af37]">
                    <Sparkles className="h-3 w-3" />
                  </div>
                )}
                
                <div className={`p-3 rounded-sm text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#d4af37]/10 text-[#faf6f0] border border-[#d4af37]/20 rounded-tr-none' 
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-850/40 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto text-left animate-pulse">
                <div className="h-6 w-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#d4af37]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
                  </span>
                </div>
                <div className="p-3 rounded-sm text-xs text-zinc-400 bg-zinc-900 border border-zinc-850 rounded-tl-none space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-[#d4af37] font-semibold">
                      {typingStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 py-1 justify-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37]/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Tab Selector for Quick Contextual Replies */}
          <div className="bg-[#050505] border-t border-zinc-900 px-3 py-1.5 flex justify-between items-center text-[9px] uppercase tracking-wider font-mono text-zinc-500 shrink-0">
            <span className="text-[8px] text-[#d4af37] font-bold">Suggestions :</span>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setQuickReplyTab('decouverte')}
                className={`pb-0.5 px-1 border-b transition-all duration-200 cursor-pointer ${quickReplyTab === 'decouverte' ? 'border-[#d4af37] text-white font-bold' : 'border-transparent text-zinc-650 hover:text-zinc-400'}`}
              >
                Découverte
              </button>
              <button 
                type="button"
                onClick={() => setQuickReplyTab('commande')}
                className={`pb-0.5 px-1 border-b transition-all duration-200 cursor-pointer ${quickReplyTab === 'commande' ? 'border-[#d4af37] text-white font-bold' : 'border-transparent text-zinc-650 hover:text-zinc-400'}`}
              >
                Commandes
              </button>
              <button 
                type="button"
                onClick={() => setQuickReplyTab('temoignage')}
                className={`pb-0.5 px-1 border-b transition-all duration-200 cursor-pointer ${quickReplyTab === 'temoignage' ? 'border-[#d4af37] text-white font-bold' : 'border-transparent text-zinc-650 hover:text-zinc-400'}`}
              >
                Livre d'or
              </button>
            </div>
          </div>

          {/* Quick recommendations chips */}
          <div className="px-3 py-2.5 bg-zinc-950 border-t border-zinc-90 w-full flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {quickReplyTab === 'decouverte' && [
              "💎 Différence entre Akoya et Tahiti ?",
              "🌟 Quelles perles d'eau douce ?",
              "🎨 Comment est né l'Atelier Aurum ?"
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleQuickSend(chip)}
                disabled={isLoading}
                className="shrink-0 text-[9px] font-sans text-zinc-300 border border-zinc-900 bg-[#0d0d0d] px-2.5 py-1.5 rounded-sm hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}

            {quickReplyTab === 'commande' && [
              "🎟️ Avez-vous un code de bienvenue ?",
              "✍️ Comment ajouter une gravure d'Or ?",
              "🛒 Ouvrir mon panier d'achat"
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleQuickSend(chip)}
                disabled={isLoading}
                className="shrink-0 text-[9px] font-sans text-zinc-300 border border-zinc-900 bg-[#0d0d0d] px-2.5 py-1.5 rounded-sm hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}

            {quickReplyTab === 'temoignage' && [
              "✨ Rédiger un témoignage d'émerveillement",
              "🤝 Vos créations sont sublimes !",
              "🏰 Qui fabrique les bijoux à Paris Vendôme ?"
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleQuickSend(chip)}
                disabled={isLoading}
                className="shrink-0 text-[9px] font-sans text-zinc-300 border border-zinc-900 bg-[#0d0d0d] px-2.5 py-1.5 rounded-sm hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input field Footer form */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-zinc-900 bg-zinc-950 flex gap-2 shrink-0 items-center justify-between"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Écrivez un message..."
              disabled={isLoading}
              className="flex-1 bg-[#0d0d0d] border border-zinc-850 px-3 py-2 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="p-2 bg-[#faf6f0] hover:bg-[#d4af37] disabled:bg-zinc-805 disabled:text-zinc-600 font-bold transition-all shrink-0 text-black rounded-sm cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </form>

          {/* Reassurance margin brand footer */}
          <div className="bg-zinc-950 px-3 pb-2 text-[8px] text-zinc-600 text-center uppercase tracking-widest flex items-center justify-center gap-1 select-none">
            <Shield className="h-2.5 w-2.5 text-[#d4af37]/60" />
            Protection d'Artisanat Parisien
          </div>

        </div>
      )}

    </div>
  );
}
