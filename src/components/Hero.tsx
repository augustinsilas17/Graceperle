import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Play, Pause, Compass, Star, Trophy, ArrowRightLeft, ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onExploreClick: () => void;
  onDiyClick: () => void;
}

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  materials: string[];
  artisan: string;
  timeToCreate: string;
  description: string;
  price: number;
}

export default function Hero({ onExploreClick, onDiyClick }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isImmersiveFullscreen, setIsImmersiveFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  // Custom refined slides using distinct, breathtaking high-luxury Unsplash photography of diamonds, pearls, and gold crafting.
  // These are completely separate from standard catalog images to prevent any duplication.
  const SLIDES: SlideData[] = [
    {
      id: 'slide_hero_1',
      title: "L'Aura d'Exception",
      subtitle: "Un maillage céleste en nacre et or liquide",
      tagline: "Pièce Unique Impériale - Atelier Paris Vendôme",
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
      materials: ["Perles baroques d'eau douce", "Or fin 24k", "Diamants bruts"],
      artisan: "Aurélie Martin",
      timeToCreate: "14 heures d'orfévrerie",
      description: "Une union sculpturale et impériale alliant l'asymétrie sauvage des perles de feu au lustre hypnotique de l'or ciselé à la main.",
      price: 490
    },
    {
      id: 'slide_hero_2',
      title: "Mystère d'Orient",
      subtitle: "L'éclat miroir des plus belles perles salées",
      tagline: "Savoir-Faire Séculaire - Sélection Joaillerie",
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      materials: ["Perles Akoya japonaises", "Or rose 18k", "Nacre d'huître sacrée"],
      artisan: "Jean-Baptiste Clauzel",
      timeToCreate: "9 heures d'appairage précis",
      description: "Des gemmes d'un lustre velouté incomparable, récoltées avec patience au cœur d'Orient et serties sur une monture solaire.",
      price: 360
    },
    {
      id: 'slide_hero_3',
      title: "Secrets Célestes",
      subtitle: "Des larmes de nacre aux reflets cosmiques",
      tagline: "Création d'Art Unique - Édition Prestige d'Atelier",
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200',
      materials: ["Perles de Tahiti vert paon", "Fils de soie fine", "Or blanc 18k"],
      artisan: "Nicolas Berger",
      timeToCreate: "18 heures de tissage d'art",
      description: "Une cascade poétique aux tonalités vert paon et aubergine, dont chaque perle a été brodée à la main sous l'œil exigeant du créateur.",
      price: 680
    }
  ];

  // Auto scroll slides with safety checks
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [isHovered, SLIDES.length]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  // Video controller helper
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Interactive HTML5 gold dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
      glowIntensity: number;
    }[] = [];

    // Create initial golden particles
    const particleCount = Math.min(120, Math.floor((width * height) / 8500));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.0 + 0.5,
        speedX: (Math.random() - 0.5) * 0.28,
        speedY: (Math.random() - 0.5) * 0.18 - 0.15, // float up slowly
        opacity: Math.random() * 0.75 + 0.15,
        fadeSpeed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        glowIntensity: Math.random() * 18 + 6
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse transition
      const mouse = mouseRef.current;
      if (mouse.targetX !== -1000) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Draw mouse glow
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 1, mouse.x, mouse.y, 130);
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 130, 0, Math.PI * 2);
        ctx.fill();
      }

      particles.forEach((p) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Interactive mouse gravity push/pull
        if (mouse.targetX !== -1000) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        // Boundary checks
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Sparkle / Opacity shine fluctuation
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.90 || p.opacity < 0.10) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Draw
        ctx.shadowBlur = p.glowIntensity;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.08, Math.min(0.95, p.opacity))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Clear shadows for performance
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fullscreen gold dust animation
  useEffect(() => {
    if (!isImmersiveFullscreen) return;
    const canvas = fullscreenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
    }[] = [];

    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.2 - 0.22,
        opacity: Math.random() * 0.8 + 0.1,
        fadeSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.90 || p.opacity < 0.10) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.1, Math.min(0.9, p.opacity))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isImmersiveFullscreen]);

  const enterFullscreenMode = () => {
    setIsImmersiveFullscreen(true);
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    }
  };

  const exitFullscreenMode = () => {
    setIsImmersiveFullscreen(false);
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const activeData = SLIDES[activeSlide];

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#070707] px-6 py-24 lg:px-12 xl:px-16"
    >
      {/* 🎬 1. ANIMATED LIVE VIDEO BACKGROUND LAYER (More prominent for maximum luxury) */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-[0.38] scale-105 filter brightness-50 contrast-[1.12] saturate-[0.6] transition-all duration-1000"
          src="https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particles-looping-background-40082-large.mp4"
          onError={(e) => {
            console.log('Video background failed, using Canvas static fallback');
          }}
        />
        {/* Luxuriously layered dark gradients with real-time shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/95" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* 🎨 2. CUSTOM CROSS-FADING AND ANIMATED BACKGROUND IMAGES (Ken Burns effect) */}
      <div className="absolute inset-0 -z-40 overflow-hidden">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-30 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover brightness-[0.22] saturate-[0.7] contrast-[1.05] ${
                index === activeSlide ? 'animate-slow-zoom' : 'scale-100'
              }`}
            />
          </div>
        ))}
        {/* Soft floating golden orbs of light for immersive glow */}
        <div className="absolute top-1/4 left-1/3 -z-20 h-[380px] w-[380px] rounded-full bg-[#d4af37]/4 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 -z-20 h-[480px] w-[480px] rounded-full bg-amber-900/4 blur-[140px] animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* ✨ 3. DYNAMIC HTML5 CANVAS FOR GOLD STARDUST PARTICLES */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-25 h-full w-full pointer-events-none"
      />

      {/* 👑 4. CORE WRAPPER CONTAINER */}
      <div className="mx-auto w-full max-w-7xl pt-8 z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Main Visual Left content Column */}
          <div className="flex flex-col justify-center space-y-7 text-left lg:col-span-7">
            
            {/* Fine Luxury Badge */}
            <div className="inline-flex items-center gap-3.5 w-fit bg-black/60 backdrop-blur-md px-4 py-2 border border-[#d4af37]/30 rounded-full">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d4af37]"></span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#d4af37] font-mono">
                Atelier Aurum • Reine de Nacre
              </span>
              <span className="h-[10px] w-[1px] bg-zinc-800"></span>
              <span className="text-[8px] text-zinc-400 font-medium uppercase tracking-widest hidden sm:inline">
                Haute Joaillerie Parisienne
              </span>
            </div>

            {/* Magnificent Header Slogan with staggered text effects */}
            <div className="space-y-3">
              <span className="block font-serif text-[13px] tracking-widest uppercase text-[#d4af37]/90 font-light pl-1">
                {activeData.tagline}
              </span>
              <h1 className="font-serif text-5xl font-extralight leading-[1.1] text-white md:text-7xl lg:text-7xl xl:text-8xl">
                L'Incomparable <br />
                <span className="font-sans font-extrabold not-italic text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fdfbf6] to-[#d4af37] relative">
                  {activeData.title}
                  <span className="absolute -bottom-2.5 left-0 h-[1.5px] w-1/4 bg-gradient-to-r from-[#d4af37] to-transparent"></span>
                </span>
              </h1>
            </div>

            {/* Subtext description with elegant spacing and font weighting */}
            <p className="max-w-xl text-xs leading-relaxed text-zinc-300 md:text-sm font-light font-sans">
              {activeData.description} <strong className="text-[#d4af37]/95 font-medium font-serif italic text-sm">Chaque perle est une symphonie éternelle tissée à la main d'or pur</strong>, façonnée pour inspirer l'émerveillement absolu et une distinction d'exception.
            </p>

            {/* Large Interactive Call to Actions with Sweep/Shine animation */}
            <div className="flex flex-wrap items-center gap-4.5 pt-4">
              <button
                onClick={onExploreClick}
                className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] via-[#f7df94] to-[#d4af37] px-9 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#050505] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg shadow-[#d4af37]/15 rounded-[1px]"
              >
                {/* Visual Gold Sweep Effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none" />
                <span className="flex items-center gap-2">
                  Découvrir la Collection d'Art
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform group-hover:translate-x-1.5" />
                </span>
              </button>

              <button
                onClick={onDiyClick}
                className="group flex items-center gap-2 bg-black/85 backdrop-blur border border-zinc-850 px-8 py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5f2ed] hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all duration-300 active:scale-[0.98] cursor-pointer rounded-[1px]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37] transition-all group-hover:rotate-12 group-hover:scale-110" />
                Créer Votre Bijou d'Atelier
              </button>
            </div>

            {/* Mini Carousel Slide Selectors (Interactive Dots) */}
            <div className="flex items-center gap-3.5 pt-8">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                Expositions :
              </span>
              <div className="flex items-center gap-2">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={`dot-${slide.id}`}
                    onClick={() => setActiveSlide(idx)}
                    className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
                    title={slide.title}
                  >
                    <div className={`h-2.5 transition-all duration-300 rounded-full ${
                      idx === activeSlide 
                        ? 'w-10 bg-[#d4af37]' 
                        : 'w-2.5 bg-zinc-850 group-hover:bg-zinc-600'
                    }`} />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                0{activeSlide + 1} / 0{SLIDES.length}
              </span>
            </div>

          </div>

          {/* Right Column: Stunning Interactive Showcase Frame with Fluid Sliding Image Transitions */}
          <div className="lg:col-span-5 relative flex flex-col justify-center items-center lg:items-end">
            
            {/* The active showcasing sliding image frame */}
            <div className="relative group/frame h-[330px] w-[260px] sm:h-[430px] sm:w-[320px] xl:h-[470px] xl:w-[350px] transition-transform duration-500 hover:scale-[1.01]">
              
              {/* Outer floating golden frame offset lines */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 border border-[#d4af37]/35 pointer-events-none transition-transform duration-500 group-hover/frame:translate-x-2 group-hover/frame:translate-y-2 z-0" />
              <div className="absolute inset-0 -translate-x-2 -translate-y-2 border border-zinc-900 pointer-events-none z-0" />

              {/* Core Image container featuring sliding "défilement" structure */}
              <div className="absolute inset-0 bg-zinc-950 overflow-hidden shadow-2xl border border-zinc-900 z-10">
                
                {/* SLIDER WRAPPER - Horizontal transition sliding cards on active state */}
                <div className="relative h-full w-full">
                  {SLIDES.map((slide, index) => {
                    const isCurrent = index === activeSlide;
                    return (
                      <div
                        key={`frame-img-${slide.id}`}
                        className={`absolute inset-0 w-full h-full transition-all duration-[1100ms] cubic-bezier(0.25, 1, 0.5, 1) ${
                          isCurrent 
                            ? 'translate-x-0 opacity-100 z-20 scale-100' 
                            : index < activeSlide
                            ? '-translate-x-full opacity-0 z-10 scale-95'
                            : 'translate-x-full opacity-0 z-10 scale-95'
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover select-none"
                        />
                        
                        {/* Dark sleek gradient overlays to hold text elegantly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Top Label Tag */}
                        <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 border border-zinc-800 text-[8px] tracking-[0.25em] text-[#d4af37] font-bold uppercase rounded-[1px]">
                          <Trophy className="h-3 w-3 shrink-0" />
                          <span>Maison d'Or</span>
                        </div>

                        {/* Right luxury price tag */}
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-[#d4af37] to-[#e2c15a] text-black text-[10px] font-mono font-bold px-3.5 py-1.5 shadow-lg">
                          {slide.price} € *
                        </div>

                        {/* Plein Écran Option on the Image itself */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enterFullscreenMode();
                          }}
                          className="absolute top-[64px] right-6 z-30 bg-black/85 hover:bg-[#d4af37] hover:text-black border border-zinc-900 hover:border-[#d4af37] text-[#d4af37] text-[7.5px] font-mono font-bold uppercase tracking-widest px-2.5 py-1.5 flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95"
                          title="Immersion Plein Écran"
                        >
                          <Maximize className="h-2.5 w-2.5" />
                          <span>Plein Écran</span>
                        </button>

                        {/* Bottom Slide Info Overlay Text */}
                        <div className="absolute bottom-6 left-6 right-6 text-left">
                          <span className="text-[8px] font-bold uppercase tracking-[0.3em] font-mono text-[#d4af37]/85 block">
                            CRÉATION VENDÔME
                          </span>
                          <h3 className="font-serif text-2xl italic text-white mt-1 font-light tracking-wide">
                            {slide.title}
                          </h3>
                          <p className="text-[10px] text-zinc-350 mt-1 pl-0.5 truncate max-w-xs">
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Left/Right manual slide navigation icons positioned on sides for prestige control */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 backdrop-blur-sm border border-zinc-900 text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/50 active:scale-90 transition-all cursor-pointer"
                  aria-label="Pièce précédente"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 backdrop-blur-sm border border-zinc-900 text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/50 active:scale-90 transition-all cursor-pointer"
                  aria-label="Pièce suivante"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>

              </div>
            </div>

            {/* Floating Glass Curator Spec Sheet (shows behind or right side on desktop) */}
            <div className="mt-8 lg:mt-0 lg:absolute lg:-bottom-12 lg:-left-16 z-25 w-full max-w-[290px] bg-zinc-950/90 backdrop-blur-xl border border-zinc-900 p-5 shadow-2xl shadow-black/90 text-left">
              <div className="absolute top-0 right-0 h-10 w-[100px] bg-gradient-to-bl from-[#d4af37]/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-3 border-b border-zinc-900 pb-2">
                <Compass className="h-4 w-4 text-[#d4af37] animate-spin-slow" />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-300 font-mono">
                  Savoir-Faire & Matières
                </span>
              </div>

              {/* Spec lines with interactive dynamic content update */}
              <div className="space-y-2.5">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold block">Maître artisan en charge</span>
                  <span className="text-xs text-white font-medium pl-1 border-l border-[#d4af37]/65 mt-0.5 block">
                    {activeData.artisan}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold block">Temps dévolu à l'Élite</span>
                  <span className="text-[11px] text-zinc-300 font-mono pl-1 border-l border-zinc-800 mt-0.5 block flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                    {activeData.timeToCreate}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold block">Matières Précieuses Sélectionnées</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeData.materials.map((mat, i) => (
                      <span key={i} className="text-[8px] font-semibold bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2 py-0.5 rounded-[2px]">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 🔇 Floating Video Theme controller */}
      <button
        onClick={toggleVideoPlay}
        className="absolute bottom-16 left-6 z-20 flex h-7 bg-zinc-950/80 hover:bg-zinc-950 backdrop-blur border border-zinc-850 px-3 items-center justify-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-[#d4af37] cursor-pointer transition-colors"
        title={isVideoPlaying ? 'Mettre en pause l\'ambiance vidéo' : 'Lancer l\'ambiance vidéo'}
      >
        {isVideoPlaying ? (
          <>
            <Pause className="h-2.5 w-2.5" />
            <span className="hidden sm:inline">Ambiance active</span>
          </>
        ) : (
          <>
            <Play className="h-2.5 w-2.5 fill-current" />
            <span className="hidden sm:inline">Activer l'ambiance</span>
          </>
        )}
      </button>

      {/* Luxury Moving/Animated Marquee Band below hero content */}
      <div className="absolute bottom-0 left-0 right-0 h-11 bg-zinc-950/95 backdrop-blur-sm border-t border-b border-zinc-900/60 overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap text-[8.5px] font-mono uppercase tracking-[0.25em] text-[#d4af37]/85">
          <span className="mx-4 text-[#d4af37]">✦ PERLES DE TAHITI CERTIFIÉES</span>
          <span className="mx-4 text-zinc-400">✦ JADE IMPÉRIAL & PIERRE DE SOLEIL</span>
          <span className="mx-4 text-[#d4af37]">✦ FAÇONNÉ À LA MAIN À PARIS VENDÔME</span>
          <span className="mx-4 text-zinc-400">✦ PLACAGE OR PATINÉ 24 ET 18 CARATS</span>
          <span className="mx-4 text-[#d4af37]">✦ ÉCRIN DE PRÉPARATION PRESTIGE</span>
          <span className="mx-4 text-zinc-400">✦ CONCIERGERIE DISPONIBLE 24/7 EN LIGNE</span>
          {/* Duplicate marquee items for endless loop */}
          <span className="mx-4 text-[#d4af37]">✦ PERLES DE TAHITI CERTIFIÉES</span>
          <span className="mx-4 text-zinc-400">✦ JADE IMPÉRIAL & PIERRE DE SOLEIL</span>
          <span className="mx-4 text-[#d4af37]">✦ FAÇONNÉ À LA MAIN À PARIS VENDÔME</span>
          <span className="mx-4 text-zinc-400">✦ PLACAGE OR PATINÉ 24 ET 18 CARATS</span>
          <span className="mx-4 text-[#d4af37]">✦ ÉCRIN DE PRÉPARATION PRESTIGE</span>
          <span className="mx-4 text-zinc-400">✦ CONCIERGERIE DISPONIBLE 24/7 EN LIGNE</span>
        </div>
      </div>

      {/* 🌌 FULLSCREEN CONTEMPORARY IMMERSION GALLERY */}
      <AnimatePresence>
        {isImmersiveFullscreen && (
          <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black select-none text-left animate-fade-in" id="fullscreen-immersion-hud">
            {/* 1. Immersive Video Loop Background */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover opacity-65 filter brightness-45 contrast-[1.12]"
                src="https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particles-looping-background-40082-large.mp4"
                ref={fullscreenVideoRef}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/85" />
            </div>

            {/* 2. Interactive Gold Particle Canvas Overlay */}
            <canvas
              ref={fullscreenCanvasRef}
              className="absolute inset-0 z-10 w-full h-full pointer-events-none"
            />

            {/* 3. Immersive Center jewel gallery (Sleek frame with transition) */}
            <div className="relative z-20 flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-16 gap-8 md:gap-12 max-w-7xl mx-auto w-full">
              
              {/* Back button option or arrows on left/right edges */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950/70 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-zinc-900 hover:border-[#d4af37] transition-all cursor-pointer active:scale-95"
                aria-label="Pièce précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Master jewel picture slot */}
              <div className="relative aspect-[3/4] h-[45vh] md:h-[62vh] max-h-[580px] bg-zinc-950/40 border border-[#d4af37]/35 shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden group">
                <img
                  src={activeData.image}
                  alt={activeData.title}
                  className="h-full w-full object-cover transition-transform duration-[8000ms] ease-out scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 bg-[#d4af37] text-black text-[7.5px] font-mono font-bold tracking-[0.25em] uppercase px-2 py-0.5">
                  HAUTE JOAILLERIE
                </span>
              </div>

              {/* Information presentation HUD */}
              <div className="space-y-6 md:max-w-md bg-black/85 backdrop-blur-md p-6 md:p-8 border border-zinc-900 rounded-[1px] w-full">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4af37] uppercase block font-bold">
                    {activeData.tagline}
                  </span>
                  <h2 className="font-serif text-2xl md:text-4xl text-white font-light tracking-wide leading-tight">
                    {activeData.title}
                  </h2>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {activeData.description}
                  </p>
                </div>

                <div className="h-[1px] w-full bg-zinc-900" />

                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-zinc-400">
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-zinc-550 uppercase font-bold">Maître d'Art</span>
                    <span className="text-white block font-sans">{activeData.artisan}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-zinc-550 uppercase font-bold">Temps de confection</span>
                    <span className="text-white block">{activeData.timeToCreate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold block font-mono">
                    Matières de Sélection
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeData.materials.map((mat, i) => (
                      <span key={i} className="text-[8.5px] font-mono bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2 py-0.5">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Micro mobile arrows */}
                <div className="flex md:hidden items-center justify-between pt-4 border-t border-zinc-900/60 mt-4">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="flex h-9 px-4 items-center justify-center gap-1.5 bg-zinc-950/80 text-zinc-455 hover:text-[#d4af37] border border-zinc-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-[9px] font-mono uppercase">Précédent</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="flex h-9 px-4 items-center justify-center gap-1.5 bg-zinc-950/80 text-zinc-455 hover:text-[#d4af37] border border-zinc-900"
                  >
                    <span className="text-[9px] font-mono uppercase">Suivant</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950/70 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-zinc-900 hover:border-[#d4af37] transition-all cursor-pointer active:scale-95"
                aria-label="Pièce suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

            </div>

            {/* 4. Immersive Header Status HUD Bar (Luxury branding indicators) */}
            <div className="absolute top-0 inset-x-0 p-6 z-30 flex items-center justify-between border-b border-zinc-900/35 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className="bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-[8px] font-mono tracking-widest uppercase py-1 px-2.5">
                  Immersion Totale Ateliers Vendôme
                </span>
                <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase hidden sm:inline">
                  • Résolution 4K Ambiance
                </span>
              </div>

              <button
                type="button"
                onClick={exitFullscreenMode}
                className="px-4 py-2 bg-[#d4af37] hover:bg-white text-black text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] rounded-xs"
              >
                <Minimize className="h-3.5 w-3.5" />
                Quitter l'immersion
              </button>
            </div>

            {/* 5. Immersive Footer Credits */}
            <div className="absolute bottom-0 inset-x-0 p-5 z-30 flex items-center justify-between border-t border-zinc-900/40 bg-gradient-to-t from-black/85 to-transparent text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>© L'Atelier Aurum • Reine de Nacre Paris</span>
              <span>Défilement immersif : 0{activeSlide + 1} / 0{SLIDES.length}</span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
