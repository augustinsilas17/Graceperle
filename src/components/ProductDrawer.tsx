import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { X, Calendar, Hammer, Clock, ShieldAlert, Check, Sparkles, Send, Star, User, MessageSquare, Bot, TrendingUp, Play, Video, Camera } from 'lucide-react';
import { Product, Inquiry, ProductReview } from '../types';
import RingSizerModal from './RingSizerModal';
import LuxuryVideoPlayer from './LuxuryVideoPlayer';
import VirtualTryOnModal from './VirtualTryOnModal';
import JewelryCareWidget from './JewelryCareWidget';

interface ProductDrawerProps {
  product: Product | null;
  onClose: () => void;
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
  reviews: ProductReview[];
  onAddReview: (review: ProductReview) => void;
}

export default function ProductDrawer({ product, onClose, onAddInquiry, reviews = [], onAddReview }: ProductDrawerProps) {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Sizing helper states
  const [isSizerOpen, setIsSizerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Engraving option state
  const [engravingText, setEngravingText] = useState('');

  // Zoom / Loupe magnification states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setZoomCoords({
      x,
      y,
      width,
      height
    });
    setIsZoomed(true);
  };

  const handleMouseLeaveZoom = () => {
    setIsZoomed(false);
  };

  // Review form states
  const [playingDrawerVideoId, setPlayingDrawerVideoId] = useState<string | null>(null);
  const [reviewAttachedVideoUrl, setReviewAttachedVideoUrl] = useState('');
  const [reviewAttachedVideoThumb, setReviewAttachedVideoThumb] = useState('');
  const [reviewAuthorName, setReviewAuthorName] = useState('');
  const [reviewAuthorEmail, setReviewAuthorEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [reviewFormSuccess, setReviewFormSuccess] = useState(false);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);

  // Virtual Try-On AR state
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  if (!product) return null;

  // Filter reviews for current product
  const productReviews = reviews.filter(rev => rev.productId === product.id);
  
  // Calculate dynamic average rating
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : (product?.rating || 5.0).toFixed(1);

  const handleGenerateAiReview = async () => {
    setIsGeneratingReview(true);
    try {
      const response = await fetch('/api/reviews/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          productName: product.name,
          productDescription: product.description,
        }),
      });
      const data = await response.json();
      if (data.review) {
        setReviewComment(data.review);
      }
    } catch (err) {
      console.error('Failed to generate AI review', err);
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthorName || !reviewAuthorEmail || !reviewComment) return;

    setIsGeneratingReply(true);

    const freshReview: ProductReview = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      authorName: reviewAuthorName,
      authorEmail: reviewAuthorEmail,
      rating: reviewRating,
      comment: reviewComment,
      videoUrl: reviewAttachedVideoUrl || undefined,
      videoThumbnail: reviewAttachedVideoThumb || undefined,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
    };

    try {
      const response = await fetch('/api/reviews/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewComment: reviewComment,
          rating: reviewRating,
          productName: product.name,
          artisanName: product.artisan,
        }),
      });
      const data = await response.json();
      if (data.reply) {
        freshReview.artisanReply = {
          author: product.artisan,
          comment: data.reply,
          date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        };
      }
    } catch (err) {
      console.error('Failed to generate artisan reply', err);
      // Fallback response from the artisan
      freshReview.artisanReply = {
        author: product.artisan,
        comment: `Je vous remercie sincèrement pour votre confiance et ces retours qui valorisent notre art avec tant d'éclat.`,
        date: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };
    } finally {
      setIsGeneratingReply(false);
      onAddReview(freshReview);
      setReviewFormSuccess(true);
      setTimeout(() => {
        setReviewFormSuccess(false);
        setReviewAuthorName('');
        setReviewAuthorEmail('');
        setReviewRating(5);
        setReviewComment('');
        setReviewAttachedVideoUrl('');
        setReviewAttachedVideoThumb('');
      }, 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const isEligibleForEngraving = product.category !== 'crafting';
    const engravingSection = (isEligibleForEngraving && engravingText) ? `\n[Gravure personnalisée exclusive : "${engravingText}"]` : '';

    // Concocting elegant final message
    const finalMessage = message 
      ? `${message}${selectedSize ? `\n[Taille sélectionnée de prestige : ${selectedSize}]` : ''}${engravingSection}`
      : `Bonjour, je souhaite réserver la création d'exception "${product.name}" (${product.price} €)${selectedSize ? ` en ${selectedSize}` : ''}${engravingSection}. Merci de me recontacter pour les détails.`;

    onAddInquiry({
      name,
      email,
      phone,
      type: 'product_reservation',
      productId: product.id,
      message: finalMessage
    });

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSelectedSize(null);
      setEngravingText('');
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-[#0d0d0d] border-l border-zinc-900 text-[#f5f2ed] shadow-2xl flex flex-col h-full transform transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#d4af37]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">Fiche Artisanale</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-zinc-400 hover:text-[#d4af37] hover:bg-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {/* Visual Header / Hero banner inside detail with loupe zoom */}
            <div 
              className="relative aspect-video w-full overflow-hidden border border-zinc-900 bg-zinc-950 cursor-crosshair group/zoom"
              onMouseMove={handleMouseMoveZoom}
              onMouseLeave={handleMouseLeaveZoom}
              id={`drawer-zoom-panel-${product.id}`}
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`h-full w-full object-cover transition-all duration-300 origin-center ${isZoomed ? 'brightness-50 saturate-75 opacity-75' : 'brightness-100 opacity-100'}`}
              />

              {/* Floating gold AR Try On trigger button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTryOnOpen(true);
                }}
                className={`absolute top-4 left-4 z-[25] flex items-center gap-1.5 px-3 py-1.5 bg-black/85 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-[#d4af37]/35 hover:border-[#d4af37] text-[9.5px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all hover:scale-102 active:scale-95 shadow-lg shadow-black/80 ${isZoomed ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-[1.0] scale-100'}`}
                title="Salon d'essayage en réalité virtuelle"
              >
                <Camera className="h-3.5 w-3.5 animate-pulse" />
                <span>Essayer en AR ✦</span>
              </button>
              
              {/* Luxury interactive magnifying loupe overlay */}
              {isZoomed && (
                <>
                  {/* Outer pulsating echo circle */}
                  <div 
                    className="absolute pointer-events-none rounded-full border border-double border-[#d4af37]/30"
                    style={{
                      width: '136px',
                      height: '136px',
                      left: `${zoomCoords.x - 68}px`,
                      top: `${zoomCoords.y - 68}px`,
                      zIndex: 26,
                      transform: 'translate3d(0, 0, 0)',
                      animation: 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }}
                  />

                  {/* Rotating custom dash orbit */}
                  <div 
                    className="absolute pointer-events-none rounded-full border border-dashed border-[#d4af37]/50 animate-[spin_12s_linear_infinite]"
                    style={{
                      width: '148px',
                      height: '148px',
                      left: `${zoomCoords.x - 74}px`,
                      top: `${zoomCoords.y - 74}px`,
                      zIndex: 27,
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  />

                  {/* The main high-fidelity glass magnifier sphere */}
                  <div 
                    className="absolute pointer-events-none rounded-full transition-all duration-75 ease-out shadow-[0_15px_30px_rgba(0,0,0,0.7),inset_0_0_15px_rgba(212,175,55,0.4)]"
                    style={{
                      width: '128px',
                      height: '128px',
                      left: `${zoomCoords.x - 64}px`,
                      top: `${zoomCoords.y - 64}px`,
                      border: '2.5px solid #d4af37',
                      backgroundImage: `url(${product.image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: `${zoomCoords.width * 2.4}px ${zoomCoords.height * 2.4}px`,
                      backgroundPosition: `-${zoomCoords.x * 2.4 - 64}px -${zoomCoords.y * 2.4 - 64}px`,
                      zIndex: 28,
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  />
                  
                  {/* Delicate glowing gold cursor pivot dot */}
                  <div 
                    className="absolute pointer-events-none rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                    style={{
                      width: '4px',
                      height: '4px',
                      left: `${zoomCoords.x - 2}px`,
                      top: `${zoomCoords.y - 2}px`,
                      zIndex: 29,
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  />
                </>
              )}
              
              {/* Subtle luxury helper indicator */}
              <div className={`absolute top-4 right-4 z-10 px-2.5 py-1 bg-black/85 backdrop-blur-sm border border-[#d4af37]/25 text-[8px] font-mono font-bold uppercase tracking-widest text-[#d4af37] transition-opacity duration-350 pointer-events-none ${isZoomed ? 'opacity-0 scale-90' : 'opacity-100 group-hover/zoom:opacity-100 scale-100'}`}>
                Loupe Interactive de Haute Précision • Glisser
              </div>

              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${isZoomed ? 'opacity-15' : 'opacity-100'}`}></div>
              
              <div className={`absolute bottom-6 left-6 right-6 flex items-end justify-between transition-all duration-300 ${isZoomed ? 'translate-y-4 opacity-0 pointer-events-none scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
                <div>
                  <span className="text-[9px] uppercase tracking-widest bg-[#d4af37] text-black px-2 py-0.5 font-bold rounded-[2px]">
                    {product.category === 'freshwater' ? "Perles d'Eau Douce" : product.category === 'saltwater' ? "Perles de Mer" : product.category === 'gemstone' ? "Pierres Fines" : "Kits & Fournitures"}
                  </span>
                  <h2 className="font-serif text-2xl font-light italic text-white mt-1">{product.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-2.5 w-2.5 ${
                            star <= Math.round(Number(averageRating))
                              ? 'text-[#d4af37] fill-[#d4af37]'
                              : 'text-zinc-650'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-zinc-300 font-mono">
                      {averageRating} ({productReviews.length} {productReviews.length > 1 ? 'avis' : 'avis'})
                    </span>
                  </div>
                </div>
                <div className="bg-[#0d0d0d]/90 backdrop-blur border border-zinc-800 px-4 py-2 text-right">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">Prix indicatif</span>
                  <p className="font-serif text-lg font-bold text-[#d4af37]">{product.price} €</p>
                </div>
              </div>
            </div>

            {/* Core Info Row */}
            <div className="grid grid-cols-3 gap-4 border-y border-zinc-900 py-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <Hammer className="h-5 w-5 text-[#d4af37]/80 mb-2" />
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Artisan Dévoué</span>
                <p className="text-xs font-semibold text-zinc-300 mt-1">{product.artisan}</p>
              </div>
              <div className="flex flex-col items-center justify-center border-x border-zinc-900">
                <Clock className="h-5 w-5 text-[#d4af37]/80 mb-2" />
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Temps requis</span>
                <p className="text-xs font-semibold text-zinc-300 mt-1">{product.timeToCreate}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Calendar className="h-5 w-5 text-[#d4af37]/80 mb-2" />
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Matières</span>
                <p className="text-xs font-semibold text-zinc-300 mt-1 truncate max-w-[120px]" title={product.materials.join(', ')}>
                  {product.materials[0]}...
                </p>
              </div>
            </div>

            {/* Description & Highlighting */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-white">L'Histoire de la Création</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Indice d'appréciation / Recharts Chart */}
            <div className="space-y-4 bg-zinc-950/65 border border-zinc-900 p-5 rounded-[1px]" id="price-investment-evolution-section">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#d4af37] uppercase block font-bold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-[#d4af37]" />
                    Cote d'Investissement d'Art
                  </span>
                  <h4 className="font-serif text-sm text-white font-medium">Évolution de la Valeur Estimée</h4>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-950/50 text-emerald-400 px-2 py-1 text-[9px] font-mono rounded-sm font-semibold">
                  +12.6% (6 mois)
                </div>
              </div>
              
              <p className="text-xs text-zinc-400 text-left leading-relaxed">
                Reflétant l'appréciation continue de la nacre naturelle de prestige et le cours de l'or fin d'Atelier, cette parure d'exception démontre une trajectoire de valeur hautement ascendante.
              </p>

              {/* Chart container */}
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: 'Jan', 'valeur': Math.round(product.price * 0.88) },
                      { month: 'Fév', 'valeur': Math.round(product.price * 0.91) },
                      { month: 'Mar', 'valeur': Math.round(product.price * 0.93) },
                      { month: 'Avr', 'valeur': Math.round(product.price * 0.95) },
                      { month: 'Mai', 'valeur': Math.round(product.price * 0.98) },
                      { month: 'Juin', 'valeur': product.price },
                    ]}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity={0.45}/>
                        <stop offset="50%" stopColor="#d4af37" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#d4af37" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#4b5563" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#4b5563" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const valStr = payload[0].value;
                          return (
                            <div className="bg-[#0c0c0c] border border-[#d4af37]/60 p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] text-left rounded-[1px] font-mono text-[9px]">
                              <p className="text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{label} 2026</p>
                              <p className="text-[#d4af37] font-semibold font-sans text-[11px]">
                                {valStr} € <span className="text-[8px] text-zinc-400 font-normal">estimés</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="valeur" 
                      stroke="#d4af37" 
                      strokeWidth={2}
                      activeDot={{ r: 4.5, stroke: '#d4af37', strokeWidth: 1.5, fill: '#fff' }}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center text-[8px] text-zinc-500 font-mono pt-1">
                <span>ESTIMATION OFFICIELLE ATELIER</span>
                <span>MAISON AURUM VENDÔME 2026</span>
              </div>
            </div>

            {/* Materials List */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">Composants de Prestige</h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((m, idx) => (
                  <span key={idx} className="bg-zinc-950 border border-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">Détails de Confection</h4>
              <ul className="space-y-2">
                {product.features.map((f, idx) => (
                  <li key={idx} className="flex items-start text-xs text-zinc-400 gap-2.5">
                    <span className="h-1.5 w-1.5 bg-[#d4af37] rounded-full mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AR Try-On Promotion block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-950/45 border border-[#d4af37]/25 rounded-[1px] text-left" id="ar-tryon-promo-block">
              <div className="space-y-1">
                <span className="text-[8px] font-mono tracking-[0.2em] text-[#d4af37] uppercase block font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-[#d4af37] rounded-full animate-pulse" />
                  Cabine d'AR Virtuelle [Nouveau]
                </span>
                <h4 className="font-serif text-sm text-white font-medium">Salon d'Essayage en Temps Réel</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Activez notre miroir intelligent ou utilisez nos mannequins d'Atelier pour contempler le tombé du bijou porté.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTryOnOpen(true)}
                className="px-4 py-2 bg-[#d4af37] hover:bg-white text-black text-[9px] font-mono font-bold uppercase tracking-widest transition-all hover:scale-102 shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#d4af37]/15"
              >
                <Camera className="h-3.5 w-3.5" />
                Essayer en AR
              </button>
            </div>

            {/* Guide des Tailles Promotion block */}
            <div className="flex items-center justify-between p-4 bg-zinc-950/45 border border-zinc-900 rounded-[1px] text-left" id="ring-sizer-promo-block">
              <div className="space-y-1 pr-4">
                <span className="text-[8px] font-mono tracking-[0.2em] text-[#d4af37] uppercase block font-bold">
                  Confection & Sizing
                </span>
                <h4 className="font-serif text-sm text-white font-medium">Baguier Virtuel & Guide de Mesure</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Mesurez votre tour de doigt idéal en temps réel pour nos splendides bagues et créations en perles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSizerOpen(true)}
                className="px-3 py-2 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] text-[9px] font-mono font-bold uppercase tracking-widest transition-all hover:bg-[#d4af37] hover:text-black shrink-0 cursor-pointer"
              >
                Calculer ma taille
              </button>
            </div>

            {/* Interactive Jewelry Care Guide Module */}
            <JewelryCareWidget product={product} />

            {/* Inquiry/Reservation Drawer Section */}
            <div className="bg-zinc-950/85 border border-zinc-900 p-6 space-y-6">
              <div className="flex flex-col text-left">
                <h4 className="font-serif text-lg text-white">Réserver ou Personnaliser ce Modèle</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Cette pièce d'exception vous intéresse ? Remplissez ce formulaire et l'Atelier Aurum Beads prendra contact avec vous personnellement sous 24h.
                </p>
              </div>

              {selectedSize && (
                <div className="flex items-center justify-between p-3.5 bg-[#d4af37]/5 border border-[#d4af37]/35 rounded-[1px] animate-fade-in text-left">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono tracking-widest text-[#d4af37] uppercase block font-bold">Taille Sur-Mesure Retenue</span>
                    <span className="text-xs text-white font-semibold">{selectedSize}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedSize(null)}
                    className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 hover:text-red-400 cursor-pointer hover:underline"
                  >
                    Effacer
                  </button>
                </div>
              )}

              {formSent ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-900/40 border border-emerald-900/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mb-3">
                    <Check className="h-6 w-6" />
                  </div>
                  <h5 className="font-serif text-base text-zinc-200">Demande Enregistrée</h5>
                  <p className="text-xs text-zinc-500 max-w-sm mt-1">
                    Notre artisan-joaillier étudie votre demande. Nous vous répondrons par email d'ici peu.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Votre Nom complet</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Sophie Lapointe"
                        className="w-full bg-[#0d0d0d] border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
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
                        className="w-full bg-[#0d0d0d] border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Téléphone (Optionnel)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +33 6 12 34 56 78"
                      className="w-full bg-[#0d0d0d] border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Message particulier (Optionnel)</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Ex: Bonjour, je souhaite commander ce modèle d'une longueur spécifique de 18cm.`}
                      className="w-full bg-[#0d0d0d] border border-zinc-800 p-3.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                    />
                  </div>

                  {product.category !== 'crafting' && (
                    <div className="space-y-1 p-4 bg-zinc-950/60 border border-zinc-900 rounded-[1px] animate-fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                          Option de Gravure Personnalisée
                        </label>
                        <span className="text-[8px] font-mono text-zinc-500">{engravingText.length}/20 caractères</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mb-1.5">
                        Ajoutez gratuitement un mot d'amour, des initiales ou une date clé à graver subtilement sur le fermoir de votre bijou.
                      </p>
                      <input
                        type="text"
                        maxLength={20}
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder="Ex: L & A 12.06.26 • Offert"
                        className="w-full bg-[#0d0d0d] border border-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#d4af37] transition-colors rounded-[1px]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest py-3.5 hover:opacity-90 active:scale-[0.99] transition-transform"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Envoyer ma demande de réservation
                  </button>
                </form>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="space-y-6 border-t border-zinc-900 pt-8" id="product-reviews-section">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white">Avis de Prestige</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Témoignages certifiés de notre clientèle d'exception.
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-2xl font-bold text-[#d4af37]">{averageRating}</span>
                    <span className="text-xs text-zinc-500">/5</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(Number(averageRating))
                            ? 'text-[#d4af37] fill-[#d4af37]'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                    {productReviews.length} avis vérifié{productReviews.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {productReviews.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-zinc-900 text-zinc-500 text-xs">
                    Aucun avis pour le moment. Soyez le premier à exprimer votre ressenti.
                  </div>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="bg-zinc-950 border border-zinc-900/85 p-4 space-y-3.5 transition-colors hover:border-zinc-800">
                      
                      {/* Review Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-serif text-[#d4af37] text-xs font-bold uppercase shadow-inner">
                            {rev.authorName ? rev.authorName.charAt(0) : <User className="h-3 w-3" />}
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-zinc-200">{rev.authorName}</h5>
                            <span className="text-[9px] text-zinc-500 font-mono">{rev.date}</span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-2.5 w-2.5 ${
                                star <= rev.rating
                                  ? 'text-[#d4af37] fill-[#d4af37]'
                                  : 'text-zinc-850'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      {playingDrawerVideoId === rev.id && rev.videoUrl ? (
                        <div className="w-full pt-1" id={`drawer-video-container-${rev.id}`}>
                          <LuxuryVideoPlayer 
                            src={rev.videoUrl} 
                            onClose={() => setPlayingDrawerVideoId(null)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-300 leading-relaxed italic pl-2 border-l border-[#d4af37]/30 py-0.5">
                            "{rev.comment}"
                          </p>

                          {rev.videoUrl && (
                            <div 
                              onClick={() => setPlayingDrawerVideoId(rev.id)}
                              className="relative overflow-hidden rounded-xs border border-zinc-900 hover:border-[#d4af37]/40 cursor-pointer transition-all max-w-[280px] bg-black"
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                              <img 
                                src={rev.videoThumbnail || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300"} 
                                alt="Rendu porté" 
                                className="w-full h-20 object-cover filter brightness-[0.70] hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-x-2.5 bottom-2 z-20 flex items-center gap-1.5">
                                <span className="h-5 w-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg">
                                  <Play className="h-2 w-2 fill-black ml-0.5" />
                                </span>
                                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-100">
                                  Regarder l'Avis de Présentation
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Generated Badge */}
                      {rev.aiSuggested && (
                        <div className="flex items-center gap-1.5 text-[9px] text-[#d4af37]/85 bg-[#d4af37]/5 px-2 py-0.5 border border-[#d4af37]/10 rounded-[2px] w-fit">
                          <Sparkles className="h-3 w-3 text-[#d4af37] animate-pulse" />
                          <span>Rédigé avec l'aide d'Aurum IA</span>
                        </div>
                      )}

                      {/* Artisan Reply Card */}
                      {rev.artisanReply && (
                        <div className="ml-4 bg-[#0e0e0e] border border-zinc-900 p-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 h-[20px] w-[50px] bg-gradient-to-bl from-[#d4af37]/5 to-transparent"></div>
                          <div className="flex items-center gap-1.5 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                            <Bot className="h-3.5 w-3.5 shrink-0" />
                            <span>Réponse de l'Artisan ({rev.artisanReply.author})</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-serif leading-relaxed italic text-zinc-300">
                            "{rev.artisanReply.comment}"
                          </p>
                          <div className="text-right text-[8px] text-zinc-650 font-mono mt-1">
                            Main de Maître • {rev.artisanReply.date}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Leave a Review Form */}
              <div className="bg-zinc-950 border border-zinc-900 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#d4af37]" />
                  <h4 className="font-serif text-sm text-white">Partager Votre Expérience</h4>
                </div>

                {reviewFormSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center bg-zinc-900/20 border border-emerald-950/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mb-2">
                      <Check className="h-5 w-5" />
                    </div>
                    <h5 className="text-xs font-semibold text-zinc-100">Avis Transmis</h5>
                    <p className="text-[10px] text-zinc-500 max-w-xs mt-1">
                      Votre témoignage d'exception a bien été enregistré. L'artisan joaillier vous remercie chaleureusement pour votre retour inspirant.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
                    
                    {/* Author Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Nom complet ou Initiales</label>
                        <input
                          type="text"
                          required
                          value={reviewAuthorName}
                          onChange={(e) => setReviewAuthorName(e.target.value)}
                          placeholder="Ex: Sophie de M."
                          className="w-full bg-[#0d0d0d] border border-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Votre Adresse Email</label>
                        <input
                          type="email"
                          required
                          value={reviewAuthorEmail}
                          onChange={(e) => setReviewAuthorEmail(e.target.value)}
                          placeholder="Ex: sophie@prestige.com"
                          className="w-full bg-[#0d0d0d] border border-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Star Rating Interactive Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Votre Évaluation Étoilée</label>
                      <div className="flex flex-wrap items-center gap-2.5 bg-[#0d0d0d] border border-zinc-900 px-3.5 py-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mr-1.5 font-mono">
                          Note :
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoveredStars(star)}
                              onMouseLeave={() => setHoveredStars(null)}
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none transition-transform hover:scale-125 duration-100 cursor-pointer"
                            >
                              <Star
                                className={`h-4.5 w-4.5 ${
                                  star <= (hoveredStars !== null ? hoveredStars : reviewRating)
                                    ? 'text-[#d4af37] fill-[#d4af37]'
                                    : 'text-zinc-800'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-[#d4af37] ml-2 font-bold uppercase tracking-wider">
                          {reviewRating === 5 ? 'Chef-d\'œuvre (5/5)' : reviewRating === 4 ? 'Très élégant (4/5)' : reviewRating === 3 ? 'Satisfaisant (3/5)' : reviewRating === 2 ? 'Incomplet (2/5)' : 'Insuffisant (1/5)'}
                        </span>
                      </div>
                    </div>

                    {/* Worn Jewelry Video Demonstration Attachment Option */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1 text-[8.5px] tracking-wider uppercase font-mono">
                        <Video className="h-3 w-3 text-[#d4af37]" />
                        Intégrer une vidéo de présentation du bijou porté (Optionnel)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            label: 'Collier d\'Or',
                            url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-beautiful-gold-necklace-42512-large.mp4',
                            thumb: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300'
                          },
                          {
                            label: 'Éléments Nacrés',
                            url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-jewels-and-pearl-earrings-on-a-display-42610-large.mp4',
                            thumb: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300'
                          },
                          {
                            label: 'Bague de Lumière',
                            url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-shining-gold-ring-40081-large.mp4',
                            thumb: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300'
                          }
                        ].map((v, idx) => {
                          const isSelected = reviewAttachedVideoUrl === v.url;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setReviewAttachedVideoUrl('');
                                  setReviewAttachedVideoThumb('');
                                } else {
                                  setReviewAttachedVideoUrl(v.url);
                                  setReviewAttachedVideoThumb(v.thumb);
                                }
                              }}
                              className={`relative aspect-video rounded-xs overflow-hidden border p-0.5 text-left transition-all ${
                                isSelected 
                                  ? 'border-[#d4af37] ring-1 ring-[#d4af37]' 
                                  : 'border-zinc-900 hover:border-zinc-800 bg-[#0d0d0d]'
                              }`}
                            >
                              <img 
                                src={v.thumb} 
                                alt={v.label} 
                                className="w-full h-full object-cover filter brightness-[0.70]"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-2">
                                <span className="text-[7px] font-mono leading-none tracking-wide text-white uppercase block truncate font-bold">
                                  {v.label}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-[#d4af37] text-black h-3.5 w-3.5 rounded-full flex items-center justify-center text-[7.5px] font-bold">
                                  ✓
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Text Testimonial with AI Assistance button */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Témoignage d'achat</label>
                        
                        {/* AI Co-writer trigger */}
                        <button
                          type="button"
                          onClick={handleGenerateAiReview}
                          disabled={isGeneratingReview}
                          className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-0"
                          title="Rédige automatiquement un avis d'exception inspiré par l'IA"
                        >
                          <Sparkles className={`h-3 w-3 ${isGeneratingReview ? 'animate-spin' : 'animate-pulse'}`} />
                          <span>{isGeneratingReview ? 'Inspiration...' : 'Rédiger avec Aurum IA ✨'}</span>
                        </button>
                      </div>
                      
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Exprimez l'émotion suscitée par ce modèle précieux, ou laissez l'IA d'Aurum vous inspirer en cliquant sur le bouton ci-dessus..."
                        className="w-full bg-[#0d0d0d] border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none leading-relaxed placeholder-zinc-750"
                      />
                    </div>

                    {/* Custom Loading State for Artisan Reply generation */}
                    <button
                      type="submit"
                      disabled={isGeneratingReply}
                      className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest py-3 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-75 cursor-pointer"
                    >
                      {isGeneratingReply ? (
                        <>
                          <Bot className="h-3.5 w-3.5 animate-bounce text-black" />
                          <span>L'artisan façonne sa réponse poétique...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Publier mon Avis de Prestige</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Cert Warning */}
            <div className="flex items-start gap-3 bg-zinc-950/40 p-4 border border-zinc-900 rounded-[2px]">
              <ShieldAlert className="h-4.5 w-4.5 text-[#d4af37] shrink-0 mt-0.5" />
              <div className="text-[10px] text-zinc-500 leading-relaxed">
                <span className="text-zinc-400 font-medium">Certificat d'Authenticité :</span> Chaque création de la vitrine Aurum Beads est livrée avec un certificat signé par l'artisan joaillier, attestant de l'origine éthique des pierres précieuses et du caractère unique du tissage de perles.
              </div>
            </div>
          </div>
        </div>
      </div>

      <RingSizerModal
        isOpen={isSizerOpen}
        onClose={() => setIsSizerOpen(false)}
        onSelectSize={(size) => {
          setSelectedSize(size);
          setIsSizerOpen(false);
        }}
        isPearlSpecific={product?.category !== 'gemstone'}
      />

      {isTryOnOpen && (
        <VirtualTryOnModal
          product={product}
          onClose={() => setIsTryOnOpen(false)}
        />
      )}
    </div>
  );
}
