import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Inquiry } from '../types';

interface ContactSectionProps {
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
}

export default function ContactSection({ onAddInquiry }: ContactSectionProps) {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('commission');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    onAddInquiry({
      name,
      email,
      phone,
      type: 'general',
      message: `${subject.toUpperCase()} - ${message}`
    });

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4500);
  };

  return (
    <section id="contact" className="scroll-mt-20 py-24 px-6 md:px-12 bg-[#090909] border-t border-zinc-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Studio Coordinates (5 cols) */}
          <div className="lg:col-span-5 text-left space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">Prendre Contact</span>
              <h2 className="font-serif text-3xl md:text-5xl italic text-white leading-tight">L'Atelier Privé</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Notre showroom parisien vous accueille exclusivement sur rendez-vous pour concevoir ensemble la parure ou l'accessoire en perles sur mesure de vos rêves.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center bg-zinc-950 border border-zinc-900 text-[#d4af37] shrink-0 mt-0.5">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Adresse du Showroom</h4>
                  <p className="text-xs text-zinc-300 mt-1">12 Place Vendôme, 75001 Paris, France</p>
                  <span className="text-[10px] font-mono text-zinc-600 mt-1 inline-block">• Métro Opéra / Concorde</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center bg-zinc-950 border border-zinc-900 text-[#d4af37] shrink-0 mt-0.5">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Ligne Conciergerie</h4>
                  <p className="text-xs text-zinc-300 mt-1">+33 1 45 61 78 90</p>
                  <span className="text-[10px] font-mono text-zinc-600 mt-1 inline-block">• Du lundi au samedi de 10h à 19h</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center bg-zinc-950 border border-zinc-900 text-[#d4af37] shrink-0 mt-0.5">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Courriel de l'Atelier</h4>
                  <p className="text-xs text-zinc-300 mt-1">concierge@aurumbeads.fr</p>
                  <span className="text-[10px] font-mono text-zinc-600 mt-1 inline-block">• Réponse sous 12 heures assurée</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center bg-zinc-950 border border-zinc-900 text-[#d4af37] shrink-0 mt-0.5">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Rendez-vous Découverte</h4>
                  <p className="text-xs text-zinc-300 mt-1">Planifiez une visite privée de l'atelier pour voir nos tiroirs de gemmes.</p>
                </div>
              </div>

            </div>

            {/* Quality seal */}
            <div className="border border-dashed border-zinc-850 p-6 space-y-3 bg-[#0a0a0a]/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#d4af37]" />
                <h5 className="font-serif text-sm italic text-white">Créations Uniques Garanties</h5>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Chaque pièce commandée sur mesure fait l'objet d'un dessin d'art aquarelle préalable. Nous ne démarrons le tissage de vos perles qu'après votre validation formelle du modèle 3D ou dessiné.
              </p>
            </div>
          </div>

          {/* Right Column: High-end Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950/80 border border-zinc-900 p-8 sm:p-10 space-y-6">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <h3 className="font-serif text-xl italic text-white">Demande de Commission Privée</h3>
              </div>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Utilisez ce formulaire pour initier un projet de bijou unique, acquérir un sac spécifique exposé ou planifier un rendez-vous showroom à Paris.
              </p>
            </div>

            {formSent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-[#0e0e0e]/50 border border-emerald-900/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mb-3">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-base text-zinc-200">Demande Enregistrée avec Succès</h4>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Merci de votre intérêt. Notre concierge-joaillier étudie votre besoin. Un accusé de réception vous a été transmis par email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Votre Nom</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Sophie Lapointe"
                      className="w-full bg-[#0d0d0d] border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Adresse Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: sophie@example.com"
                      className="w-full bg-[#0d0d0d] border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Téléphone (Optionnel)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +33 6..."
                      className="w-full bg-[#0d0d0d] border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Objet de la demande</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors h-[42px] appearance-none"
                    >
                      <option value="commission">Création sur-mesure personnalisée</option>
                      <option value="showroom">Demande de RDV Showroom (Paris)</option>
                      <option value="reservation">Achat de pièce exposée</option>
                      <option value="diy">Question sur l'Atelier DIY</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Détails de votre projet ou question</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Décrivez ici vos envies : couleurs de perles préférées, type d'accessoire, circonférence du poignet si connue..."
                    className="w-full bg-[#0d0d0d] border border-zinc-850 p-4 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest py-4 hover:opacity-90 active:scale-[0.99] transition-transform"
                >
                  <Send className="h-4 w-4" />
                  Soumettre au maître-artisan
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
