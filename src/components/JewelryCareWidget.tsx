import React, { useState, useEffect } from 'react';
import { ShieldCheck, Droplet, Sun, Wind, Sparkles, AlertTriangle, HelpCircle, ArrowRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface JewelryCareWidgetProps {
  product: Product;
}

type CareCategory = 'freshwater' | 'saltwater' | 'gemstone' | 'general';

interface CareGuide {
  title: string;
  subtitle: string;
  vulnerability: number; // 1-100
  vulnLevel: 'Faible' | 'Modérée' | 'Élevée' | 'Critique';
  description: string;
  steps: {
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
  warnings: string[];
  tips: string;
}

const CARE_GUIDES: Record<CareCategory, CareGuide> = {
  freshwater: {
    title: "Perles d'Eau Douce",
    subtitle: "Nacre tendre & Vivante",
    vulnerability: 65,
    vulnLevel: "Élevée",
    description: "Les perles d'eau douce sont des gemmes organiques créées par des moules d'eau douce. Leur nacre est épaisse mais extrêmement sensible aux agressions acides et chimiques.",
    steps: [
      {
        icon: Droplet,
        title: "Chiffon Doux Humide",
        description: "Après chaque port, essuyez délicatement la perle avec une chamoisine très légèrement humidifiée d'eau distillée tiède (sans savon)."
      },
      {
        icon: Wind,
        title: "Séchage à Plat",
        description: "Laissez sécher totalement le fil de soie à plat sur une serviette douce à température ambiante avant de ranger."
      },
      {
        icon: ShieldCheck,
        title: "L'art du Porté Élastique",
        description: "Mettez vos perles en dernier (après parfum, laque et cosmétiques) et retirez-les en premier."
      }
    ],
    warnings: [
      "Ne jamais vaporiser de parfum, déodorant ou produits capillaires directement sur le bijou.",
      "Évitez l'eau chlorée de piscine, l'eau salée de mer et la transpiration excessive lors des séances de sport.",
      "Ne jamais utiliser de nettoyeurs à ultrasons ou de produits acides ménagers (vinaigre, citron)."
    ],
    tips: "Portez-les souvent ! L'hydratation naturelle de votre peau préserve le lustre et l'orient de la nacre d'eau douce."
  },
  saltwater: {
    title: "Perles d'Eau Salée (Akoya & Tahiti)",
    subtitle: "Lustre d'Orient Absolu",
    vulnerability: 75,
    vulnLevel: "Élevée",
    description: "Les perles de Tahiti et Akoya possèdent un orient spectaculaire mais une couche de nacre plus fine sur noyau. Elles réclament un soin d'orfèvre constant.",
    steps: [
      {
        icon: Droplet,
        title: "Rituel de Pureté",
        description: "Utilisez une peau de chamois pure et sèche pour lustrer délicatement chaque perle afin de retirer le sébum naturel."
      },
      {
        icon: Sun,
        title: "Éviter les Chocs Lumineux",
        description: "Ne laissez jamais exposées en plein soleil prolongé ou dans un coffre hermétique trop sec qui pourrait déshydrater la perle."
      },
      {
        icon: ShieldCheck,
        title: "Écrin Individuel",
        description: "Rangez votre bijou d'eau salée dans sa pochette en suédine d'origine pour éviter les rayures au contact d'autres métaux."
      }
    ],
    warnings: [
      "Sensibilité absolue aux acides cosmétiques : appliquez huiles et crème 10 minutes avant de porter.",
      "Ne jamais immerger longuement dans l'eau. Risque majeur de desserrement des nœuds de double fil de soie.",
      "Évitez de superposer ou frotter contre des chaînes en or dur ou diamant."
    ],
    tips: "Le fil de soie de nos sautoirs de Tahiti doit être ré-enfilé par notre Atelier tous les 2 à 3 ans selon l'usage."
  },
  gemstone: {
    title: "Minéraux & Cabochons Précieux",
    subtitle: "Éclat Indigo & Énergie Solaire",
    vulnerability: 45,
    vulnLevel: "Modérée",
    description: "Le Lapis-Lazuli, la Pierre de soleil et le Jade sauvage sont solides mais sensibles aux détergents et variations thermiques brusques.",
    steps: [
      {
        icon: Droplet,
        title: "Nettoyage Purifiant",
        description: "Eau tiède distillée avec une goutte de savon au pH neutre. Brossez très doucement avec une brosse à poils extra-souples."
      },
      {
        icon: Sun,
        title: "Lumière Douce",
        description: "Protégez de la lumière UV excessive pour préserver l'intensité magnétique du Lapis-lazuli et de la pierre de soleil."
      },
      {
        icon: ShieldCheck,
        title: "Protection Anti-Choc",
        description: "Bien que ces gemmes soient minérales, évitez les chocs contre le marbre ou le verre lors du port."
      }
    ],
    warnings: [
      "Le Lapis-lazuli est poreux : l'immersion prolongée ou l'exposition aux huiles grasses peut altérer son bleu royal intense.",
      "Bannir absolument les alcools et solvants dissolvants de vernis à ongles à proximité du bijou.",
      "Évitez les solvants à ultrasons qui risquent de fracturer les micro-inclusions naturelles des minéraux."
    ],
    tips: "Une goutte d'huile de jojoba sur un coton de temps en temps redonne un poli étincelant à vos cabochons de Jade."
  },
  general: {
    title: "Métaux Précieux & Apprêts Or",
    subtitle: "Éclat Éternel 18 Carats",
    vulnerability: 30,
    vulnLevel: "Faible",
    description: "L'Or fin, les fermoirs bouée et les apprêts en argent de l'Atelier sont façonnés pour la haute résistance et la splendeur durable.",
    steps: [
      {
        icon: Droplet,
        title: "Lustrage au Chiffon Or",
        description: "Frottez délicatement avec une chamoisine imprégnée spéciale or de notre Atelier pour redonner la brillance dorée d'origine."
      },
      {
        icon: Sparkles,
        title: "Vérification des Ressorts",
        description: "Inspectez régulièrement le ressort de nos fermoirs bouée 18k pour assurer un verrouillage sécurisé."
      },
      {
        icon: ShieldCheck,
        title: "Stockage Hermétique",
        description: "Conservez à l'abri de l'humidité stagnante pour prémunir les infimes parties en argent de toute oxydation naturelle."
      }
    ],
    warnings: [
      "Attention aux produits chimiques chlorés (piscines, désinfectants fort) qui ternissent l'éclat de l'or.",
      "Ne pas plier vigoureusement les fils à mémoire de forme de nos bracelets.",
      "Bannir l'utilisation d'éponges abrasives vertes qui rayeraient le poli miroir."
    ],
    tips: "L'or de nos fermoirs est recyclable à l'infini et ne perd jamais sa noblesse au fil du temps."
  }
};

export default function JewelryCareWidget({ product }: JewelryCareWidgetProps) {
  // Determine default care category based on product category
  let defaultCat: CareCategory = 'general';
  if (product.category === 'freshwater') defaultCat = 'freshwater';
  else if (product.category === 'saltwater') defaultCat = 'saltwater';
  else if (product.category === 'gemstone') defaultCat = 'gemstone';
  else if (product.category === 'crafting') defaultCat = 'general';

  const [activeCategory, setActiveCategory] = useState<CareCategory>(defaultCat);
  const currentGuide = CARE_GUIDES[activeCategory];

  // Simulator / Fragility calculator states
  const [hasPerfume, setHasPerfume] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [hasSweat, setHasSweat] = useState(false);
  const [hasSun, setHasSun] = useState(false);
  const [hazardScore, setHazardScore] = useState(0);

  // Recalculate dynamic hazard score on scenario change
  useEffect(() => {
    let score = currentGuide.vulnerability;
    let multipliers = 1;

    if (hasPerfume) {
      multipliers += 0.35; // perfume is very acidic
    }
    if (hasWater) {
      multipliers += 0.25; // water loosens silk/nacre
    }
    if (hasSweat) {
      multipliers += 0.20; // sweat has salt and pH modifications
    }
    if (hasSun) {
      multipliers += 0.15; // UV dehydrates pearls
    }

    const calculated = Math.min(100, Math.round(score * multipliers));
    setHazardScore(calculated);
  }, [hasPerfume, hasWater, hasSweat, hasSun, activeCategory]);

  const getHazardColorAndLabel = (score: number) => {
    if (score < 40) return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Sécurisé ✦ Éclat Durable' };
    if (score < 65) return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Vulnérabilité Modérée ⚠️ Prudence' };
    if (score < 85) return { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', label: 'Risque d\'Altération Élevé ❌ Éviter' };
    return { color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Danger Critique de Ternissement 🚨 Interdit' };
  };

  const currentHazard = getHazardColorAndLabel(hazardScore);

  // Quick Interactive ritual step index
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  return (
    <div 
      className="bg-black/45 border border-zinc-900 rounded-sm p-5 space-y-6 text-left"
      id="jewelry-care-interactive-module"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#d4af37] uppercase block font-bold">
            Concierge d'Atelier
          </span>
          <h4 className="font-serif text-base text-[#faf6f0] font-light flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-[#d4af37] shrink-0 fill-[#d4af37]/20" />
            Entretien & Longévité du Bijou
          </h4>
        </div>
        <span className="text-[8px] font-mono text-zinc-550 border border-zinc-900 px-2 py-0.5 uppercase tracking-wider">
          Auto-détecté : {CARE_GUIDES[defaultCat].title}
        </span>
      </div>

      {/* Dynamic Tab selection system */}
      <div className="grid grid-cols-4 gap-1 border-b border-zinc-950 pb-1">
        {(Object.keys(CARE_GUIDES) as CareCategory[]).map((catKey) => {
          const guide = CARE_GUIDES[catKey];
          const isSelected = activeCategory === catKey;
          const isDefault = defaultCat === catKey;

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => {
                setActiveCategory(catKey);
                setActiveStepIdx(0);
              }}
              className={`py-2 px-1 text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                isSelected 
                  ? 'text-[#d4af37]' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="text-[8.5px] font-mono font-bold leading-tight uppercase block text-center truncate w-full">
                {guide.title.split(' ')[0]}
              </span>
              {isDefault && (
                <span className="absolute -top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#d4af37]" title="Catégorie de ce bijou" />
              )}
              {isSelected && (
                <motion.div 
                  layoutId="activeCareTabLine" 
                  className="absolute bottom-0 inset-x-1 h-[1.5px] bg-[#d4af37]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected category overview & Vulnerability indicator */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        <div className="md:col-span-7 space-y-3.5">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-serif italic text-white font-medium">{currentGuide.title}</span>
              <span className="text-[9px] text-[#d4af37] font-mono font-bold">— {currentGuide.subtitle}</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-light leading-relaxed mt-1">
              {currentGuide.description}
            </p>
          </div>

          {/* Interactive Steps presentation */}
          <div className="bg-[#030303] border border-zinc-900 p-3 rounded-xs space-y-2.5">
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
              Le Geste Idéal en 3 Étapes
            </span>
            <div className="flex items-center gap-1.5">
              {currentGuide.steps.map((_, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setActiveStepIdx(sIdx)}
                  className={`flex-1 py-1 text-[8.5px] font-mono font-bold uppercase tracking-wider text-center border cursor-pointer transition-all ${
                    activeStepIdx === sIdx
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]' 
                      : 'border-zinc-900 text-zinc-500 hover:text-zinc-400 bg-black/40'
                  }`}
                >
                  Geste 0{sIdx + 1}
                </button>
              ))}
            </div>

            <div className="pt-1 select-text">
              <AnimatePresence mode="wait">
                {currentGuide.steps.map((st, idx) => {
                  if (activeStepIdx !== idx) return null;
                  const StepIcon = st.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-2.5 items-start"
                    >
                      <div className="h-6 w-6 shrink-0 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20 mt-0.5">
                        <StepIcon className="h-3 w-3 text-[#d4af37]" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                          {st.title}
                        </h5>
                        <p className="text-[10px] text-zinc-400 leading-normal font-light">
                          {st.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SCENARIO SIMULATOR (Right Panel) */}
        <div className="md:col-span-5 bg-zinc-950/70 border border-zinc-900 p-4 rounded-xs space-y-4">
          <div className="space-y-1">
            <h5 className="text-[9px] font-mono text-zinc-450 uppercase tracking-widest font-bold flex items-center justify-between">
              <span>Scénario d'Usage</span>
              <span className="text-[#d4af37]">Simulateur AR</span>
            </h5>
            <p className="text-[9.5px] text-zinc-500 leading-relaxed font-sans">
              Sélectionnez vos habitudes pour tester l'impact sur le lustre de la perle :
            </p>
          </div>

          {/* Interactive Checkbox simulation items */}
          <div className="space-y-2">
            {[
              {
                id: 'use-perfume',
                label: 'Parfum vaporisé à proximité',
                desc: 'Alcools & distillats d\'essences',
                state: hasPerfume,
                setter: setHasPerfume,
                icon: AlertTriangle
              },
              {
                id: 'use-pool',
                label: 'Eau du bain, piscine ou mer',
                desc: 'Chlore, calcaires & sels corrosifs',
                state: hasWater,
                setter: setHasWater,
                icon: AlertTriangle
              },
              {
                id: 'use-sweat',
                label: 'Activité sportive intense / Chaleur',
                desc: 'Ph d\'acidité de la sueur cutanée',
                state: hasSweat,
                setter: setHasSweat,
                icon: AlertTriangle
              },
              {
                id: 'use-sun',
                label: 'Exposition solaire directe prolongée',
                desc: 'Radiations UV thermiques desséchantes',
                state: hasSun,
                setter: setHasSun,
                icon: AlertTriangle
              }
            ].map((scr) => (
              <button
                key={scr.id}
                type="button"
                onClick={() => scr.setter(!scr.state)}
                className={`w-full p-2 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
                  scr.state 
                    ? 'border-red-950/50 bg-red-950/15' 
                    : 'border-zinc-900/60 bg-black/40 hover:border-zinc-800'
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <span className={`text-[9px] font-bold block transition-colors ${scr.state ? 'text-red-300' : 'text-zinc-300'}`}>
                    {scr.label}
                  </span>
                  <span className="text-[7.5px] font-mono text-zinc-550 uppercase tracking-wide block">
                    {scr.desc}
                  </span>
                </div>
                <div className={`h-4 w-4 shrink-0 rounded-xs border flex items-center justify-center transition-all ${
                  scr.state 
                    ? 'border-red-400 bg-red-500 text-black font-bold' 
                    : 'border-zinc-800 bg-zinc-950 text-transparent'
                }`}>
                  {scr.state && "!"}
                </div>
              </button>
            ))}
          </div>

          {/* SIMULATED FRAGILITY METER */}
          <div className="space-y-2 pt-1 border-t border-zinc-900/60">
            <div className="flex justify-between items-baseline">
              <span className="text-[8.5px] font-mono text-zinc-450 uppercase tracking-wider font-bold">
                Indice de Menace Estimé
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {hazardScore} <span className="text-zinc-650">/ 100</span>
              </span>
            </div>

            {/* Simulated bar progress gauge */}
            <div className="w-full h-1.5 bg-zinc-900 rounded-sm overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                initial={{ width: '0%' }}
                animate={{ width: `${hazardScore}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Warning output badge box */}
            <div className={`border p-2 rounded-xs text-[8.5px] font-mono leading-relaxed text-center ${currentHazard.color} transition-all`}>
              {currentHazard.label}
            </div>
          </div>
        </div>
      </div>

      {/* Warnings points checklist */}
      <div className="bg-zinc-950/40 border border-zinc-900/50 p-4 rounded-xs space-y-3">
        <span className="text-[8.5px] font-mono text-[#d4af37] tracking-widest uppercase font-bold flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Mises en Garde de l'Artisan Joaillier :
        </span>
        <ul className="space-y-2 text-[10px] text-zinc-450 leading-relaxed font-light select-text">
          {currentGuide.warnings.map((warn, wIdx) => (
            <li key={wIdx} className="flex gap-2 items-start">
              <span className="h-1 w-1 bg-red-500/80 rounded-full mt-1.5 shrink-0" />
              <span>{warn}</span>
            </li>
          ))}
        </ul>

        {/* Wisdom quote */}
        <div className="pt-2 border-t border-zinc-900/80 text-[10px] font-serif italic text-[#d4af37] leading-relaxed select-text">
          ✦ Note de l'Atelier : « {currentGuide.tips} »
        </div>
      </div>
    </div>
  );
}
