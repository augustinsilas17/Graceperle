import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2, ShoppingBag, Check, Send, Sparkles, Share2, Link, Mail, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { Product, Inquiry } from '../types';

interface WishlistDrawerProps {
  wishlist: Product[];
  onClose: () => void;
  onRemoveFromWishlist: (product: Product) => void;
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
  onClearWishlist: () => void;
}

export default function WishlistDrawer({
  wishlist,
  onClose,
  onRemoveFromWishlist,
  onAddInquiry,
  onClearWishlist
}: WishlistDrawerProps) {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [shareSent, setShareSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareRecipientEmail, setShareRecipientEmail] = useState('');
  const [shareRecipientName, setShareRecipientName] = useState('');
  const [sharePersonalMsg, setSharePersonalMsg] = useState('');
  const [isShareExpanded, setIsShareExpanded] = useState(false);

  // Fullscreen states & refs
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!drawerRef.current) return;
    if (!document.fullscreenElement) {
      drawerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Failed to enter immersive fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error("Failed to exit fullscreen mode:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const totalCalculatedPrice = wishlist.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const itemsSummary = wishlist.map(p => `"${p.name}" (${p.price} €)`).join(', ');

    onAddInquiry({
      name,
      email,
      phone,
      type: 'product_reservation',
      message: message || `Bonjour, je serais ravi(e) de planifier une visite privée ou de réserver les pièces suivantes de votre vitrine : ${itemsSummary}. Merci de m'indiquer leur disponibilité.`,
      customDesignDetails: `Demande de réservation multiple pour: ${itemsSummary}`
    });

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClearWishlist();
      onClose();
    }, 4500);
  };

  const handleCopyLink = () => {
    const ids = wishlist.map(p => p.id).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}?wishlist=${ids}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(err => {
      console.error('Failed to copy link', err);
    });
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareRecipientEmail) return;

    const ids = wishlist.map(p => p.id).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}?wishlist=${ids}`;
    
    const mailSubject = encodeURIComponent("Une sélection d'exception - Maison Aurum Beads");
    const mailBody = encodeURIComponent(
      `Bonjour ${shareRecipientName || 'cher proche'},\n\n` +
      `J'ai partagé avec vous ma sélection de haute joaillerie chez l'Atelier Aurum Beads :\n\n` +
      `${wishlist.map(p => `- ${p.name} (${p.price} €)`).join('\n')}\n\n` +
      `Vous pouvez la consulter directement en cliquant sur ce lien d'exception :\n${shareUrl}\n\n` +
      `${sharePersonalMsg ? `Message personnel :\n"${sharePersonalMsg}"\n\n` : ''}` +
      `Avec mes salutations distinguées.`
    );

    window.location.href = `mailto:${shareRecipientEmail}?subject=${mailSubject}&body=${mailBody}`;

    setShareSent(true);
    setTimeout(() => {
      setShareSent(false);
      setShareRecipientEmail('');
      setShareRecipientName('');
      setSharePersonalMsg('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-xs transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={`absolute inset-y-0 right-0 flex max-w-full ${isFullscreen ? 'w-full pl-0' : 'pl-10'}`}>
        <div 
          ref={drawerRef}
          className={`bg-[#0c0c0c] text-[#f5f2ed] shadow-2xl flex flex-col h-full transform transition-all overflow-hidden ${
            isFullscreen 
              ? 'w-screen max-w-none p-4 md:p-8' 
              : 'w-screen max-w-md border-l border-zinc-900'
          }`}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#d4af37]" />
              <h2 className="font-serif text-lg italic text-white">
                {isFullscreen ? "Écrin Virtuel Immersif Maison Aurum" : "Mon Panier Vitrine"}
              </h2>
              <span className="bg-zinc-90 w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-zinc-900 text-zinc-400 font-bold border border-zinc-805">
                {wishlist.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle Fullscreen Button */}
              {wishlist.length > 0 && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs border border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 hover:bg-zinc-900 transition-all cursor-pointer"
                  title={isFullscreen ? "Quitter le plein écran" : "Plein Écran Immersif"}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span className="hidden sm:inline">Quitter</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span className="hidden sm:inline">Plein Écran</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-sm text-zinc-400 hover:text-[#d4af37] hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className={`flex-1 overflow-y-auto p-6 flex ${
            isFullscreen && wishlist.length > 0 ? 'flex-col lg:flex-row gap-8 space-y-0 text-left' : 'flex-col space-y-8'
          }`}>
            
            {wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 border border-zinc-900 text-zinc-500 mb-2">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-lg italic text-zinc-300">Votre vitrine est vide</h3>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Naviguez à travers l'Atelier ou la Vitrine de perles pour ajouter des modèles signatures à vos favoris ou réserver des modèles d'exception.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 border border-[#d4af37] text-[#d4af37] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors"
                >
                  Découvrir la Vitrine
                </button>
              </div>
            ) : (
              <>
                {/* Left region: List items/Grid of Jewels */}
                <div className="flex-1 space-y-4">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                    {isFullscreen ? "Vitrine Sublime — Grand Format" : "Pièces sélectionnées"}
                  </p>
                  
                  <div className={isFullscreen ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {wishlist.map(product => (
                      <div 
                        key={product.id} 
                        className={`bg-zinc-950 border border-zinc-900 p-4 group hover:border-[#d4af37]/20 transition-colors ${
                          isFullscreen ? 'flex flex-col gap-4 h-full justify-between' : 'flex items-center gap-4'
                        }`}
                      >
                        <div className={`overflow-hidden rounded-sm bg-zinc-900 border border-zinc-800 flex-shrink-0 relative ${
                          isFullscreen ? 'w-full aspect-square' : 'h-14 w-14'
                        }`}>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-705" 
                          />
                        </div>
                        
                        <div className="flex-1 text-left min-w-0">
                          <span className="text-[8px] font-mono text-[#d4af37] uppercase tracking-widest">{product.category}</span>
                          <h4 className={`text-white truncate my-0.5 font-serif ${isFullscreen ? 'text-sm font-semibold' : 'text-xs font-semibold'}`} title={product.name}>
                            {product.name}
                          </h4>
                          <p className="font-serif text-xs font-bold text-[#d4af37]">{product.price} €</p>
                          {isFullscreen && (
                            <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed font-sans font-light">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="p-1.5 rounded-sm text-zinc-650 hover:text-red-400 hover:bg-zinc-900 transition-colors self-end"
                          title="Retirer de la vitrine"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Estimation Total */}
                  <div className="border-t border-zinc-900 pt-5 mt-5 flex justify-between items-baseline font-serif mb-3">
                    <span className="text-sm italic text-zinc-400">Total estimatif de la sélection :</span>
                    <span className="text-xl font-bold text-[#d4af37]">{totalCalculatedPrice} €</span>
                  </div>
                </div>

                {/* Right region: Actions, Share & Reservation Form */}
                <div className={`shrink-0 space-y-6 ${isFullscreen ? 'w-full lg:w-[380px] bg-zinc-950/40 p-6 border border-zinc-900/60 rounded-sm text-left h-fit' : ''}`}>
                  {/* Bouton Partager mon Écrin Direct (Précis & Royal) */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 border text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.30)]'
                        : 'bg-zinc-950 text-[#d4af37] border-[#d4af37]/45 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] shadow-lg'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Lien Copernic Copié ! ✦</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Partager mon Écrin</span>
                      </>
                    )}
                  </button>

                  {/* PARTAGER LA LISTE D'ENVIES / WISHLIST SHARE */}
                  <div className="border border-zinc-900 bg-zinc-950/45 p-4 rounded-[1px] space-y-3 text-left">
                    <button 
                      type="button"
                      onClick={() => setIsShareExpanded(!isShareExpanded)}
                      className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-[#d4af37]" />
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">
                          Partager mon Écrin
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#d4af37] border-b border-[#d4af37]/30 hover:border-[#d4af37]">
                        {isShareExpanded ? "Masquer" : "Déployer"}
                      </span>
                    </button>
                    
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Soumettez votre sélection de haute joaillerie à vos proches ou suggérez un présent mémorable.
                    </p>

                    {isShareExpanded && (
                      <div className="pt-3 border-t border-zinc-900 space-y-4">
                        {/* Option 1: Copy Direct Link */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono font-bold flex items-center gap-1">
                            <Link className="h-3 w-3 text-[#d4af37]" />
                            Option A : Lien de Partage Unique
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}${window.location.pathname}?wishlist=${wishlist.map(p => p.id).join(',')}`}
                              className="flex-1 bg-zinc-950 border border-zinc-900 px-3 py-2 text-[10px] font-mono text-zinc-400 focus:outline-none rounded-xs select-all text-xs"
                            />
                            <button
                              type="button"
                              onClick={handleCopyLink}
                              className={`px-3.5 py-2 border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 rounded-xs cursor-pointer ${
                                copied 
                                  ? 'bg-[#d4af37] text-black border-[#d4af37]' 
                                  : 'bg-zinc-900 text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37]'
                              }`}
                            >
                              {copied ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Copié
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copier
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Share via Email Form */}
                        <form onSubmit={handleSendEmail} className="space-y-3.5 border-t border-zinc-900 pt-3.5">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono font-bold flex items-center gap-1.5 block">
                            <Mail className="h-3 w-3 text-[#d4af37]" />
                            Option B : Suggérer par E-mail
                          </label>

                          {shareSent ? (
                            <div className="p-3 bg-zinc-950 border border-emerald-950/20 text-emerald-400 rounded-sm text-center space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest block flex items-center justify-center gap-1">
                                <Check className="h-3.5 w-3.5" />
                                E-mail Préparé d'Exception !
                              </span>
                              <p className="text-[9px] text-zinc-500 leading-relaxed">
                                Votre client de messagerie a été initialisé avec votre sélection.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold mb-1 block">Nom du proche</label>
                                  <input
                                    type="text"
                                    value={shareRecipientName}
                                    onChange={(e) => setShareRecipientName(e.target.value)}
                                    placeholder="Ex: Alexandre"
                                    className="w-full bg-[#050505] border border-zinc-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37] rounded-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold mb-1 block">E-mail</label>
                                  <input
                                    type="email"
                                    required
                                    value={shareRecipientEmail}
                                    onChange={(e) => setShareRecipientEmail(e.target.value)}
                                    placeholder="contact@proche.com"
                                    className="w-full bg-[#050505] border border-zinc-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37] rounded-xs"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold mb- block">Message Personnel de Vœux</label>
                                <textarea
                                  rows={2}
                                  value={sharePersonalMsg}
                                  onChange={(e) => setSharePersonalMsg(e.target.value)}
                                  placeholder="Mon anniversaire approche, ces parures de nacre d'Atelier m'enchantent particulièrement..."
                                  className="w-full bg-[#050505] border border-zinc-900 p-2 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none rounded-xs"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-2 bg-zinc-900 border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[#d4af37] text-[9px] font-bold uppercase tracking-widest transition-all rounded-[1px] flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Send className="h-3 w-3" />
                                Ouvrir ma messagerie
                              </button>
                            </div>
                          )}
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Simulated Checkout Form */}
                  <div className="border-t border-zinc-900 pt-6 mt-auto bg-[#0d0d0d] space-y-4 text-left">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Demander une Réservation Privée</h4>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                        L'Atelier Aurum Beads ne propose pas de paiements automatisés afin d'offrir un service privé ultra-personnalisé sur chaque commande.
                      </p>
                    </div>

                    {formSent ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center bg-[#111] border border-emerald-950/20 rounded-[2px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 border border-emerald-850 text-emerald-400 mb-2">
                          <Check className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-zinc-200">Demande Transmise !</p>
                        <p className="text-[10px] text-zinc-500 max-w-xs mt-0.5 leading-relaxed">
                          Notre concierge a bien bloqué ces bijoux d'art dans nos stocks. Nous revenons vers vous dans l'heure.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Nom</label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Sophie Lapointe"
                              className="w-full bg-zinc-950 border border-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Téléphone</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+33..."
                              className="w-full bg-zinc-950 border border-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Email</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sophie@example.com"
                            className="w-full bg-zinc-950 border border-zinc-900 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Spécifier des détails (Optionnel)</label>
                          <textarea
                            rows={2}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ex: Je désirerais recevoir les bijoux rangés dans un coffret de bois de chêne laqué..."
                            className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none text-left"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest py-3.5 hover:opacity-90 active:scale-[0.99] transition-transform cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Envoyer ma commande vitrine
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
