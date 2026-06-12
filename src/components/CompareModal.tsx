import React from 'react';
import { X, Trash2, ShoppingBag, Clock, Sparkles, Star, Award, ShieldAlert, ArrowRightLeft } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onAddToCart: (productId: string) => void;
}

export default function CompareModal({
  isOpen,
  onClose,
  selectedProducts,
  onRemoveFromCompare,
  onAddToCart
}: CompareModalProps) {
  if (!isOpen) return null;

  const maxItems = 3;
  const placeholdersCount = maxItems - selectedProducts.length;

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

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case 'piece_unique':
        return 'Pièce Unique';
      case 'edition_limitee':
        return 'Édition Limitée';
      default:
        return 'Disponible';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-6 backdrop-blur-sm animate-fade-in"
      id="compare-modal-[#compare-modal-window]"
    >
      <div className="relative w-full max-w-6xl bg-[#090909] border border-zinc-850 rounded-sm shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-900 bg-[#0c0c0c]">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4.5 w-4.5 text-[#d4af37]" />
              <h2 className="font-serif text-xl md:text-2xl font-light text-white italic">
                Comparateur de Haute Joaillerie
              </h2>
            </div>
            <p className="text-[10px] md:text-xs text-zinc-500 font-mono">
              COMPARAISON CÔTE À CÔTE DE NOS PIÈCES D'ART ({selectedProducts.length} sur {maxItems} sélectionnées)
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-2 border border-zinc-900 hover:border-zinc-800 bg-[#070707] rounded-full cursor-pointer"
            aria-label="Fermer la comparaison"
            id="close-compare-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Table Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-850">
          {selectedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-6">
              <div className="h-16 w-16 bg-zinc-950 border border-zinc-90 w-full rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
                <ArrowRightLeft className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-white italic">Aucune création sélectionnée</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Parcourez notre vitrine de pièces uniques et de perles de culture, puis cliquez sur le petit bouton de comparaison (double flèche) pour les comparer ici.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#0f0f0f] border border-[#d4af37]/50 hover:border-[#d4af37] text-[#d4af37] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-[1px] hover:text-white cursor-pointer"
              >
                Parcourir la vitrine d'Or
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Product Columns */}
              {selectedProducts.map((product) => (
                <div 
                  key={`compare-col-${product.id}`}
                  className="bg-[#050505] border border-zinc-900 hover:border-[#d4af37]/20 p-5 rounded-sm flex flex-col justify-between transition-colors relative"
                >
                  {/* Remove Button inside Card */}
                  <button
                    onClick={() => onRemoveFromCompare(product)}
                    className="absolute top-4 right-4 bg-black/80 hover:bg-red-950 border border-zinc-850 hover:border-red-900 transition-colors h-7.5 w-7.5 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-400 z-10 cursor-pointer"
                    title="Retirer de la comparaison"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="space-y-5">
                    {/* Visual Media & Title */}
                    <div className="space-y-3">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 rounded-sm border border-zinc-900 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 border border-zinc-800 text-[8px] font-mono tracking-widest text-[#d4af37] uppercase">
                          {product.id.startsWith('fw') ? 'EAU DOUCE' : product.id.startsWith('sw') ? 'SALT' : 'GEMME'}
                        </div>
                      </div>

                      <div className="text-left space-y-1">
                        <span className="text-[9px] font-mono tracking-[0.2em] text-[#d4af37] uppercase block">
                          {getCategoryLabel(product.category)}
                        </span>
                        <h4 className="font-serif text-base text-zinc-100 font-normal line-clamp-1">
                          {product.name}
                        </h4>
                      </div>
                    </div>

                    {/* Attribute Section: Price */}
                    <div className="border-t border-zinc-900 pt-3 text-left">
                      <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-1">
                        Estimation de valeur
                      </span>
                      <p className="font-serif text-lg text-white font-medium flex items-baseline gap-1">
                        <span className="text-[#d4af37]">{product.price} €</span>
                        <span className="text-[10px] text-zinc-650 font-sans italic font-normal">TVA incluse</span>
                      </p>
                    </div>

                    {/* Attribute Section: Materials */}
                    <div className="border-t border-zinc-900 pt-3 text-left">
                      <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-1.5Icon flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-[#d4af37]" />
                        Matières & Composants
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.materials.map((mat, idx) => (
                          <span 
                            key={`mat-${idx}`}
                            className="bg-[#0f0f0f] border border-zinc-850 px-2 py-0.5 text-[9px] font-medium text-zinc-350 rounded-sm"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Attribute Section: Creation Time */}
                    <div className="border-t border-zinc-900 pt-3 text-left space-y-1">
                      <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block flex items-center gap-1">
                        <Clock className="h-3 w-3 text-zinc-400" />
                        Temps dévolu à l'Élite
                      </span>
                      <p className="text-xs text-zinc-300 font-mono pl-1">
                        {product.timeToCreate || "Non communiqué"}
                      </p>
                    </div>

                    {/* Attribute Section: Artisan Signature */}
                    <div className="border-t border-zinc-900 pt-3 text-left space-y-1">
                      <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block flex items-center gap-1">
                        <Award className="h-3 w-3 text-[#d4af37]" />
                        Artisan Émérite en Charge
                      </span>
                      <p className="font-serif text-xs italic text-zinc-300 pl-1">
                        {product.artisan}
                      </p>
                    </div>

                    {/* Attribute Section: Stock status & Rating */}
                    <div className="border-t border-zinc-900 pt-3 text-left grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-1">
                          Édition / Disponibilité
                        </span>
                        <span className="text-[10px] font-mono text-zinc-300 font-semibold uppercase bg-zinc-950 px-2 py-1 border border-zinc-900 inline-block rounded-xs">
                          {getStockStatusLabel(product.stockStatus)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-1">
                          Appréciation Client
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-[#d4af37]">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-mono font-bold text-zinc-300">
                            {product.rating ? product.rating.toFixed(1) : '4.8'}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specific unique features listed side by side */}
                    <div className="border-t border-zinc-900 pt-3 text-left">
                      <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-2">
                        Caractéristiques Atelier
                      </span>
                      <ul className="space-y-1.5">
                        {product.features.map((feature, idx) => (
                          <li 
                            key={`feature-${idx}`}
                            className="text-[10px] leading-relaxed text-zinc-400 pl-2.5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:bg-[#d4af37] before:rounded-full"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Add To Cart precious CTA */}
                  <div className="mt-8 pt-4 border-t border-zinc-950">
                    <button
                      onClick={() => {
                        onAddToCart(product.id);
                        onClose();
                      }}
                      className="w-full bg-[#111] hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/30 hover:border-[#d4af37] text-[#d4af37] text-[10px] font-bold uppercase tracking-widest py-3 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Acquérir ce bijou
                    </button>
                  </div>
                </div>
              ))}

              {/* Suggestions Placeholders for remaining empty comparisons */}
              {Array.from({ length: placeholdersCount }).map((_, idx) => (
                <div 
                  key={`compare-placeholder-${idx}`}
                  className="bg-zinc-950/20 border-2 border-dashed border-zinc-900 rounded-sm p-6 flex flex-col items-center justify-center min-h-[350px] text-center text-zinc-600 grayscale"
                >
                  <div className="h-12 w-12 border border-zinc-850 bg-zinc-950 text-zinc-600 flex items-center justify-center rounded-full mb-4">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-mono font-bold text-zinc-500 mb-1">
                    Emplacement {selectedProducts.length + idx + 1}
                  </p>
                  <p className="text-xs text-zinc-600 max-w-xs font-light">
                    Sélectionnez une autre parure éminente pour comparer leurs métaux et joyaux secrets.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with prestige security credentials */}
        <div className="px-6 py-4.5 bg-[#0c0c0c] border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GARANTIE DE HAUTE FAÇON ET CERTIFICAT DE SÛRETÉ PAR LES CRÉATEURS D'ART</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-850 px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-[1px]"
            >
              Fermer le comparateur
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
