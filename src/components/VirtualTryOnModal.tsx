import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, RotateCcw, Sliders, Sparkles, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface VirtualTryOnModalProps {
  product: Product;
  onClose: () => void;
}

type FilterType = 'natural' | 'gold_glow' | 'studio_mono' | 'vintage';

export default function VirtualTryOnModal({ product, onClose }: VirtualTryOnModalProps) {
  // Video & Stream states
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [activeTab, setActiveTab] = useState<'camera' | 'model'>('camera');
  
  // Model Fallbacks (by jewelry type)
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const models = [
    {
      name: 'Modèle Cou & Buste',
      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
      type: 'necklace',
      description: 'Idéal pour simuler le porté de nos colliers d\'art, sautoirs et ras-de-cou.'
    },
    {
      name: 'Modèle Portrait & Oreilles',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      type: 'earring',
      description: 'Idéal pour positionner nos boucles d\'oreilles et puces précieuses.'
    },
    {
      name: 'Modèle Mains & Poignets',
      url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      type: 'ring_bracelet',
      description: 'Parfait pour contempler nos bracelets impériaux et bagues d\'exception.'
    }
  ];

  // Pick best initial model matching product name / specs
  useEffect(() => {
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes('boucle') || nameLower.includes('puce') || nameLower.includes('oreille')) {
      setSelectedModelIndex(1); // Earring model
    } else if (nameLower.includes('bracelet') || nameLower.includes('bague')) {
      setSelectedModelIndex(2); // Hand/Wrist/Ring model
    } else {
      setSelectedModelIndex(0); // Necklace model
    }
  }, [product]);

  // Transform / Positioning States
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.95);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Filters state
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('natural');

  // Photo snapshots state
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize Camera
  const startCamera = async () => {
    try {
      setCameraPermission('pending');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission('granted');
      setActiveTab('camera');
    } catch (err) {
      console.warn('Camera access denied or aborted:', err);
      setCameraPermission('denied');
      setActiveTab('model'); // Automatic fallback to model portrait
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Reset positioning to default
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setOpacity(0.95);
    setPosition({ x: 0, y: 0 });
  };

  // Drag handlers
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const handleDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    });
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Touch triggers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Filter Styles Mapping
  const getFilterClass = () => {
    switch (selectedFilter) {
      case 'gold_glow':
        return 'brightness-[1.05] contrast-[1.02] sepia-[0.16] saturate-[1.12] hue-rotate-[5deg]';
      case 'studio_mono':
        return 'grayscale contrast-[1.18] brightness-[0.98]';
      case 'vintage':
        return 'sepia-[0.35] brightness-[0.95] contrast-[0.95] saturate-[0.85]';
      case 'natural':
      default:
        return 'brightness-100 contrast-100';
    }
  };

  // Capture Photo Snapshot
  const captureSnapshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const video = videoRef.current;
      const overlayImage = document.getElementById('tryon-jewelry-img') as HTMLImageElement;
      
      const width = 800;
      const height = 600;
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw background
        if (activeTab === 'camera' && video && cameraPermission === 'granted') {
          // Flip horizontally for user experience mirror
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, width, height);
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        } else {
          // Draw model picture
          const modelImg = new Image();
          modelImg.crossOrigin = 'anonymous';
          modelImg.src = models[selectedModelIndex].url;
          ctx.drawImage(modelImg, 0, 0, width, height);
        }

        // Apply visual filter to canvas overall if needed
        if (selectedFilter === 'studio_mono') {
          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i]     = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
          }
          ctx.putImageData(imgData, 0, 0);
        } else if (selectedFilter === 'gold_glow') {
          ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw overlay jewelry
        if (overlayImage) {
          // Find natural bounding offsets
          const container = document.getElementById('tryon-viewport-container');
          if (container) {
            const containerRect = container.getBoundingClientRect();
            
            // Scaled location conversion from DOM to canvas coordinates
            const scaleX = width / containerRect.width;
            const scaleY = height / containerRect.height;
            
            // Get center coordinates of overlay relative to container
            const overlayLeft = containerRect.width / 2 + position.x;
            const overlayTop = containerRect.height / 2 + position.y;
            
            // Save context, translate, rotate, and scale
            ctx.save();
            ctx.translate(overlayLeft * scaleX, overlayTop * scaleY);
            ctx.rotate((rotation * Math.PI) / 180);
            
            const jewelryWidth = 140 * scale * scaleX;
            const jewelryHeight = 140 * scale * scaleY;
            
            ctx.globalAlpha = opacity;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 4;
            
            // Draw image centered
            ctx.drawImage(
              overlayImage, 
              -jewelryWidth / 2, 
              -jewelryHeight / 2, 
              jewelryWidth, 
              jewelryHeight
            );
            ctx.restore();
          }
        }

        // Overlap brand stamp
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(20, height - 55, 240, 35);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(20, height - 55, 240, 35);
        
        ctx.font = '8px monospace';
        ctx.fillStyle = '#d4af37';
        ctx.fillText("ESSAYAGE VIRTUEL • L'ATELIER AURUM", 30, height - 37);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px sans-serif';
        ctx.fillText(product.name, 30, height - 26);
        
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshotUrl(dataUrl);
      }
      setIsCapturing(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 select-none text-left p-4 overflow-y-auto">
      <div className="absolute inset-0 z-0 bg-radial-gradient from-zinc-950 via-black to-black opacity-95" />
      
      <div 
        className="relative bg-[#090909] border border-zinc-900 rounded-[1px] w-full max-w-5xl mx-auto shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col lg:flex-row z-10"
        style={{ minHeight: '520px' }}
      >
        
        {/* LEFT COLUMN: THE AR VIEWPORT STAGE */}
        <div className="relative flex-1 bg-[#030303] flex items-center justify-center p-2 min-h-[380px] md:min-h-[460px] border-b lg:border-b-0 lg:border-r border-zinc-950">
          
          <div 
            id="tryon-viewport-container"
            className="relative w-full max-w-[620px] aspect-[4/3] bg-[#0c0c0c] border border-zinc-900/60 overflow-hidden flex items-center justify-center"
          >
            {/* 1. Background Source Feed */}
            {activeTab === 'camera' && cameraPermission === 'granted' ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] transition-all duration-300 ${getFilterClass()}`}
              />
            ) : (
              <img
                src={models[selectedModelIndex].url}
                alt="Modèle d'Atelier"
                className={`w-full h-full object-cover transition-all duration-500 ${getFilterClass()}`}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Mirror mode indicator watermark */}
            {activeTab === 'camera' && cameraPermission === 'granted' && (
              <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 text-[7px] font-mono tracking-widest text-zinc-500 uppercase rounded-sm">
                Mode Miroir Actif
              </div>
            )}

            {/* 2. Drag & Drop Jewel Overlay Element */}
            <div
              ref={overlayRef}
              className="absolute z-20 cursor-move touch-none p-4 group/item select-none"
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                width: '160px',
                height: '160px',
                left: 'calc(50% - 80px)',
                top: 'calc(50% - 80px)',
              }}
              onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
              onMouseMove={(e) => handleDrag(e.clientX, e.clientY)}
              onMouseUp={handleEndDrag}
              onMouseLeave={handleEndDrag}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleEndDrag}
            >
              {/* Resizable & Rotatable inner wrapper */}
              <div
                className={`w-full h-full flex items-center justify-center transition-shadow duration-300 ${
                  isDragging ? 'scale-102 ring-1 ring-dashed ring-[#d4af37]/45' : 'group-hover/item:ring-1 group-hover/item:ring-dashed group-hover/item:ring-zinc-700/60'
                }`}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  opacity: opacity,
                }}
              >
                <img
                  id="tryon-jewelry-img"
                  src={product.image}
                  alt={product.name}
                  className="max-w-[110px] max-h-[110px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Little elegant positioning guides */}
              <div className={`absolute top-0 left-0 text-[7px] font-mono text-[#d4af37]/60 pointer-events-none transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
                ⚓ X: {position.x} Y: {position.y}
              </div>
            </div>

            {/* 3. Luxury Ambient HUD Overlay */}
            <div className="absolute inset-0 border border-double border-zinc-900/30 ring-4 ring-inset ring-black/40 pointer-events-none" />

            {/* Instruction tooltip in screen wrapper */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[7.5px] font-mono text-zinc-400 uppercase tracking-widest border border-zinc-900">
                L'Atelier Aurum • Cabine d'AR
              </span>
              <span className="bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[7.5px] font-mono text-[#d4af37] uppercase tracking-widest border border-zinc-900 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                Drape & Glisse le Bijou
              </span>
            </div>

            {/* Golden hour shimmer grains simulation inside canvas */}
            <div className="absolute inset-0 bg-transparent pointer-events-none bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED CONTROL HUD BAR */}
        <div className="w-full lg:w-[380px] p-6 flex flex-col justify-between bg-[#0a0a0a] min-h-[460px]">
          
          {/* Header Description */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-ping" />
                <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-[#d4af37] uppercase">
                  Simulation AR Haute Joaillerie
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-7 w-7 rounded-full flex items-center justify-center bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-[#d4af37] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-light text-white leading-snug">
                {product.name}
              </h3>
              <p className="text-[11px] font-light text-zinc-400 leading-snug">
                Explorez l'éclat de nos créations de prestige sur vous-même grâce à la cabine d'essayage à superposition virtuelle en temps réel.
              </p>
            </div>

            {/* SOURCE SELECTOR TABS */}
            <div className="flex border-b border-zinc-900 py-1 gap-2">
              <button
                type="button"
                onClick={startCamera}
                className={`flex-1 py-1 px-2.5 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border transition-all ${
                  activeTab === 'camera' && cameraPermission === 'granted'
                    ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/35'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-white hover:border-zinc-800'
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                Ma Caméra Live
              </button>
              <button
                type="button"
                onClick={() => {
                  if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                  }
                  setCameraPermission('denied');
                  setActiveTab('model');
                }}
                className={`flex-1 py-1 px-2.5 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border transition-all ${
                  activeTab === 'model'
                    ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/35'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-white hover:border-zinc-800'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Nos Modèles
              </button>
            </div>

            {/* MODEL SELECT PANEL (Renders only if model tab is active) */}
            {activeTab === 'model' && (
              <div className="space-y-2 bg-[#060606] border border-zinc-950 p-3 rounded-sm animate-fade-in">
                <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold block font-mono">
                  Sélectionner un mannequin d'Atelier
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {models.map((m, idx) => {
                    const isSel = selectedModelIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedModelIndex(idx)}
                        className={`relative aspect-[3/4] overflow-hidden rounded-xs border p-0.5 transition-all ${
                          isSel ? 'border-[#d4af37] ring-1 ring-[#d4af37]/40' : 'border-zinc-900 bg-zinc-950 opacity-60'
                        }`}
                      >
                        <img 
                          src={m.url} 
                          alt={m.name} 
                          className="w-full h-full object-cover filter brightness-[0.80]"
                          referrerPolicy="no-referrer"
                        />
                        {isSel && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-[7.5px] font-bold">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[9px] text-zinc-550 leading-relaxed font-sans mt-1">
                  {models[selectedModelIndex].description}
                </p>
              </div>
            )}

            {/* CAMERA WARNING (Renders only if camera permission denied / pending) */}
            {activeTab === 'camera' && cameraPermission === 'denied' && (
              <div className="bg-zinc-950/90 border border-zinc-900 p-3 rounded-sm text-left flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#d4af37] font-bold uppercase tracking-wider">
                    Accès Caméra Bloqué
                  </span>
                  <p className="text-[9px] text-zinc-400 leading-normal">
                    L'accès à votre webcam est bloqué par les restrictions de l'iframe ou de votre navigateur. Veuillez utiliser l'un de nos mannequins d'Atelier ci-dessus pour simuler le porté.
                  </p>
                </div>
              </div>
            )}

            {/* PRECISION DIAL CONTROLS */}
            <div className="space-y-4 bg-zinc-950/60 border border-zinc-900 p-4 rounded-sm">
              <div className="flex items-center justify-between">
                <label className="text-[8.5px] uppercase tracking-widest text-zinc-450 font-bold font-mono">
                  Ajustements de Précision
                </label>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[8px] font-mono text-zinc-500 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  Réinitialiser
                </button>
              </div>

              {/* Slider 1: Dimension (Scale) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                  <span>Taille / Échelle</span>
                  <span className="text-[#d4af37] font-bold">{Math.round(scale * 100)} %</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-3 w-3 text-zinc-650" />
                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-900 appearance-none rounded-lg accent-[#d4af37]"
                    style={{
                      background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(scale - 0.3) / 2.2 * 100}%, #111111 ${(scale - 0.3) / 2.2 * 100}%, #111111 100%)`
                    }}
                  />
                  <ZoomIn className="h-3 w-3 text-zinc-650" />
                </div>
              </div>

              {/* Slider 2: Rotation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                  <span>Inclination / Rotation</span>
                  <span className="text-[#d4af37] font-bold">{rotation} °</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="2"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-900 appearance-none rounded-lg accent-[#d4af37]"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(rotation + 180) / 360 * 100}%, #111111 ${(rotation + 180) / 360 * 100}%, #111111 100%)`
                  }}
                />
              </div>

              {/* Slider 3: Opacity */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                  <span>Intégration d'Ombre / Opacité</span>
                  <span className="text-[#d4af37] font-bold">{Math.round(opacity * 100)} %</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-900 appearance-none rounded-lg accent-[#d4af37]"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(opacity - 0.4) / 0.6 * 100}%, #111111 ${(opacity - 0.4) / 0.6 * 100}%, #111111 100%)`
                  }}
                />
              </div>
            </div>

            {/* ATELIER AMBIANCE LIGHTING FILTERS */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] uppercase tracking-widest text-zinc-550 font-bold font-mono block">
                Filtre d'Éclairage Cabine
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-[8px] font-mono">
                {[
                  { id: 'natural', label: 'Studio Neutre' },
                  { id: 'gold_glow', label: 'Bougie Vendôme' },
                  { id: 'studio_mono', label: 'Épure Noire' },
                  { id: 'vintage', label: 'Orient Vintage' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f.id as FilterType)}
                    className={`py-1.5 text-center border capitalize transition-all ${
                      selectedFilter === f.id
                        ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                        : 'border-zinc-900/60 hover:border-zinc-800 text-zinc-400 bg-zinc-950'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DYNAMIC ACTION TRIGGER (Take Photo Snapshot / Download) */}
          <div className="space-y-3 pt-6 border-t border-zinc-950">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={captureSnapshot}
                disabled={isCapturing}
                className="flex-1 bg-[#d4af37] hover:bg-white text-black text-[9.5px] font-mono font-bold uppercase tracking-widest py-3 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Calcul de l'image...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-3.5 w-3.5" />
                    <span>Prendre un Instantané</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[8px] font-mono text-zinc-600 text-center uppercase tracking-widest">
              L'Atelier Aurum • Sécurisé, aucune donnée stockée
            </div>
          </div>
        </div>
      </div>

      {/* 📸 SNAPSHOT COMPLETED VIEW (MODAL PREVIEW TO DOWLOAD STATELY RES) */}
      <AnimatePresence>
        {snapshotUrl && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 animate-fade-in">
            <div className="absolute inset-0 z-0 bg-radial-gradient from-zinc-950 via-black to-black opacity-95" />
            
            <div className="relative bg-[#0d0d0d] border border-zinc-900 w-full max-w-2xl shadow-2xl overflow-hidden p-6 text-center space-y-6 z-10">
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Instantané d'Atelier Capturé
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSnapshotUrl(null)}
                  className="h-7 w-7 rounded-full flex items-center justify-center bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Snapshot render output */}
              <div className="relative mx-auto max-w-lg aspect-[4/3] bg-zinc-950 border border-zinc-900 overflow-hidden shadow-2xl">
                <img
                  src={snapshotUrl}
                  alt="Instantané d'essayage virtuel"
                  className="w-full h-full object-cover select-all"
                />
              </div>

              <p className="text-[10px] text-zinc-400 italic">
                Félicitations pour votre composition unique. Vous pouvez télécharger cette image pour la partager ou l'examiner à tête reposée.
              </p>

              {/* Options row */}
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSnapshotUrl(null)}
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white text-[9px] font-mono uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Fermer
                </button>
                <a
                  href={snapshotUrl}
                  download={`aurum-tryon-${product.id}.png`}
                  className="px-6 py-2.5 bg-[#d4af37] hover:bg-white text-black text-[9px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <Download className="h-3 w-3" />
                  Télécharger de l'or
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
