import React, { useState, useEffect } from 'react';
import { X, Ruler, Scissors, Percent, HelpCircle, Check, Info, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RingSizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
  isPearlSpecific?: boolean;
}

interface SizingItem {
  eu: number;
  diameter: number; // in mm
  us: string;
  uk: string;
  circumference: number; // in mm
}

const SIZE_MAPPING: SizingItem[] = [
  { eu: 48, diameter: 15.28, us: '4.5', uk: 'I 1/2', circumference: 48 },
  { eu: 50, diameter: 15.92, us: '5.25', uk: 'K', circumference: 50 },
  { eu: 52, diameter: 16.56, us: '6.0', uk: 'L 1/2', circumference: 52 },
  { eu: 54, diameter: 17.20, us: '6.75', uk: 'N', circumference: 54 },
  { eu: 56, diameter: 17.83, us: '7.5', uk: 'O 1/2', circumference: 56 },
  { eu: 58, diameter: 18.46, us: '8.25', uk: 'Q', circumference: 58 },
  { eu: 60, diameter: 19.10, us: '9.0', uk: 'R 1/2', circumference: 60 },
  { eu: 62, diameter: 19.74, us: '10.0', uk: 'T 1/2', circumference: 62 },
];

export default function RingSizerModal({ isOpen, onClose, onSelectSize, isPearlSpecific = true }: RingSizerModalProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'manual' | 'table'>('visual');
  
  // Tab 1: Visual Virtual Ring Diameter Adjuster
  const [stencilDiameterMm, setStencilDiameterMm] = useState<number>(16.56); // Default size 52
  const [pxPerMm, setPxPerMm] = useState<number>(3.78); // Calibrated default pixel density factor
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [cardWidthPx, setCardWidthPx] = useState(320); // Standard Credit Card width calibration
  
  // Tab 2: Manual thread/ribbon wrap entry
  const [enteredCircumference, setEnteredCircumference] = useState<number>(52);
  const [selectedMappingItem, setSelectedMappingItem] = useState<SizingItem | null>(null);

  // Auto look-up closest sizes
  useEffect(() => {
    const closest = SIZE_MAPPING.reduce((prev, curr) => {
      return (Math.abs(curr.circumference - enteredCircumference) < Math.abs(prev.circumference - enteredCircumference) ? curr : prev);
    });
    setSelectedMappingItem(closest);
  }, [enteredCircumference]);

  const handleApplySize = (sizeStr: string) => {
    if (onSelectSize) {
      onSelectSize(sizeStr);
    }
  };

  // Quick helper to fetch mapping based on closest diameter
  const getClosestFromDiameter = (diameter: number) => {
    return SIZE_MAPPING.reduce((prev, curr) => {
      return (Math.abs(curr.diameter - diameter) < Math.abs(prev.diameter - diameter) ? curr : prev);
    });
  };

  const currentClosestVisualItem = getClosestFromDiameter(stencilDiameterMm);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        id="ring-sizer-modal"
      >
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-[#090909] border border-zinc-900 rounded-[2px] shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
            <div className="space-y-0.5">
              <span className="text-[8px] font-mono tracking-[0.25em] text-[#d4af37] uppercase block font-bold">
                Maison Aurum Beads • Atelier Métrologique
              </span>
              <h3 className="font-serif text-lg text-white font-medium flex items-center gap-1.5">
                Baguier de Prestige & Convertisseur
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-zinc-500 hover:text-[#d4af37] hover:bg-zinc-950 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Luxury Tab Bar */}
          <div className="flex border-b border-zinc-900 bg-zinc-950/60 font-mono text-[9px] uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'visual'
                  ? 'border-[#d4af37] text-white bg-zinc-900/40 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Baguier Virtuel Écran
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'border-[#d4af37] text-white bg-zinc-900/40 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Mesure Papier / Ruban
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'border-[#d4af37] text-white bg-zinc-900/40 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Table des Correspondances
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

            {/* TAB 1: VISUAL MATCHER USING REAL RING ON SCREEN */}
            {activeTab === 'visual' && (
              <div className="space-y-5">
                <div className="bg-zinc-950/50 border border-zinc-900/80 p-4 rounded-sm text-center md:text-left">
                  <h4 className="text-xs font-serif text-white font-medium mb-1">
                    Option A : Calibrer & Poser une Bague sur l'Écran
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    Prenez une bague qui vous convient parfaitement. Posez-la à plat sur le cercle ci-dessous. Ajustez le curseur jusqu'à ce que la circonférence dorée épouse exactement l'intérieur de la monture de votre bague.
                  </p>
                </div>

                {/* Interactive Stencil Area */}
                <div className="relative border border-zinc-900 bg-[#050505] p-8 flex flex-col items-center justify-center min-h-[190px] rounded-[1px] group">
                  
                  {/* Circular visual ring stencil */}
                  <motion.div 
                    layout
                    className="relative flex items-center justify-center rounded-full border-[3px] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] bg-zinc-950/45"
                    style={{
                      width: `${stencilDiameterMm * pxPerMm}px`,
                      height: `${stencilDiameterMm * pxPerMm}px`,
                      transition: 'width 75s ease-out, height 75s ease-out', // smooth adjustment
                    }}
                  >
                    {/* Inner helpful measurements display inside the ring */}
                    <div className="text-center select-none pointer-events-none p-1 shrink-0">
                      <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-widest leading-none mb-0.5">Diamètre</span>
                      <span className="block text-[13px] font-mono text-[#d4af37] font-semibold leading-none">{stencilDiameterMm.toFixed(2)}<span className="text-[9px] font-normal">mm</span></span>
                    </div>

                    {/* Radial gold lines to show precious detailing */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#d4af37]/15 scale-95 pointer-events-none" />
                    <div className="absolute inset-2 rounded-full border border-zinc-900 pointer-events-none" />
                  </motion.div>

                  {/* Tiny calibration tool warning */}
                  <button 
                    onClick={() => setIsCalibrating(!isCalibrating)}
                    className="absolute bottom-2.5 right-3 text-[8px] font-mono text-zinc-500 hover:text-[#d4af37] uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-zinc-950 px-2 py-1 border border-zinc-900 rounded-sm"
                  >
                    <Info className="h-2.5 w-2.5 text-[#d4af37]" />
                    {isCalibrating ? "Cacher l'Étalonnage" : "Calibrer l'Écran"}
                  </button>
                </div>

                {/* Sizing precision controls */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold tracking-wider">
                    <span className="text-zinc-400">Ajustement du Diamètre</span>
                    <span className="text-[#d4af37] bg-[#d4af37]/5 border border-[#d4af37]/10 px-2 py-0.5 rounded-sm">
                      Détail : {stencilDiameterMm.toFixed(1)} mm
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setStencilDiameterMm(Math.max(14.0, stencilDiameterMm - 0.2))}
                      className="p-2.5 bg-zinc-900 border border-zinc-900 text-zinc-300 hover:text-[#d4af37] hover:border-[#d4af37]/40 rounded-xs transition-all active:scale-95 cursor-pointer"
                      title="Diminuer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    
                    <input
                      type="range"
                      min="14.0"
                      max="21.0"
                      step="0.05"
                      value={stencilDiameterMm}
                      onChange={(e) => setStencilDiameterMm(parseFloat(e.target.value))}
                      className="flex-1 accent-[#d4af37] bg-zinc-900 h-1.5 rounded-lg cursor-pointer"
                    />

                    <button 
                      onClick={() => setStencilDiameterMm(Math.min(21.0, stencilDiameterMm + 0.2))}
                      className="p-2.5 bg-zinc-900 border border-zinc-900 text-zinc-300 hover:text-[#d4af37] hover:border-[#d4af37]/40 rounded-xs transition-all active:scale-95 cursor-pointer"
                      title="Augmenter"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Screen calibration utility drawer */}
                {isCalibrating && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-4 border border-dashed border-zinc-800 bg-zinc-950/90 rounded-sm space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <Ruler className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider block font-bold">Étalonner la taille de votre écran</span>
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                          Pour garantir une précision micrométrique, glissez ou spécifiez les pixels de sorte à correspondre aux dimensions exactes d'une carte standard de format carte d'identité ou bancaire (85,6 mm de large).
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1 border-t border-zinc-900">
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                        <span>Largeur sur fond d'écran :</span>
                        <span>{cardWidthPx} px</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="200"
                          max="500"
                          step="1"
                          value={cardWidthPx}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCardWidthPx(val);
                            // 85.6 mm is standard credit card width
                            setPxPerMm(val / 85.6);
                          }}
                          className="flex-1 accent-[#d4af37] bg-zinc-900 h-1 rounded-xs"
                        />
                        <div 
                          className="bg-zinc-900 border border-zinc-800 h-7 rounded-xs text-[9px] font-mono flex items-center justify-center text-zinc-400 font-bold"
                          style={{ width: `${cardWidthPx / 4}px` }} // Represent 1/4 size
                        >
                          Gabarit Carte
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Selected Output Recommendation card */}
                <div className="grid grid-cols-2 gap-3.5 pt-3.5 border-t border-zinc-900/60">
                  <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-sm text-left">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block mb-0.5">Taille Française Estimée</span>
                    <span className="font-serif text-lg text-white font-medium">Grande Taille EU {currentClosestVisualItem.eu}</span>
                    <p className="text-[9px] text-zinc-400 font-mono mt-1">
                      Circonférence : ~{currentClosestVisualItem.circumference} mm
                    </p>
                  </div>
                  <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-sm text-left">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block mb-0.5">Équivalences Internationales</span>
                    <div className="grid grid-cols-2 gap-1 mt-1 text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-500 block uppercase text-[8px]">Taille US :</span>
                        <span className="text-[#d4af37] text-xs font-bold">{currentClosestVisualItem.us}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase text-[8px]">Taille UK :</span>
                        <span className="text-zinc-300 text-xs font-bold">{currentClosestVisualItem.uk}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplySize(`Taille de bague EU ${currentClosestVisualItem.eu} (${currentClosestVisualItem.diameter.toFixed(1)}mm)`)}
                    className="w-full bg-[#d4af37] text-black py-3 text-xs font-bold uppercase tracking-widest text-center hover:opacity-90 active:scale-[0.99] transition-all rounded-[1px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Sélectionner la Taille EU {currentClosestVisualItem.eu}
                  </button>
                  <p className="text-center text-[9px] text-zinc-500 font-light italic">
                    Astuce : Si vous hésitez entre deux tailles, nous recommandons de choisir la plus grande.
                  </p>
                </div>
              </div>
            )}


            {/* TAB 2: MANUAL MEASUREMENT INSTRUCTIONS & CALCULATION */}
            {activeTab === 'manual' && (
              <div className="space-y-5 text-left">
                <div className="bg-zinc-950/50 border border-zinc-900/80 p-4 rounded-sm">
                  <h4 className="text-xs font-serif text-white font-medium mb-1">
                    Option B : Calcul de Circonférence au Ruban ou au Fil
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    Enroulez un fil ou une bandelette de papier non étirable autour de la base de votre doigt. Marquez le point de jonction avec un stylo. Mesurez la longueur ainsi obtenue en millimètres avec une règle graduée.
                  </p>
                </div>

                {/* Instruction step illustrations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#050505] border border-zinc-900 rounded-sm flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-zinc-900 text-[#d4af37] font-mono text-[10px] items-center justify-center flex font-bold shrink-0">1</div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-300 block">Enrouler</span>
                      <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">Autour de l'articulation la plus forte du doigt concerné.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-[#050505] border border-zinc-900 rounded-sm flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-zinc-900 text-[#d4af37] font-mono text-[10px] items-center justify-center flex font-bold shrink-0">2</div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-300 block">Marquer</span>
                      <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">Tracez précisément un trait à la croisée des deux segments.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-[#050505] border border-zinc-900 rounded-sm flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-zinc-900 text-[#d4af37] font-mono text-[10px] items-center justify-center flex font-bold shrink-0">3</div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-300 block">Mesurer</span>
                      <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">À l'aide d'une règle (52 mm de long = taille de doigt 52).</p>
                    </div>
                  </div>
                </div>

                {/* Slider / Value entry */}
                <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-[1px] space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">
                      Spécifier la Longueur (en mm)
                    </label>
                    <span className="text-xl font-mono text-[#d4af37] font-bold">
                      {enteredCircumference} <span className="text-[11px] font-normal text-zinc-500">mm</span>
                    </span>
                  </div>

                  <input
                    type="range"
                    min="46"
                    max="64"
                    step="1"
                    value={enteredCircumference}
                    onChange={(e) => setEnteredCircumference(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37] bg-zinc-900 h-1.5 rounded-lg cursor-pointer"
                  />

                  {selectedMappingItem && (
                    <div className="border-t border-zinc-900/60 pt-4 mt-2 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Taille Recommandée</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif text-lg text-white font-bold">Bague EU {selectedMappingItem.eu}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Diamètre Intérieur</span>
                        <span className="text-zinc-300 font-mono text-sm block">~ {selectedMappingItem.diameter.toFixed(2)} mm</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply size button */}
                {selectedMappingItem && (
                  <button
                    type="button"
                    onClick={() => handleApplySize(`Taille de bague EU ${selectedMappingItem.eu} (${selectedMappingItem.diameter.toFixed(1)}mm)`)}
                    className="w-full bg-[#d4af37] text-black py-3 text-xs font-bold uppercase tracking-widest text-center hover:opacity-90 active:scale-[0.99] transition-all rounded-[1px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Utiliser la Taille EU {selectedMappingItem.eu}
                  </button>
                )}
              </div>
            )}


            {/* TAB 3: COMPLETE RECONVERSION TABLE OF MAISON AURUM */}
            {activeTab === 'table' && (
              <div className="space-y-4">
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed text-left">
                  Retrouvez ci-dessous la charte officielle des mesures de notre Atelier de Haute Joaillerie Aurum Vendôme. Elle répertorie les diamètres intérieurs comparés aux tailles internationales standard.
                </p>

                <div className="border border-zinc-900 rounded-[1px] overflow-hidden bg-[#050505]">
                  <table className="w-full border-collapse font-mono text-[10px]">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-900 text-[8px] uppercase tracking-wider text-left">
                        <th className="py-2.5 px-4 font-bold">Taille EU (Fr)</th>
                        <th className="py-2.5 px-4 font-bold text-center">Diamètre (mm)</th>
                        <th className="py-2.5 px-4 font-bold text-center">Circumf (mm)</th>
                        <th className="py-2.5 px-4 font-bold text-center">Taille US</th>
                        <th className="py-2.5 px-4 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-950 text-zinc-300">
                      {SIZE_MAPPING.map((item) => (
                        <tr key={item.eu} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-2.5 px-4 font-serif font-bold text-white text-xs">
                            EU {item.eu}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {item.diameter.toFixed(2)} mm
                          </td>
                          <td className="py-2.5 px-4 text-center text-zinc-500">
                            {item.circumference} mm
                          </td>
                          <td className="py-2.5 px-4 text-center text-[#d4af37] font-semibold">
                            {item.us}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleApplySize(`Taille de bague EU ${item.eu} (${item.diameter.toFixed(1)}mm)`)}
                              className="text-[8px] uppercase font-bold text-zinc-400 hover:text-[#d4af37] border-b border-zinc-800 hover:border-[#d4af37]/60 cursor-pointer"
                            >
                              Choisir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pearl Jewelry Specific sizing advice warning footer */}
            {isPearlSpecific && (
              <div className="bg-[#1c1605]/30 border border-[#d4af37]/15 p-3.5 space-y-2 rounded-[1px] text-left">
                <div className="flex items-center gap-1.5 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Particularité des bagues en perles et gemmes</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Nos perles de prestige étant des joyaux organiques volumineux, les montures d'art "Maison Aurum" intègrent parfois un léger dégagement intérieur pour soulager la pulpe du doigt. <strong>Si vous hésitez spécifiquement entre deux tailles, nous vous conseillons d'opter pour la dimension supérieure</strong> pour assurer un confort optimal quelles que soient les saisons.
                </p>
              </div>
            )}

          </div>

          {/* Footer informational */}
          <div className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-t border-zinc-900 text-[8px] text-zinc-500 font-mono tracking-wider uppercase">
            <span>Certifié Atelier Aurum Beads</span>
            <span>Précision micrométrique 2026</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
