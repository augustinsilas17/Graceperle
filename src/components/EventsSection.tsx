import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight, Check, Sparkles, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Inquiry } from '../types';

interface EventsSectionProps {
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
}

interface WorkshopEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  dateStr: string;
  dateVal: string;
  timeStr: string;
  duration: string;
  price: number;
  capacityLeft: number;
  image: string;
  badge: string;
}

interface BackstageImage {
  url: string;
  caption: string;
  role: string;
  detail: string;
}

const BACKSTAGE_IMAGES: BackstageImage[] = [
  {
    url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=85&w=800",
    caption: "Le geste millimétré sous loupe binoculaire",
    role: "Atelier Sertissage",
    detail: "Ajustement micrométrique des griffes d'un fermoir d'art en or 750/1000."
  },
  {
    url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=85&w=800",
    caption: "Sélection rigoureuse des orients et diamètres",
    role: "Lustrage & Tri",
    detail: "Appairage méticuleux de perles d'exception pour les futures parures."
  },
  {
    url: "https://images.unsplash.com/photo-1531747118685-ca3fa6e39865?auto=format&fit=crop&q=85&w=800",
    caption: "L'esquisse préparatoire d'un modèle d'exception",
    role: "bureau de Création",
    detail: "Chaque pièce naît d'une gouache préparatoire au cœur de Paris."
  },
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=85&w=800",
    caption: "L'écrin confidentiel du 12 Place Vendôme",
    role: "Showroom Privé",
    detail: "Le salon feutré d'exposition où nous recevons nos amateurs d'art."
  },
  {
    url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=85&w=800",
    caption: "Polissage de finition des montures d'art",
    role: "Atelier Joaillerie",
    detail: "Technique ancestrale d'avivage pour révéler la brillance maximale du métal précieux."
  }
];

const WORKSHIP_EVENTS: WorkshopEvent[] = [
  {
    id: 'ws-initiation',
    title: "Atelier Initiation au Tissage Impérial",
    subtitle: "Tissage de perles d'eau douce & fil de soie naturelle",
    description: "Initiez-vous aux secrets ancestraux du nouage sur soie. Notre maître-artisan vous guidera pour composer et tisser votre propre bracelet d'exception que vous emporterez chez vous.",
    dateStr: "Samedi 20 Juin 2026",
    dateVal: "2026-06-20",
    timeStr: "14:00 - 16:30",
    duration: "2h30",
    price: 85,
    capacityLeft: 6,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    badge: "Le plus plébiscité"
  },
  {
    id: 'ws-masterclass',
    title: "Masterclass Perles Marines & Or Fin",
    subtitle: "Perles rares de Tahiti, Akoya & fermoirs d'art",
    description: "Une expérience immersive pour manipuler des perles de Tahiti aux lustres miroirs profonds et des perles japonaises Akoya. Créez un collier choker de haute voltige monté sur fil d'or fin 18 carats.",
    dateStr: "Jeudi 25 Juin 2026",
    dateVal: "2026-06-25",
    timeStr: "18:30 - 21:30",
    duration: "3h00",
    price: 150,
    capacityLeft: 4,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    badge: "Prestige d'exception"
  },
  {
    id: 'ws-family',
    title: "Séance Éclosion Parent-Enfant",
    subtitle: "Duo de nacre créatif • Moment de transmission",
    description: "Partagez la passion de la haute joaillerie avec votre enfant. Ensemble, imaginez et concevez deux parures précieuses coordonnées dans un écrin de perles de nacre multi-teintes ludiques.",
    dateStr: "Dimanche 28 Juin 2026",
    dateVal: "2026-06-28",
    timeStr: "10:30 - 12:30",
    duration: "2h00",
    price: 110,
    capacityLeft: 8,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    badge: "Idéal Fêtes"
  },
  {
    id: 'ws-vernissage',
    title: "Conférence & Vernissage Privé",
    subtitle: "Lancement de la Collection d'Orient Vendôme",
    description: "Une soirée exclusive réservée aux amateurs d'art et d'orients perliers. Conférence scientifique par notre gemmologue de renom, découverte de pièces d'archives, champagne brut et accords précieux.",
    dateStr: "Vendredi 3 Juillet 2026",
    dateVal: "2026-07-03",
    timeStr: "19:30 - 22:30",
    duration: "3h00",
    price: 0,
    capacityLeft: 12,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
    badge: "Invitation exclusive"
  }
];

