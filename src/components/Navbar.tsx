import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, Sparkles, Compass, User } from 'lucide-react';
import { Product, CartItem, UserProfile } from '../types';

interface NavbarProps {
  wishlist: Product[];
  openWishlist: () => void;
  cart: CartItem[];
  openCart: () => void;
  profile: UserProfile;
  openProfile: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onDiyClick: () => void;
}

export default function Navbar({
  wishlist,
  openWishlist,
  cart,
  openCart,
  profile,
  openProfile,
  activeSection,
  setActiveSection,
  onDiyClick
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        
        {/* Left: Hamburger for mobile / Navigation for desktop */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-[#d4af37] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] md:flex">
          <button
            onClick={() => handleNavClick('vitrine')}
            className={`cursor-pointer transition-colors ${
              activeSection === 'vitrine' ? 'text-[#d4af37]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            La Vitrine
          </button>
          <button
            onClick={() => handleNavClick('artisanat')}
            className={`cursor-pointer transition-colors ${
              activeSection === 'artisanat' ? 'text-[#d4af37]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            L'Artisanat
          </button>
          <button
            onClick={() => handleNavClick('charte-atelier')}
            className={`cursor-pointer transition-colors ${
              activeSection === 'charte-atelier' ? 'text-[#d4af37]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            La Charte
          </button>
          <button
            onClick={onDiyClick}
            className="group flex cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-[#d4af37]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]/80 group-hover:text-[#d4af37]" />
            Atelier Custom DIY
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`cursor-pointer transition-colors ${
              activeSection === 'contact' ? 'text-[#d4af37]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sur Mesure
          </button>
        </nav>

        {/* Center: Brand Identity Logo */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-xl font-serif tracking-[0.25em] text-[#d4af37] md:text-2xl cursor-pointer hover:opacity-90"
          >
            AURUM BEADS
          </button>
          <span className="hidden text-[8px] uppercase tracking-[0.4em] text-zinc-500 md:inline-block">
            Artisan Joaillier de Perles
          </span>
        </div>

        {/* Right Icons: Wishlist, Cart & Profile */}
        <div className="flex items-center gap-3.5 md:gap-5">
          <button
            onClick={onDiyClick}
            className="hidden items-center gap-2 border border-zinc-800 bg-zinc-900/40 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-widest text-[#d4af37] transition-all hover:border-[#d4af37]/50 hover:bg-zinc-900 lg:flex"
          >
            <Compass className="h-3.5 w-3.5 animate-spin-slow text-[#d4af37]" />
            Créateur 3D
          </button>

          {/* Wishlist Button */}
          <button
            onClick={openWishlist}
            className="relative flex items-center justify-center p-1.5 text-zinc-350 transition-colors hover:text-[#d4af37]"
            title="Ma Vitrine d'Envies"
            aria-label="Voir les Souhaits"
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[8px] font-bold text-black ring-1 ring-[#0a0a0a]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center p-1.5 text-zinc-350 transition-colors hover:text-[#d4af37]"
            title="Mon Panier d'Achat"
            aria-label="Voir le Panier"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-extrabold text-black ring-1 ring-[#0a0a0a]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={openProfile}
            className="flex items-center gap-1.5 p-1.5 text-zinc-350 transition-colors hover:text-[#d4af37]"
            title="Mon Profil Client"
            aria-label="Editer le Profil"
          >
            <div className="relative">
              <User className="h-4.5 w-4.5" />
              {profile.name && (
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-emerald-400 rounded-full" />
              )}
            </div>
            {profile.name && (
              <span className="hidden lg:inline text-[9px] uppercase tracking-wider font-mono text-zinc-400 line-clamp-1 max-w-[80px]">
                {profile.name.split(' ')[0]}
              </span>
            )}
          </button>
          
          <div className="hidden border-l border-zinc-900 py-3 pl-4 md:block">
            <span className="rounded-sm bg-zinc-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-400 ring-1 ring-zinc-900">
              {profile.name ? 'Compte Privé' : 'Club Aurum'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-900 bg-[#0a0a0a] px-6 py-8 md:hidden">
          <nav className="flex flex-col gap-6 text-sm font-medium uppercase tracking-[0.15em] text-zinc-300">
            <button
              onClick={() => handleNavClick('vitrine')}
              className="flex items-center text-left py-1 text-zinc-400 hover:text-white"
            >
              La Vitrine des Perles
            </button>
            <button
              onClick={() => handleNavClick('artisanat')}
              className="flex items-center text-left py-1 text-zinc-400 hover:text-white"
            >
              Le Savoir-Faire Artisanal
            </button>
            <button
              onClick={() => handleNavClick('charte-atelier')}
              className="flex items-center text-left py-1 text-zinc-400 hover:text-white"
            >
              La Charte d'Atelier
            </button>
            <button
              onClick={() => {
                onDiyClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-1 text-left text-[#d4af37]"
            >
              <Sparkles className="h-4 w-4" />
              Atelier DIY Bracelet
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="flex items-center text-left py-1 text-zinc-400 hover:text-white"
            >
              Commandes sur Mesure
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
