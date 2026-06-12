import React, { useState, useMemo } from 'react';
import { Sparkles, Trash2, ShieldCheck, Check, Send, Plus, Minus, RotateCcw } from 'lucide-react';
import { BEAD_CATALOG, CHARM_OPTIONS } from '../data';
import { BeadOption, CharmOption, Inquiry } from '../types';

interface DiyBuilderProps {
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
}

export default function DiyBuilder({ onAddInquiry }: DiyBuilderProps) {
  // Config state
  const [baseType, setBaseType] = useState<'bracelet' | 'collier'>('bracelet');
  const [threadType, setThreadType] = useState<'gold' | 'silk' | 'macrame' | 'leather'>('gold');
  const [selectedCharmId, setSelectedCharmId] = useState<string | null>(null);
  const [length, setLength] = useState<number>(18); // default cm
  
  // Custom bead layout stack: as a sequence of bead items
  // We'll let users add beads and arrange them
  const [beadSequence, setBeadSequence] = useState<{ beadId: string; count: number }[]>([
    { beadId: 'b1', count: 4 },
    { beadId: 'b2', count: 4 },
    { beadId: 'b7', count: 3 }
  ]);

  // Quotation form
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Calculations
  const basePrice = baseType === 'bracelet' ? 30 : 50;
  
  const threadPrice = useMemo(() => {
    switch (threadType) {
      case 'gold': return 15;
      case 'silk': return 5;
      case 'macrame': return 8;
      case 'leather': return 6;
    }
  }, [threadType]);

  const charmPrice = useMemo(() => {
    if (!selectedCharmId) return 0;
    const ch = CHARM_OPTIONS.find(c => c.id === selectedCharmId);
    return ch ? ch.price : 0;
  }, [selectedCharmId]);

  const totalBeadsCount = useMemo(() => {
    return beadSequence.reduce((sum, item) => sum + item.count, 0);
  }, [beadSequence]);

  const beadsPrice = useMemo(() => {
    return beadSequence.reduce((sum, item) => {
      const bead = BEAD_CATALOG.find(b => b.id === item.beadId);
      return sum + (bead ? bead.pricePerBead * item.count : 0);
    }, 0);
  }, [beadSequence]);

  const totalPrice = useMemo(() => {
    return basePrice + threadPrice + charmPrice + beadsPrice;
  }, [basePrice, threadPrice, charmPrice, beadsPrice]);

  // Reset customizer
  const handleReset = () => {
    setBaseType('bracelet');
    setThreadType('gold');
    setSelectedCharmId(null);
    setLength(18);
    setBeadSequence([
      { beadId: 'b1', count: 4 },
      { beadId: 'b2', count: 4 },
      { beadId: 'b7', count: 3 }
    ]);
  };

  // Add/Remove count in sequence
  const handleUpdateBeadCount = (beadId: string, delta: number) => {
    const existing = beadSequence.find(item => item.beadId === beadId);
    
    if (existing) {
      const nextCount = existing.count + delta;
      if (nextCount <= 0) {
        // Remove bead
        setBeadSequence(beadSequence.filter(item => item.beadId !== beadId));
      } else {
        // Update count
        setBeadSequence(beadSequence.map(item => 
          item.beadId === beadId ? { ...item, count: nextCount } : item
        ));
      }
    } else if (delta > 0) {
      // Add new
      setBeadSequence([...beadSequence, { beadId, count: delta }]);
    }
  };

  // Flat array of beads for rendering (e.g. [ {color: '#e2a36f'}, {color: '#faf6f0'}, ... ])
  const renderedBeadsList = useMemo(() => {
    const list: BeadOption[] = [];
    beadSequence.forEach(item => {
      const beadInfo = BEAD_CATALOG.find(b => b.id === item.beadId);
      if (beadInfo) {
        for (let i = 0; i < item.count; i++) {
          list.push(beadInfo);
        }
      }
    });
    
    // Symmetric repetition or simple list. Let's make it look repetitive / alternating
    // to look like a realistic bead arrangement!
    if (list.length === 0) return [];
    
    // Sort or weave them logically so they alternate
    const sorted: BeadOption[] = [];
    const maxLen = Math.max(...beadSequence.map(item => item.count));
    for (let c = 0; c < maxLen; c++) {
      beadSequence.forEach(item => {
        if (c < item.count) {
          const b = BEAD_CATALOG.find(be => be.id === item.beadId);
          if (b) sorted.push(b);
        }
      });
    }
    return sorted;
  }, [beadSequence]);

  const selectedCharm = useMemo(() => {
    return CHARM_OPTIONS.find(c => c.id === selectedCharmId) || null;
  }, [selectedCharmId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Compose design description block
    const beadsSum = beadSequence.map(item => {
      const b = BEAD_CATALOG.find(be => be.id === item.beadId);
      return `${item.count}x Perle ${b ? b.name : item.beadId}`;
    }).join(', ');

    const designSummaryStr = `Type: ${baseType === 'bracelet' ? 'Bracelet' : 'Collier'} | Cordon: ${threadType} | Longueur: ${length}cm | Charme: ${selectedCharm ? selectedCharm.name : 'Aucun'} | Structure: ${beadsSum ? beadsSum : 'Aucune perle'}`;

    onAddInquiry({
      name,
      email,
      phone,
      type: 'custom_diy',
      message: notes || `Bonjour, je souhaite commander la création sur mesure personnalisée ci-dessous. Veuillez m'envoyer un devis précis.`,
      customDesignDetails: designSummaryStr
    });

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    }, 4000);
  };

  return (
    <section id="atelier-diy" className="scroll-mt-20 border-t border-zinc-900 py-24 px-6 md:px-12 bg-[#090909]">
      <div className="mx-auto max-w-7xl">
        
        {/* Intro */}
        <div className="flex flex-col mb-16 text-center items-center">
          <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
            <Sparkles className="h-3 w-3 animate-spin duration-3000" />
            Atelier Intelligent
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic text-white mt-2 leading-tight">Créez Votre Modèle de Rêve</h2>
          <p className="text-zinc-500 text-xs leading-relaxed mt-4 max-w-md">
            Mélangez les matières nobles, disposez les perles de pierres fines et choisissez vos charmes dorés. Notre configurateur haute définition prévisualise votre chef-d'œuvre en temps réel.
          </p>
        </div>

        {/* Builder Workstation layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT PANEL: Live Interactive Visual Stage (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-zinc-950/80 border border-zinc-900 justify-between p-6 sm:p-8 rounded-sm relative">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="h-2 w-2 bg-[#d4af37] rounded-full animate-ping" />
              <span className="text-[8px] uppercase tracking-widest text-[#d4af37]/80 font-mono">Modélisation en direct</span>
            </div>

            <button
              onClick={handleReset}
              className="absolute top-4 right-4 flex items-center gap-1 text-[8px] font-mono text-zinc-500 hover:text-[#d4af37] transition-colors"
              title="Réinitialiser l'atelier"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>

            {/* SVG Visual Canvas */}
            <div className="flex-1 flex items-center justify-center min-h-[280px] py-8">
              <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
                
                {/* SVG Drawing of the Bracelet / Necklace */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    {/* Bead highlights for spherical shine look */}
                    <radialGradient id="gold-glow" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#7a5a0f" />
                    </radialGradient>
                    {/* Dynamic bead gradients */}
                    {BEAD_CATALOG.map(bead => (
                      <radialGradient key={bead.id} id={`grad-${bead.id}`} cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fafafa" stopOpacity="0.5" />
                        <stop offset="50%" stopColor={bead.color} />
                        <stop offset="100%" stopColor="#000" stopOpacity="0.75" />
                      </radialGradient>
                    ))}
                    
                    {/* Shadow Filter */}
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* Thread representation path */}
                  {baseType === 'bracelet' ? (
                    // Circular Bracelet Thread
                    <circle
                      cx="100"
                      cy="100"
                      r="65"
                      fill="none"
                      stroke={threadType === 'gold' ? '#8a6e1a' : threadType === 'leather' ? '#6b4c35' : threadType === 'silk' ? '#ded9d7' : '#2b2a2a'}
                      strokeWidth={threadType === 'gold' ? '1.5' : '3'}
                      strokeDasharray={threadType === 'gold' ? 'none' : '2,2'}
                      filter="url(#shadow)"
                    />
                  ) : (
                    // Deep U-Shape Necklace Thread
                    <path
                      d="M 40,40 C 40,140 160,140 160,40"
                      fill="none"
                      stroke={threadType === 'gold' ? '#8a6e1a' : threadType === 'leather' ? '#6b4c35' : threadType === 'silk' ? '#ded9d7' : '#2b2a2a'}
                      strokeWidth={threadType === 'gold' ? '1.5' : '3.5'}
                      filter="url(#shadow)"
                    />
                  )}

                  {/* Draw beads along the path */}
                  {renderedBeadsList.map((bead, index) => {
                    let cx = 100;
                    let cy = 100;
                    
                    if (baseType === 'bracelet') {
                      // Circle trigonometry
                      // Leave a gap for the center charm at the bottom (-90 deg or 90 deg)
                      const count = renderedBeadsList.length;
                      const startAngle = selectedCharmId ? 25 : 0;
                      const endAngle = selectedCharmId ? 335 : 360;
                      const spread = endAngle - startAngle;
                      const angleStep = count > 1 ? spread / (count - 1) : 0;
                      const angleDeg = startAngle + index * angleStep + 90; // Rotate starting angle
                      const angleRad = (angleDeg * Math.PI) / 180;
                      
                      cx = 100 + 65 * Math.cos(angleRad);
                      cy = 100 + 65 * Math.sin(angleRad);
                    } else {
                      // Bezier curve approximation mapping
                      const count = renderedBeadsList.length;
                      const t = count > 1 ? index / (count - 1) : 0.5;
                      
                      // Quadratic/Cubic bezier coordinates approximation
                      // M 40,40 C 40,140 160,140 160,40
                      // we can approximate the coordinates
                      const p0 = { x: 40, y: 40 };
                      const p1 = { x: 40, y: 140 };
                      const p2 = { x: 160, y: 140 };
                      const p3 = { x: 160, y: 40 };
                      
                      // Cubic bezier math
                      const mt = 1 - t;
                      cx = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
                      cy = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
                    }

                    return (
                      <g key={index} className="transition-all duration-300">
                        {/* Bead drop shadow */}
                        <circle cx={cx} cy={cy + 1} r="6.5" fill="#000" opacity="0.3" />
                        {/* Real Bead circle with radial gradient */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6.5"
                          fill={`url(#grad-${bead.id})`}
                          className="cursor-pointer hover:stroke-white stroke-[0.5px]"
                          title={bead.name}
                        />
                      </g>
                    );
                  })}

                  {/* Center Charm Icon rendering */}
                  {selectedCharmId && selectedCharm && (
                    <g filter="url(#shadow)" className="transition-all duration-500">
                      {/* Charm Base Hook */}
                      <circle 
                        cx="100" 
                        cy={baseType === 'bracelet' ? '165' : '108'} 
                        r="3.5" 
                        fill="none" 
                        stroke="#d4af37" 
                        strokeWidth="1.5" 
                      />
                      {/* Charm Shape Display */}
                      <circle 
                        cx="100" 
                        cy={baseType === 'bracelet' ? '176' : '120'} 
                        r="9" 
                        fill="url(#gold-glow)" 
                        stroke="#9e7b23" 
                        strokeWidth="0.5" 
                      />
                      <text 
                        x="100" 
                        y={baseType === 'bracelet' ? '180' : '124'} 
                        textAnchor="middle" 
                        fontSize="9"
                      >
                        {selectedCharm.icon}
                      </text>
                    </g>
                  )}
                </svg>

                {/* Micro floating specs */}
                {totalBeadsCount === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs text-center border border-dashed border-zinc-800">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Ajoutez des perles ci-dessous <br />pour démarrer l'enfilage
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Price block & overview card */}
            <div className="border-t border-zinc-900 pt-6 mt-6 space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">Configuration</span>
                  <p className="text-sm font-semibold text-white uppercase tracking-wider mt-0.5">
                    {baseType === 'bracelet' ? `BRACELET (${length} cm)` : `COLLIER (${length} cm)`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">Estimation</span>
                  <p className="font-serif text-2xl font-bold text-[#d4af37]">{totalPrice.toFixed(1)} €</p>
                </div>
              </div>

              {/* Specs overview details */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 border-t border-zinc-900/40 pt-3">
                <p>Création : {baseType === 'bracelet' ? 'Structure Bracelet' : 'Structure Collier'}</p>
                <p className="text-right">Nombre de Perles : {totalBeadsCount}</p>
                <p>Support : Cordon {threadType}</p>
                <p className="text-right">Charm : {selectedCharm ? selectedCharm.name : 'Aucun'}</p>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Customizer selections and Inquiry submit form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Options Tabs */}
            <div className="space-y-6">
              
              {/* Step 1: Base model & thread */}
              <div className="space-y-3">
                <span className="text-[9px] font-semibold text-[#d4af37] uppercase tracking-[0.2em]">1. Base de la Création</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setBaseType('bracelet'); setLength(18); }}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                      baseType === 'bracelet' 
                        ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]' 
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    Bracelet (Base 30€)
                  </button>
                  <button
                    onClick={() => { setBaseType('collier'); setLength(42); }}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                      baseType === 'collier' 
                        ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]' 
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    Collier (Base 50€)
                  </button>
                </div>
              </div>

              {/* Step 2: Thread/cord type & length */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Matière du support</label>
                  <select
                    value={threadType}
                    onChange={(e) => setThreadType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="gold">Chaîne Plaqué Or 18k (+15€)</option>
                    <option value="silk">Fil de Soie Organique (+5€)</option>
                    <option value="macrame">Cordon Ciré Macramé (+8€)</option>
                    <option value="leather">Cordon d'Écorce de Cuir (+6€)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Longueur requise</label>
                    <span className="text-[10px] font-mono text-[#d4af37] font-bold">{length} cm</span>
                  </div>
                  <input
                    type="range"
                    min={baseType === 'bracelet' ? 14 : 35}
                    max={baseType === 'bracelet' ? 24 : 65}
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37]"
                  />
                </div>

              </div>

              {/* Step 3: Bead stacking catalog */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[9px] font-semibold text-[#d4af37] uppercase tracking-[0.2em]">2. Sélection des Perles Précieuses</span>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">Prix à l'unité</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[240px] overflow-y-auto pr-2">
                  {BEAD_CATALOG.map(bead => {
                    const countInSeq = beadSequence.find(item => item.beadId === bead.id)?.count || 0;
                    return (
                      <div 
                        key={bead.id} 
                        className="flex items-center justify-between border border-zinc-900 bg-zinc-950/60 p-3 hover:border-zinc-800"
                      >
                        <div className="flex items-center gap-3">
                          {/* Visual spherical badge */}
                          <div 
                            className="h-6 w-6 rounded-full border border-black/80 flex-shrink-0 flex items-center justify-center relative shadow-inner"
                            style={{ 
                              background: `radial-gradient(circle at 6px 6px, #ffffff99, ${bead.color} 50%, #000)` 
                            }}
                          />
                          <div className="text-left">
                            <h4 className="text-xs font-semibold text-white">{bead.name}</h4>
                            <p className="text-[9px] text-zinc-500 mt-0.5">{bead.type} | {bead.pricePerBead}€/p</p>
                          </div>
                        </div>

                        {/* Stacker Increment Controls */}
                        <div className="flex items-center gap-2">
                          {countInSeq > 0 ? (
                            <>
                              <button
                                onClick={() => handleUpdateBeadCount(bead.id, -1)}
                                className="flex h-5 w-5 items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              <span className="text-xs font-mono text-zinc-300 w-5 text-center">{countInSeq}</span>
                            </>
                          ) : null}
                          <button
                            onClick={() => handleUpdateBeadCount(bead.id, 1)}
                            className="flex h-5 w-5 items-center justify-center border border-zinc-800 bg-[#d4af37] text-black"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Charms Selection */}
              <div className="space-y-3">
                <span className="text-[9px] font-semibold text-[#d4af37] uppercase tracking-[0.2em]">3. Ajout d'un Charme Antique</span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setSelectedCharmId(null)}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider border rounded-[1px] transition-all ${
                      selectedCharmId === null
                        ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]'
                        : 'border-zinc-900 bg-zinc-950 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    Aucun
                  </button>
                  {CHARM_OPTIONS.map(charm => (
                    <button
                      key={charm.id}
                      onClick={() => setSelectedCharmId(charm.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider border rounded-[1px] transition-all ${
                        selectedCharmId === charm.id
                          ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:border-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">{charm.icon}</span>
                      <span>{charm.name} (+{charm.price}€)</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* INQUIRY FORM FOR DEVIS */}
            <div className="border-t border-zinc-900 pt-8 mt-4 text-left space-y-4">
              <div>
                <h3 className="font-serif text-lg text-white">Commander la fabrication sur mesure</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  Notre atelier modélisera et assemblera minutieusement cette combinaison exacte pour vous. Remplissez vos coordonnées pour valider la faisabilité créative et recevoir un devis final gratuit.
                </p>
              </div>

              {formSent ? (
                <div className="flex flex-col items-center justify-center py-6 text-center bg-zinc-900/30 border border-emerald-950">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mb-2">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-200">Demande sur Mesure Envoyée !</p>
                  <p className="text-[10px] text-zinc-500 max-w-sm mt-0.5">
                    Notre maître-artisan analyse le tissage de vos perles et va vous recontacter par email avec un dessin validé.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Votre Nom</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Sophie Lapointe"
                        className="w-full bg-zinc-950 border border-zinc-900 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Votre Adresse Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: sophie@example.com"
                        className="w-full bg-zinc-950 border border-zinc-900 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Instructions particulières (Ajustement de taille, etc.)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Indiquez par exemple si vous désirez une alternance spécifique de perles ou une longueur particulière."
                      className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={totalBeadsCount === 0}
                    className={`w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest py-3.5 transition-all ${
                      totalBeadsCount === 0
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-[#d4af37] text-black hover:opacity-90 active:scale-[0.99]'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5" />
                    Soumettre ce modèle à l'Atelier
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
