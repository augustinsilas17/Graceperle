import React, { useState, useRef } from 'react';
import { ShieldCheck, Award, Eye, Heart, Sparkles, Scale, RefreshCw, Star, Info, Play, Pause, FileCheck } from 'lucide-react';

interface CharterItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  content: string;
  commitments: string[];
  videoUrl: string;
  badge: string;
}

export default function CharteSection() {
  const [activeTab, setActiveTab] = useState<string>('ethique');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const CHARTER_ITEMS: CharterItem[] = [
    {
      id: 'ethique',
      title: "Charte Éthique & Gemmes Certifiées",
      subtitle: "Un sourcing d'or marin sans concession",
      icon: ShieldCheck,
      badge: "Sourcing Vérifié",
      content: "Chaque perle de culture de l'Atelier Aurum provient de goulots maritimes éco-surveillés en Polynésie (Tahiti) et en Mer de Chine. Nos gemmes brutes et minéraux (Jade, Pierre de Soleil, Lapis-Lazuli) ne subissent aucun traitement chimique dénaturant afin de préserver l'intégrité de leurs nuances chromatiques originelles.",
      commitments: [
        "Certification gemmologique officielle globale fournie.",
        "Collaboration exclusive avec des fermes perlières durables.",
        "Restauration active des récifs coralliens partenaires."
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particles-looping-background-40082-large.mp4"
    },
    {
      id: 'excellence',
      title: "Charte de l'Excellence Méticuleuse",
      subtitle: "Un double nœud de soie entre chaque perle",
      icon: Award,
      badge: "Artisanat d'Art",
      content: "La haute parure exige la rigueur. Le tissage de nos sautoirs et créoles s'effectue intégralement à la main à Paris Vendôme. Nous utilisons le rituel traditionnel de l'enfilage sur double fil de soie naturelle avec nœud de sécurité individuel entre chaque perle. Ainsi, le bijou ne frotte jamais contre lui-même et conserve une souplesse impériale au porter.",
      commitments: [
        "100% fabriqué main à Paris (sans thermo-soudage).",
        "Ajustement dimensionnel sur-mesure inclus à la demande.",
        "Double fil de soie naturelle et fermoirs d'un lustre infini."
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bright-gold-glitter-dust-looping-background-40078-large.mp4"
    },
    {
      id: 'durabilite',
      title: "Charte Solaire & Transparence Éco",
      subtitle: "Des métaux recyclés et un écrin éco-responsable",
      icon: FileCheck,
      badge: "Zéro Plastique",
      content: "Notre maison s'oppose aux dérives de l'industrialisation rapide. Tous nos fermoirs exclusifs et apprêts métalliques sont moulés à partir de laiton ou d'argent recyclé de haute pureté, puis plaqués à l'Or Fin 24k ou 18k (3 microns d'épaisseur certifiés). Nos parures sont enveloppées dans des pochettes en lin filé bio pour rejeter toute matière synthétique.",
      commitments: [
        "Métaux 100% anallergiques et recyclés.",
        "Emballages écrins d'art biodégradables en fibre de lin.",
        "Bilan carbone de fabrication localisé et neutre."
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-golden-shining-star-dust-on-black-background-40076-large.mp4"
    },
    {
      id: 'conciergerie',
      title: "Charte Confiance & Restauration à Vie",
      subtitle: "Une promesse de longévité intergénérationnelle",
      icon: RefreshCw,
      badge: "Garantie à Vie",
      content: "Un bijou Aurum Beads est né pour être légué de génération en génération. L'Atelier offre une révision annuelle gratuite de votre pièce de joaillerie (nettoyage micro-ultrasons de la nacre, vérification des tensions de fil et polissage des fermoirs). Vos questions sont résolues en moins de 2 heures par notre service privé de Conciergerie.",
      commitments: [
        "Rethreading (enfilage) gratuit les deux premières années.",
        "Polissage d'éclat périodique sans supplément.",
        "Assistance Hotline VIP & Conciergerie 24/7 intégrée."
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-liquid-gold-swirling-background-40084-large.mp4"
    }
  ];

  const togglePlay = () => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.pause();
      } else {
        videoPlayerRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsPlaying(true);
    // Restart video playback
    setTimeout(() => {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.load();
        videoPlayerRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const activeItem = CHARTER_ITEMS.find(item => item.id === activeTab) || CHARTER_ITEMS[0];

  return (
    <section id="charte-atelier" className="scroll-mt-20 border-t border-b border-zinc-900 bg-[#070707] py-24 px-6 md:px-12 relative overflow-hidden">
      
      {/* Absolute ambient backgrounds for prestige feel */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-[#d4af37]/3 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-amber-950/4 blur-[130px]" />

      <div className="mx-auto max-w-7xl">
        
        {/* Header Block of Charter section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 text-left">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-[1.5px] w-6 bg-[#d4af37]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-semibold">Garanties & Engagements</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-light italic leading-tight text-white">
              La Charte d’Éthique Aurum
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed font-light">
              Notre charte de confiance et de traçabilité vous garantit une joaillerie d'exception, authentique, éco-responsable et garantie pour des générations.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-900 text-[9px] uppercase tracking-wider font-mono text-[#d4af37] font-semibold">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Savoir-Faire Certifié Or & Perles
            </span>
          </div>
        </div>

        {/* Core Modular Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* LEFT COLUMN: Vertical Accordion selectors */}
          <div className="lg:col-span-6 space-y-4 text-left flex flex-col justify-center">
            {CHARTER_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full p-5 border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'border-[#d4af37] bg-gradient-to-r from-zinc-950/90 to-zinc-950/45 shadow-xl'
                      : 'border-zinc-900/80 bg-zinc-950/25 text-zinc-400 hover:border-zinc-800 hover:text-white'
                  }`}
                >
                  {/* Active Golden left lining */}
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#d4af37]" />
                  )}

                  {/* Corner Accent Glow */}
                  <div className={`absolute top-0 right-0 h-10 w-20 bg-gradient-to-bl from-[#d4af37]/5 to-transparent pointer-events-none transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`} />

                  <div className="flex items-start gap-4">
                    {/* Icon Box */}
                    <div className={`p-2.5 border transition-colors ${
                      isSelected
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/45 text-[#d4af37]'
                        : 'bg-zinc-900 border-zinc-850 text-zinc-500 group-hover:text-zinc-200'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text Title */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono uppercase tracking-widest font-bold px-1.5 py-0.5 ${
                          isSelected
                            ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/20'
                            : 'bg-zinc-900 text-zinc-600'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className={`font-serif text-lg ${isSelected ? 'text-white font-medium' : 'text-zinc-300'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-sans tracking-wide">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Big Interactive Glass details window with animated video loop */}
          <div className="lg:col-span-6 flex flex-col">
            
            <div className="flex-1 bg-zinc-950 border border-zinc-900 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-left shadow-2xl">
              
              {/* Dynamic Animated High-End Loop Background Video backdrop for active element */}
              <div className="absolute inset-0 -z-10 bg-zinc-950 overflow-hidden opacity-[0.20] mix-blend-screen">
                <video
                  ref={videoPlayerRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover scale-102 filter sepia brightness-50"
                  src={activeItem.videoUrl}
                />
              </div>
              
              {/* Frame Accent lines */}
              <div className="absolute bottom-4 right-4 h-12 w-12 border-r border-b border-[#d4af37]/35 pointer-events-none" />
              <div className="absolute top-4 left-4 h-12 w-12 border-l border-t border-zinc-800 pointer-events-none" />

              {/* Detail Content Block */}
              <div className="space-y-6">
                
                {/* Active category logo badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <Sparkles className="h-4.5 w-4.5 animate-spin-slow" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em] font-mono">
                      {activeItem.id === 'ethique' ? 'TRAÇABILITÉ' : activeItem.id === 'excellence' ? 'ATELIER VENDÔME' : activeItem.id === 'durabilite' ? 'DURABILITÉ' : 'SERVICE CONCIERGE'}
                    </span>
                  </div>
                  
                  {/* Pause/Play controller for cinematic demo */}
                  <button
                    onClick={togglePlay}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors focus:outline-none cursor-pointer"
                    title={isPlaying ? "Mettre en sourdine l'animation" : "Lancer l'animation"}
                  >
                    {isPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5 fill-current" />}
                  </button>
                </div>

                {/* Main description of selected rule */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif text-2xl md:text-3xl italic text-white leading-snug">
                    {activeItem.title}
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed font-sans mt-2">
                    {activeItem.content}
                  </p>
                </div>

                {/* Verified Bullet checkmarks */}
                <div className="space-y-3.5 border-t border-zinc-900 pt-5">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
                    Nos engagements contractuels :
                  </span>
                  
                  <div className="space-y-2.5">
                    {activeItem.commitments.map((commit, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-950/50 border border-emerald-900/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-xs text-zinc-400 font-sans leading-relaxed">
                          {commit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sourcing stamp sticker */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-900">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-zinc-600" />
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                    Signature Authentique • Aurum Beads
                  </span>
                </div>
                <div className="text-[9px] font-mono text-[#d4af37] font-bold">
                  SÉCURITÉ GARANTIE 100%
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Interactive horizontal mini statistics under charter to demonstrate scale */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-zinc-900">
          <div className="text-center p-4 bg-zinc-950/20 border border-zinc-900/50">
            <span className="block font-serif text-2xl md:text-3xl font-light text-[#d4af37]">100 %</span>
            <span className="text-[8.5px] uppercase tracking-widest text-zinc-500 block mt-1">Perles d'origine certifiée</span>
          </div>
          <div className="text-center p-4 bg-zinc-950/20 border border-zinc-900/50">
            <span className="block font-serif text-2xl md:text-3xl font-light text-white">48 h</span>
            <span className="text-[8.5px] uppercase tracking-widest text-zinc-500 block mt-1">Maximum de réponse d'art</span>
          </div>
          <div className="text-center p-4 bg-zinc-950/20 border border-zinc-900/50">
            <span className="block font-serif text-2xl md:text-3xl font-light text-[#d4af37]">24 K</span>
            <span className="text-[8.5px] uppercase tracking-widest text-zinc-500 block mt-1">Or fin garanti d'apprêt</span>
          </div>
          <div className="text-center p-4 bg-zinc-950/20 border border-zinc-900/50">
            <span className="block font-serif text-2xl md:text-3xl font-light text-white">À Vie</span>
            <span className="text-[8.5px] uppercase tracking-widest text-zinc-500 block mt-1">Garantie d'enfilage & nacre</span>
          </div>
        </div>

      </div>
    </section>
  );
}
