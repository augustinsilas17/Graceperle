import React from 'react';
import { Eye, Heart, ShoppingBag, Star, ArrowRightLeft } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToWishlist: (product: Product, e: React.MouseEvent) => void;
  isInWishlist: boolean;
  onAddToCart: (productId: string) => void;
  onToggleCompare: (product: Product) => void;
  isInCompare: boolean;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToWishlist,
  isInWishlist,
  onAddToCart,
  onToggleCompare,
  isInCompare
}: ProductCardProps) {
  
  const getBadgeText = (status: string) => {
    switch (status) {
      case 'piece_unique':
        return 'Pièce Unique';
      case 'edition_limitee':
        return 'Édition Limitée';
      default:
        return 'Disponible';
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'piece_unique':
        return 'bg-amber-950/60 text-[#d4af37] border-amber-800/40';
      case 'edition_limitee':
        return 'bg-zinc-900 text-zinc-300 border-zinc-800';
      default:
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'freshwater':
        return 'Perles d\'Eau Douce';
      case 'saltwater':
        return 'Perles de Mer';
      case 'gemstone':
        return 'Pierres Fines';
      case 'crafting':
        return 'Kits & Fournitures';
      default:
        return cat;
    }
  };

  return (
    <div 
      className="group relative flex flex-col bg-zinc-950/40 border border-zinc-900 transition-all duration-500 hover:-translate-y-2.5 hover:border-[#d4af37]/90 hover:bg-zinc-950/90 hover:shadow-[0_24px_50px_rgba(212,175,55,0.06)]"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-900/50">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => onAddToWishlist(product, e)}
          className={`absolute top-4 right-4 flex h-9.5 w-9.5 items-center justify-center rounded-full border border-zinc-805 backdrop-blur-md transition-all ${
            isInWishlist 
              ? 'bg-[#d4af37] text-black border-[#d4af37]' 
              : 'bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`h-4.5 w-4.5 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          className={`absolute top-15 right-4 flex h-9.5 w-9.5 items-center justify-center rounded-full border border-zinc-805 backdrop-blur-md transition-all ${
            isInCompare 
              ? 'bg-[#d4af37] text-black border-[#d4af37]' 
              : 'bg-black/40 text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/50'
          }`}
          title={isInCompare ? 'Retirer du comparateur' : 'Ajouter au comparateur (max 3)'}
          aria-label="Comparer ce bijou"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        {/* Top left category badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-[2px] ${getBadgeStyle(product.stockStatus)}`}>
            {getBadgeText(product.stockStatus)}
          </span>
        </div>

        {/* Hover Overlay Action */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center gap-2 bg-[#f5f2ed] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            Découvrir
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            className="flex items-center gap-2 border border-[#d4af37] bg-[#d4af37] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            En Panier
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            {getCategoryLabel(product.category)}
          </span>
          <span className="text-xs font-mono text-zinc-500">
            Artisan: {product.artisan.split(' ')[0]}
          </span>
        </div>
        
        <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#d4af37] transition-colors mb-2 text-left">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-3 text-left">
          <div className="flex text-[#d4af37]">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 font-bold">{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
          <span className="text-[11px] font-mono text-zinc-600">| de l'Atelier</span>
        </div>

        <p className="line-clamp-2 text-xs text-zinc-400 leading-relaxed flex-1 mb-4 text-left">
          {product.description}
        </p>

        {/* Price & Primary CTA */}
        <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-auto">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium font-mono">Estimation</span>
            <span className="font-serif text-lg font-medium text-[#f5f2ed]">{product.price} €</span>
          </div>
          <button
            onClick={() => onViewDetails(product)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors"
          >
            Voir Création →
          </button>
        </div>
      </div>
    </div>
  );
}