export default function EventsSection({ onAddInquiry }: EventsSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<WorkshopEvent | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Booking Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [personalNote, setPersonalNote] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleOpenBooking = (event: WorkshopEvent) => {
    setSelectedEvent(event);
    setIsBookingOpen(true);
    setFormSuccess(false);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedEvent(null);
    // clean states
    setName('');
    setEmail('');
    setPhone('');
    setTicketCount(1);
    setPersonalNote('');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !name || !email) return;

    const messageTemplate = `Demande de réservation pour l'atelier d'art : "${selectedEvent.title}" prévu le ${selectedEvent.dateStr} à ${selectedEvent.timeStr}.
Nombre de places souhaitées : ${ticketCount} place(s).
Tarif unitaire : ${selectedEvent.price === 0 ? 'Gratuit ( invitation )' : `${selectedEvent.price} €`}.
Message / demande d'aménagement : "${personalNote || 'Aucun message spécifique.'}"`;

    onAddInquiry({
      name,
      email,
      phone,
      type: 'workshop_booking' as any, // This will be parsed cleanly in App.tsx
      productId: selectedEvent.id,
      message: messageTemplate
    });

    setFormSuccess(true);
    setTimeout(() => {
      handleCloseBooking();
    }, 3800);
  };

  // Backstage custom photo carousel state
  const [backstageIndex, setBackstageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBackstageIndex((prev) => (prev + 1) % BACKSTAGE_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevBackstage = () => {
    setBackstageIndex((prev) => (prev - 1 + BACKSTAGE_IMAGES.length) % BACKSTAGE_IMAGES.length);
  };

  const handleNextBackstage = () => {
    setBackstageIndex((prev) => (prev + 1) % BACKSTAGE_IMAGES.length);
  };

  return (
    <section className="bg-black py-20 px-6 md:px-12 border-t border-zinc-900 overflow-hidden" id="ateliers-evenements">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header & Studio Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 text-left items-stretch" id="atelier-header-carousel-grid">
          {/* Left Column: Explanations & Credentials */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#d4af37] uppercase block font-bold">
                Vendôme Expérience Showroom
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white font-medium leading-tight">
                Événements & <br className="hidden md:inline" />Ateliers Privés
              </h2>
              <div className="h-0.5 w-16 bg-[#d4af37]/60" />
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans pt-2">
                Prenez part à la haute joaillerie de vos propres mains. Rejoignez notre showroom intimiste parisien pour des sessions d'initiation éphémères guidées par nos maîtres-artisans et gemmologues diplômés d'État.
              </p>
            </div>
            
            <div className="border border-zinc-900 bg-zinc-950/40 p-4 space-y-2.5 rounded-[1px]">
              <div className="flex items-center gap-2 text-[#d4af37] text-[10px] font-mono font-bold uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span>Exigence Orfèvre & Savoir-faire</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                Chaque perle d'eau douce ou de culture marine qui franchit notre atelier de la Place Vendôme fait l'objet d'un examen rigoureux de son éclat, de son calibre et de sa lueur sous la lumière naturelle de Paris.
              </p>
            </div>
          </div>
          
          {/* Right Column: Dynamic Backstage Carousel */}
          <div className="lg:col-span-7 flex flex-col justify-between" id="atelier-backstage-carousel">
            <div className="relative aspect-video w-full overflow-hidden border border-zinc-900 bg-zinc-950 rounded-[1px] group/carousel flex flex-col justify-end">
              
              {/* Backstage Images Display (Framer-motion powered slider) */}
              <div className="absolute inset-0 w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={backstageIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={BACKSTAGE_IMAGES[backstageIndex].url}
                      alt={BACKSTAGE_IMAGES[backstageIndex].caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover brightness-[0.55] saturate-[1.1] transition-transform duration-[6000ms] ease-out scale-100 group-hover/carousel:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Top luxury headers on overlay */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-zinc-900 text-[8px] font-mono font-bold uppercase tracking-widest text-[#d4af37]">
                  Coulisses de l'Atelier • Live
                </span>
                <span className="px-2 py-0.5 bg-[#d4af37] text-black text-[8px] font-mono font-bold uppercase tracking-widest rounded-[2px]">
                  {BACKSTAGE_IMAGES[backstageIndex].role}
                </span>
              </div>

              {/* Bottom content overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
              
              <div className="relative z-10 p-5 md:p-6 text-left space-y-1.5 pointer-events-none">
                <h4 className="font-serif text-sm md:text-base text-white font-medium">
                  {BACKSTAGE_IMAGES[backstageIndex].caption}
                </h4>
                <p className="text-[11px] text-zinc-450 font-sans leading-relaxed tracking-wide max-w-md">
                  {BACKSTAGE_IMAGES[backstageIndex].detail}
                </p>
              </div>

              {/* Dynamic Progress Slide Bar underlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-90 w-full z-20">
                <motion.div 
                  key={backstageIndex}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                  className="h-full bg-[#d4af37]"
                />
              </div>

              {/* Arrow navigation overlays */}
              <button
                type="button"
                onClick={handlePrevBackstage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full border border-white/10 bg-black/75 backdrop-blur-sm text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/35 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all active:scale-95 cursor-pointer"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextBackstage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full border border-white/10 bg-black/75 backdrop-blur-sm text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/35 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all active:scale-95 cursor-pointer"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Pagination Bullet Indicators & Manual Switcher */}
            <div className="flex items-center justify-between mt-3 px-1 font-mono text-[9px] text-zinc-550 uppercase tracking-widest">
              <span className="text-zinc-500 font-mono">
                Image {backstageIndex + 1} sur {BACKSTAGE_IMAGES.length}
              </span>
              <div className="flex items-center gap-2">
                {BACKSTAGE_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBackstageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === backstageIndex ? "w-5 bg-[#d4af37]" : "w-1.5 bg-zinc-800 hover:bg-zinc-650"}`}
                    aria-label={`Aller à l'image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKSHIP_EVENTS.map((event) => (
            <div 
              key={event.id}
              className="relative flex flex-col bg-zinc-950/65 border border-zinc-900 rounded-[1px] overflow-hidden group hover:border-[#d4af37]/45 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Event Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-zinc-900 shrink-0">
                <img 
                  src={event.image} 
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/40" />
                
                {/* Event badging */}
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-[#d4af37]/20 text-[#d4af37] text-[7.5px] font-mono tracking-widest uppercase font-bold py-1 px-2.5 rounded-full z-10">
                  {event.badge}
                </span>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-zinc-150 text-[10px] font-mono font-bold">
                  <Calendar className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{event.duration} d'atelier</span>
                </div>
              </div>

              {/* Event Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide block">{event.dateStr}</span>
                    <h3 className="font-serif text-sm font-semibold text-white tracking-wide leading-snug group-hover:text-[#d4af37] transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  
                  <p className="text-[10px] text-[#d4af37]/80 font-mono tracking-wider uppercase leading-tight font-medium">
                    {event.subtitle}
                  </p>
                  
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                {/* Metrics and Action Footer */}
                <div className="space-y-4 pt-3 border-t border-zinc-900/60 font-mono text-[10px]">
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Clock className="h-3.5 w-3.5 text-[#d4af37]/75 shrink-0" />
                      <span>{event.timeStr.split(" - ")[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 justify-end">
                      <Users className="h-3.5 w-3.5 text-[#d4af37]/75 shrink-0" />
                      <span className="truncate">{event.capacityLeft} places dispo.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] text-zinc-500 uppercase">Tarif par participant</span>
                      <span className="text-sm font-bold text-white font-serif">
                        {event.price === 0 ? "Gratuit / Invité" : `${event.price} €`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(event)}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-[#d4af37] hover:text-black text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] text-[9px] font-bold uppercase tracking-widest transition-all rounded-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>S'inscrire</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Small Trust Info Panel */}
        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest text-center border border-zinc-900 bg-zinc-950/20 py-2.5 px-4 rounded-sm">
          <MapPin className="h-3.5 w-3.5 text-[#d4af37]" />
          <span>Showroom physique de prestige : 12 Place Vendôme, 75001 Paris • Ateliers limités à 8 participants</span>
        </div>

      </div>

      {/* Booking Light Overlay Dialog Modal */}
      <AnimatePresence>
        {isBookingOpen && selectedEvent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" id="booking-modal">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={handleCloseBooking} />

            {/* Content Container Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#090909] border border-zinc-900 p-6 rounded-[2px] shadow-2xl z-10 flex flex-col text-left space-y-4"
            >
              {/* Form Close button */}
              <button 
                onClick={handleCloseBooking}
                className="absolute top-4 right-4 text-zinc-500 hover:text-[#d4af37] p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title Header bar */}
              <div className="space-y-1 text-left border-b border-zinc-900 pb-3">
                <span className="text-[8px] font-mono tracking-widest text-[#d4af37] uppercase font-bold">
                  Formulaire d'Inscription d'exception
                </span>
                <h3 className="font-serif text-lg text-white">Réservation d'Atelier d'Art</h3>
                <p className="text-[10px] text-zinc-400 font-mono font-semibold uppercase">{selectedEvent.title}</p>
              </div>

              {formSuccess ? (
                <div className="py-12 text-center space-y-4 animate-fade-in flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-emerald-900/40 bg-zinc-950 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="font-serif text-white font-medium text-sm">Demande d'Inscription Transmise !</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Votre demande de réservation pour le <strong className="text-[#d4af37]">{selectedEvent.dateStr}</strong> a été enregistrée avec succès sous la référence <code className="text-[9px] bg-zinc-950 font-mono px-1 rounded-sm text-zinc-200">#EVT-{Math.floor(Math.random() * 9000 + 1000)}</code>.
                    </p>
                    <p className="text-[10px] text-zinc-500 font-serif italic pt-1.5">
                      "Un artisan d'Atelier prendra contact par e-mail sous 24h ouvrées pour valider vos coordonnées de participation."
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  {/* Detailed event summary brief recall */}
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-sm space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between text-zinc-400 font-bold">
                      <span>Date de l'Atelier :</span>
                      <span className="text-[#d4af37]">{selectedEvent.dateStr}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Horaire précis :</span>
                      <span>{selectedEvent.timeStr}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 border-t border-zinc-900/60 pt-1.5">
                      <span>Tarif unitaire :</span>
                      <span className="font-serif text-white">
                        {selectedEvent.price === 0 ? "Gratuit / Invitation" : `${selectedEvent.price} €`}
                      </span>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Votre Nom Complet</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Éléonore de Vendôme"
                        className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] rounded-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid grid-cols-1 gap-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Adresse E-mail</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@adresse.com"
                          className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] rounded-xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Téléphone</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] rounded-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center pt-1 border-t border-zinc-900/65">
                      <div className="space-y-0.5">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold block">Nombre de participants</label>
                        <span className="text-[8px] text-zinc-650 font-mono block">Limité à {selectedEvent.capacityLeft} places</span>
                      </div>
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          className="w-7 h-7 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:border-[#d4af37]/50 rounded-full transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-mono font-bold text-white w-5 text-center">{ticketCount}</span>
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.min(selectedEvent.capacityLeft, ticketCount + 1))}
                          className="w-7 h-7 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:border-[#d4af37]/50 rounded-full transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Notes / Demande Spécifique (optionnel)</label>
                      <textarea
                        rows={2}
                        value={personalNote}
                        onChange={(e) => setPersonalNote(e.target.value)}
                        placeholder="Ex: Allergie, aménagement d'accessibilité, option chèque cadeau..."
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none rounded-xs"
                      />
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#d4af37] hover:bg-white text-black text-xs font-bold uppercase tracking-widest text-center transition-colors rounded-[1px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Soumettre ma demande d'inscription
                    </button>
                    <p className="text-center text-[8px] text-zinc-550 italic font-mono pt-2 leading-relaxed">
                      Conformément à notre charte haut de gamme, l'envoi de ce formulaire n'engage aucun paiement immédiat. Les règlements s'effectuent sur place ou par lien sécurisé d'Atelier après entretien.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
