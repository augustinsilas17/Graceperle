import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, X, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export default function ProfileModal({ profile, isOpen, onClose, onSave }: ProfileModalProps) {
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');
  const [city, setCity] = useState(profile.city || '');
  const [zipCode, setZipCode] = useState(profile.zipCode || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, phone, address, city, zipCode });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md border border-zinc-800 bg-[#0c0c0c] p-6 text-[#f5f2ed] shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-[#d4af37] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-left">
          <div className="inline-flex h-9 w-9 items-center justify-center bg-[#d4af37]/10 text-[#d4af37] rounded-sm mb-3">
            <User className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl italic text-white font-normal">Profil & Coordonnées Client</h3>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">Membres Privés de l'Atelier</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">Nom Complet / Signature</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Augustin Silas"
                className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">Adresse Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">Numéro Téléphone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 rounded-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">Adresse de Livraison Assurée</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <MapPin className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex. 14 Rue de la Paix"
                className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">Ville</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Paris"
                className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">Code Postal</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="75001"
                className="w-full bg-zinc-950 border border-zinc-850 px-3.5 py-2 text-xs text-white placeholder-zinc-650 focus:border-[#d4af37]/70 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 rounded-xs"
              />
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 leading-normal font-sans italic border-t border-zinc-900 pt-3">
            Ces informations sont conservées localement dans votre explorateur pour simplifier la facturation et l'authentification de vos devis.
          </p>

          <button
            type="submit"
            disabled={isSaved}
            className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
              isSaved 
                ? 'bg-emerald-500 text-black' 
                : 'bg-[#faf6f0] text-black hover:bg-[#d4af37]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                Coordonnées Enregistrées !
              </>
            ) : (
              'Enregistrer mon Profil'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
