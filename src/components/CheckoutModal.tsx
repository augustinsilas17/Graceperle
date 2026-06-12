import React, { useState } from 'react';
import { CreditCard, ShieldCheck, X, Check, ArrowRight, Wallet, Smartphone, Landmark, Info } from 'lucide-react';
import { CartItem, UserProfile, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  profile: UserProfile;
  totalPrice: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

type PaymentMethodType = 'card' | 'mobile_money' | 'paypal' | 'apple_pay';

export default function CheckoutModal({ isOpen, cart, profile, totalPrice, onClose, onOrderSuccess }: CheckoutModalProps) {
  const [method, setMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [orderCreated, setOrderCreated] = useState<Order | null>(null);

  // Form states for credit card
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(profile.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form states for Mobile money
  const [operator, setOperator] = useState('orange');
  const [phone, setPhone] = useState(profile.phone || '');
  const [otpCode, setOtpCode] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  if (!isOpen) return null;

  // Formatting helper for Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Formatting helper for Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardExpiry(value);
  };

  const executePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'mobile_money' && !showOtp) {
      // Step 1 of Mobile Money: request/simulate sending OTP
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtp(true);
      }, 1200);
      return;
    }

    setIsProcessing(true);

    // Create a robust order object
    const newOrder: Order = {
      id: `CMD_${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      products: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      totalPrice: totalPrice,
      paymentMethod: method === 'card' 
        ? 'Carte Bancaire' 
        : method === 'mobile_money' 
        ? `Mobile Money (${operator.toUpperCase()})` 
        : method === 'paypal' 
        ? 'PayPal Direct' 
        : 'Apple Pay secure',
      paymentDetails: method === 'card' 
        ? `Visa expirant le ${cardExpiry}` 
        : method === 'mobile_money' 
        ? `Compte ${phone}` 
        : `Transaction sécurisée ${profile.email || 'Client Auth'}`,
      status: 'paid',
      customerName: profile.name || cardName || 'Silas Augustin'
    };

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setOrderCreated(newOrder);
      onOrderSuccess(newOrder);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg border border-zinc-900 bg-[#0c0c0c] p-6 text-[#f5f2ed] shadow-2xl rounded-sm max-h-[92vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-[#d4af37] transition-colors"
          disabled={isProcessing}
        >
          <X className="h-5 w-5" />
        </button>

        {isDone && orderCreated ? (
          // SUCCESS ORDER VIEW
          <div className="text-center py-8 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">TRANSACTION RÉUSSIE</span>
              <h3 className="font-serif text-2xl font-light text-white italic">Commande Confirmée & Payée</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Votre ordre <span className="font-mono text-white font-bold">{orderCreated.id}</span> de <span className="text-white font-bold">{totalPrice} €</span> a été validé avec succès par notre passerelle de paiement privée.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono text-left text-xs space-y-2.5 max-w-sm mx-auto">
              <div className="flex justify-between text-zinc-500 border-b border-zinc-900 pb-1.5">
                <span>Passerelle</span>
                <span className="text-white uppercase">{orderCreated.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Détails</span>
                <span className="text-zinc-300">{orderCreated.paymentDetails}</span>
              </div>
              <div className="flex justify-between text-zinc-500 pt-1 border-t border-zinc-900">
                <span>Client</span>
                <span className="text-zinc-300 line-clamp-1">{orderCreated.customerName}</span>
              </div>
              <div className="flex justify-between text-[#d4af37] font-bold">
                <span>Statut de livraison</span>
                <span className="uppercase text-[10px]">Préparation Atelier</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 italic max-w-xs mx-auto">
              Nos artisans d'art commencent dès à présent à tisser votre commande spéciale. Un e-mail récapitulatif vous a été envoyé.
            </p>

            <button
              onClick={onClose}
              className="bg-[#faf6f0] text-black text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-[#d4af37] transition-all"
            >
              Retour à l'Atelier
            </button>
          </div>
        ) : (
          // ACTIVE CHECKOUT FORM VIEW
          <form onSubmit={executePayment} className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">PAIEMENT SÉCURISÉ</span>
              <h3 className="font-serif text-2xl font-light text-white italic mt-1">Finalisez l'Acquisition</h3>
              <p className="text-zinc-500 text-xs mt-1">
                Choisissez votre méthode préférée de paiement de prestige pour régler vos perles d'art.
              </p>
            </div>

            {/* Price review summary box */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-4 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Total à régler</span>
                <span className="text-zinc-400">{cart.reduce((sum, item) => sum + item.quantity, 0)} perleries de collection</span>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-[#faf6f0] tracking-wide">{totalPrice} €</span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-sans">Taxes & Assurances d'expédition incluses</span>
              </div>
            </div>

            {/* Interactive Grid of Payment Choices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                { id: 'card', name: 'Carte', icon: CreditCard, subtitle: 'Visa / MasterCard' },
                { id: 'mobile_money', name: 'M-Money', icon: Smartphone, subtitle: 'Orange / MTN / Wave' },
                { id: 'paypal', name: 'PayPal', icon: Wallet, subtitle: 'Portefeuille' },
                { id: 'apple_pay', name: 'Apple Pay', icon: Landmark, subtitle: 'Instantané' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMethod(opt.id as PaymentMethodType);
                    setShowOtp(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 border text-center transition-all cursor-pointer ${
                    method === opt.id 
                      ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]' 
                      : 'border-zinc-900 bg-zinc-950/30 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <opt.icon className="h-5 w-5 mb-1.5" />
                  <span className="text-[10px] font-bold block">{opt.name}</span>
                  <span className="text-[8px] text-zinc-500 font-mono block mt-0.5 leading-none">{opt.subtitle}</span>
                </button>
              ))}
            </div>

            {/* Conditional Input Forms based on method */}
            {method === 'card' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">Numéro de Carte Bancaire</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-700 focus:border-[#d4af37]/75 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">Date d'Expiration</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/AA"
                      className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-[#d4af37]/75 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">Cryptogramme (CVV)</label>
                    <input
                      type="password"
                      maxLength={3}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-[#d4af37]/75 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">Nom du Titulaire de la Carte</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Ex. Silas Augustin"
                    className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-[#d4af37]/75 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === 'mobile_money' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">Opérateur de Réseau</label>
                    <select
                      value={operator}
                      onChange={(e) => {
                        setOperator(e.target.value);
                        setShowOtp(false);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs text-white focus:border-[#d4af37]/75 focus:outline-none rounded-none cursor-pointer"
                    >
                      <option value="orange">Orange Money</option>
                      <option value="mtn">MTN MoMo</option>
                      <option value="wave">Wave Mobile</option>
                      <option value="airtel">Airtel Money</option>
                      <option value="moov">Moov Flooz</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">Numéro de Compte Associé</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+225 07 01 02 03"
                      className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-[#d4af37]/75 focus:outline-none"
                    />
                  </div>
                </div>

                {showOtp ? (
                  <div className="bg-[#d4af37]/2 border border-[#d4af37]/20 p-4 space-y-3.5 animate-fade-in">
                    <div className="flex gap-2 text-[10px] text-[#d4af37] font-mono leading-relaxed uppercase">
                      <Info className="h-4 w-4 shrink-0" />
                      <span>Code d'autorisation de débit requis !</span>
                    </div>
                    <p className="text-zinc-400 text-[10px] leading-relaxed">
                      Saisissez le code d'autorisation reçu sur votre téléphone ou généré par votre menu USSD sécurisé (ex. Orange Money *144*82#) pour certifier le retrait.
                    </p>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Saisir le Code OTP à 6 chiffres"
                      className="w-full text-center bg-zinc-950 border border-[#d4af37]/40 px-3.5 py-3 tracking-[0.4em] font-mono font-bold text-[#faf6f0] text-sm focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500 leading-normal bg-zinc-950 p-3 border border-zinc-900 italic">
                    Note de l'Opérateur : Nous allons envoyer une notification de retrait automatique sur votre numéro mobile après votre confirmation d'initialisation.
                  </p>
                )}
              </div>
            )}

            {(method === 'paypal' || method === 'apple_pay') && (
              <div className="border border-dashed border-zinc-850 p-8 text-center space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-zinc-950 text-[#d4af37] rounded-full border border-zinc-900">
                  <Wallet className="h-5 w-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold text-zinc-300">Portefeuille Électronique Sélectionné</p>
                  <p className="text-[11px] text-zinc-500">
                    {method === 'paypal' 
                      ? 'Compte authentifié avec : ' + (profile.email || 'votre adresse email') 
                      : 'Authentification biométrique via Apple ID FaceID'}
                  </p>
                </div>
              </div>
            )}

            {/* Informational reassurance */}
            <div className="flex items-center gap-2.5 bg-zinc-950 text-zinc-400 text-[10px] px-3.5 py-2.5 border border-zinc-900">
              <ShieldCheck className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
              <span>
                Transaction cryptée en TLS 1.3 de niveau joaillerie avec garantie d'assurance transport.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-[#faf6f0] text-black text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-[#d4af37] disabled:bg-zinc-800 disabled:text-zinc-650 transition-colors cursor-pointer"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Sécurisation bancaire en cours...
                </span>
              ) : method === 'mobile_money' && !showOtp ? (
                <>
                  Initialiser le Débit Mobile Money
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                'Confirmer l\'Acquisition Précieuse'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
