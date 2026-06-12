import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, Quote, Award, Play, Video } from 'lucide-react';
import { ProductReview } from '../types';
import LuxuryVideoPlayer from './LuxuryVideoPlayer';
import { AnimatePresence, motion } from 'motion/react';

interface TestimonialsSectionProps {
  reviews: ProductReview[];
  onTriggerTestimonialChat: () => void;
}

export default function TestimonialsSection({ reviews, onTriggerTestimonialChat }: TestimonialsSectionProps) {
  // Track which review currently has its custom video active
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Show all high-rating testimonials (4 and 5 stars)
  const positiveReviews = reviews.filter(rev => rev.rating >= 4);

  return (
    <section className="bg-[#050505] py-24 px-6 md:px-12 border-t border-zinc-900 relative overflow-hidden" id="temoignages-prestige">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10 text-center">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 border border-[#d4af37]/30 bg-[#d4af37]/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4af37] rounded-full">
            <Award className="h-3.5 w-3.5 animate-pulse" />
            L’Émerveillement de Nos Créateurs
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white italic font-light tracking-wide">
            Le Livre d’Or de L’Atelier
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Parce que la perfection s'éprouve dans la transmission, découvrez les témoignages précieux laissés par les acquéreurs de nos pièces d’exception de Haute Joaillerie.
          </p>
        </div>

        {/* Testimonials Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {positiveReviews.slice(0, 6).map((rev) => {
            const isCurrentlyPlaying = playingVideoId === rev.id;

            return (
              <div 
                key={rev.id} 
                className="bg-[#0a0a0a] border border-zinc-900 hover:border-[#d4af37]/30 p-8 rounded-sm text-left flex flex-col justify-between transition-all hover:translate-y-[-4px] shadow-lg shadow-black/40 group relative min-h-[420px]"
              >
                {/* Gold Quote background decoration icon */}
                <div className="absolute top-4 right-6 text-zinc-950 font-serif text-7xl select-none leading-none pointer-events-none group-hover:text-zinc-900/40 transition-colors">
                  ”
                </div>

                <div className="space-y-4">
                  {/* Visual Stars */}
                  <div className="flex gap-1 text-[#d4af37]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#d4af37]" />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {isCurrentlyPlaying && rev.videoUrl ? (
                      <motion.div
                        key="video-player"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="w-full pt-1"
                      >
                        <LuxuryVideoPlayer 
                          src={rev.videoUrl} 
                          onClose={() => setPlayingVideoId(null)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="review-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-zinc-350 leading-relaxed italic font-light min-h-[72px]">
                          « {rev.comment} »
                        </p>

                        {/* Visual video teaser block (Click to play) */}
                        {rev.videoUrl && (
                          <div 
                            onClick={() => setPlayingVideoId(rev.id)}
                            className="relative overflow-hidden rounded-xs border border-zinc-900/80 hover:border-[#d4af37]/40 group/video cursor-pointer transition-all duration-300 bg-black mt-2"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10" />
                            <img 
                              src={rev.videoThumbnail || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300"} 
                              alt="Aperçu vidéo du bijou porté" 
                              className="w-full h-24 object-cover filter brightness-[0.70] group-hover/video:scale-105 group-hover/video:brightness-[0.85] transition-all duration-1000 ease-out"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="h-6 w-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold shadow-lg shadow-[#d4af37]/20 group-hover/video:scale-110 transition-transform">
                                  <Play className="h-2.5 w-2.5 fill-black ml-0.5" />
                                </span>
                                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#faf6f0] drop-shadow-md">
                                  Voir le Rendu Porté ✦
                                </span>
                              </div>
                              <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest bg-black/60 px-1.5 py-0.5">
                                Vidéo HD
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Author & Artisan response Block info */}
                <div className="mt-8 pt-6 border-t border-zinc-950 space-y-4.5">
                  <div>
                    <h4 className="text-xs font-bold text-[#faf6f0]">{rev.authorName}</h4>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-650 mt-1">
                      <span>Acquéreur Privilégié</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>

                  {/* Response bubble from Workshop/Artisan */}
                  {rev.artisanReply && !isCurrentlyPlaying && (
                    <div className="bg-[#050505] border-l-2 border-[#d4af37] p-3 text-[11px] leading-relaxed text-zinc-500 rounded-sm">
                      <span className="font-bold text-[#d4af37] font-serif block italic mb-1">
                        Réponse d'Atelier ({rev.artisanReply.author}) :
                      </span>
                      {rev.artisanReply.comment}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner to collaborate with AI and draft review */}
        <div className="mt-16 bg-[#090909] border border-zinc-900 p-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-left gap-6 shadow-2xl">
          <div className="space-y-1.5 flex-1 pr-0 sm:pr-4">
            <h4 className="text-[#faf6f0] text-sm font-semibold font-serif italic tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#d4af37]" />
               Vivez l’émerveillement, partagez votre histoire
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Déposez votre propre témoignage d'art en discutant directement avec notre Concierge IA. Elle formulera poliment vos mots pour les faire paraître au Livre de l’Atelier.
            </p>
          </div>
          <button
            onClick={onTriggerTestimonialChat}
            className="shrink-0 bg-gradient-to-r from-zinc-950 to-zinc-900 text-zinc-300 border border-[#d4af37]/40 hover:border-[#d4af37] hover:text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4 text-[#d4af37]" />
            Rédiger mon témoignage avec l'IA
          </button>
        </div>

      </div>
    </section>
  );
}
