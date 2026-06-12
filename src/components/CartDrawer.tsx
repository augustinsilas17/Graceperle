import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, Sparkles, Tag, Check, Award } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface CartDrawerProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  profile: UserProfile;
  appliedDiscount: number;
  onApplyDiscount: (percent: number) => void;
  customNote: string;
  onUpdateCustomNote: (note: string) => void;
}

export default function CartDrawer({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  profile,
  appliedDiscount,
  onApplyDiscount,
  customNote,
  onUpdateCustomNote
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const totalCalculatedPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = Math.round(totalCalculatedPrice * (appliedDiscount / 100));
  const finalPrice = totalCalculatedPrice - discountAmount;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'AURUM' || code === 'PRESTIGE') {
      onApplyDiscount(15);
      setPromoFeedback({ text: 'Code PROMO "15% Privilège" appliqué avec succès !', isError: false });
    } else if (code === 'BIENVENUE') {
      onApplyDiscount(10);
      setPromoFeedback({ text: 'Code PROMO "10% Bienvenue" appliqué avec succès !', isError: false });
    } else {
      setPromoFeedback({ text: 'Code de prestige non répertorié.', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-hidden bg-black/85 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#0c0c0c] border-l border-zinc-900 text-[#f5f2ed] shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#d4af37]" />
              <h2 className="font-serif text-lg italic text-white">Mon Panier d'Achat</h2>
              <span className="bg-zinc-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-800">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-zinc-400 hover:text-[#d4af37] hover:bg-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col text-left">
            
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 border border-zinc-900 text-zinc-500 mb-2">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-lg italic text-zinc-300">Votre panier est vide</h3>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Ajoutez de magnifiques bijoux d'art ou fournitures au panier d'achat à travers notre collection vitrine.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 border border-[#d4af37] text-[#d4af37] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors"
                >
                  Découvrir les Collections
                </button>
              </div>
            ) : (
              <>
                {/* List items */}
                <div className="space-y-4 flex-1">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600 font-bold font-mono">Articles réservés</p>
                  
                  {cart.map(item => (
                    <div 
                      key={`cart-item-${item.product.id}`} 
                      className="flex gap-4 bg-zinc-950 border border-zinc-900 p-3 hover:border-[#d4af37]/20 transition-colors"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-sm bg-zinc-900 flex-shrink-0 border border-zinc-850">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1 text-left min-w-0">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{item.product.category === 'freshwater' ? 'Eau Douce' : item.product.category === 'saltwater' ? 'Mers du Sud' : item.product.category === 'gemstone' ? 'Pierres fines' : 'Atelier'}</span>
                        <h4 className="text-xs font-semibold text-white truncate" title={item.product.name}>
                          {item.product.name}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-serif text-xs font-bold text-[#d4af37]">{item.product.price} €</p>
                          
                          {/* Quantity control */}
                          <div className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-2 py-0.5">
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="text-zinc-500 hover:text-white"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-[10px] font-mono text-white min-w-3 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="text-zinc-500 hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-1 rounded-sm text-zinc-650 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                          title="Retirer du panier"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">
                          {item.product.price * item.quantity} €
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Field Section: Personalization Note and Coupon Code */}
                  <div className="border-t border-zinc-900 pt-4 space-y-4 text-left">
                    {/* Custom engraving note field */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-mono font-bold block">
                        Personnalisation & Gravure d'Atelier
                      </label>
                      <textarea
                        value={customNote}
                        onChange={(e) => onUpdateCustomNote(e.target.value)}
                        placeholder="Ex: Gravure d'initiales, taille de poignet particulière pour les bracelets..."
                        rows={2}
                        className="w-full bg-[#050505] border border-zinc-900 hover:border-zinc-800 focus:border-[#d4af37]/60 p-2 text-xs text-zinc-300 placeholder-zinc-700 outline-none resize-none transition-colors"
                      />
                    </div>

                    {/* Promo Code field */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                        Code Privilège / Code Promo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Saisissez ex: AURUM (15%)"
                          className="flex-1 bg-[#050505] border border-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:border-[#d4af37]/60 outline-none"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="bg-zinc-900 border border-zinc-800 hover:border-[#d4af37]/45 hover:text-white text-zinc-400 px-3.5 text-xs font-mono transition-colors"
                        >
                          Appliquer
                        </button>
                      </div>
                      {promoFeedback && (
                        <p className={`text-[9px] font-mono leading-none mt-1 ${promoFeedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                          {promoFeedback.text}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Total block */}
                  <div className="border-t border-zinc-900 pt-4 mt-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Sous-total précieux :</span>
                      <span>{totalCalculatedPrice} €</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          Remise Privilège ({appliedDiscount}%) :
                        </span>
                        <span>-{discountAmount} €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-500">
                      <span>Frais & Assurance d'expédition :</span>
                      <span className="text-emerald-400 font-sans">Offert (Prestige)</span>
                    </div>
                    <div className="border-t border-zinc-900 pt-3 flex justify-between items-baseline font-serif text-lg font-bold text-white">
                      <span className="italic">Total à régler :</span>
                      <span className="text-xl text-[#d4af37]">{finalPrice} €</span>
                    </div>
                  </div>
                </div>

                {/* Checkout actions */}
                <div className="border-t border-zinc-900 pt-5 mt-auto space-y-3">
                  <div className="flex gap-2 text-[10px] text-zinc-500 leading-relaxed font-sans bg-zinc-950 p-2.5 border border-zinc-900">
                    <Sparkles className="h-4 w-4 text-[#d4af37] shrink-0" />
                    <span>
                      Livraison de prestige avec certificat d'authenticité et numéro de suivi blindé.
                    </span>
                  </div>

                  <button
                    onClick={onCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-[#faf6f0] text-black text-xs font-bold uppercase tracking-widest py-4 hover:bg-[#d4af37] transition-all cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    Procéder au Paiement Sécurisé
                  </button>

                  <button
                    onClick={onClearCart}
                    className="w-full text-center text-zinc-500 hover:text-zinc-300 text-[10px] uppercase tracking-wider font-mono py-1"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
