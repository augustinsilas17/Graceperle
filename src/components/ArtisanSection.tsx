import React from 'react';
import { Hammer, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function ArtisanSection() {
  return (
    <section id="artisanat" className="scroll-mt-20 bg-[#0d0d0d] border-y border-zinc-900 py-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Intro */}
        <div className="flex flex-col mb-16 text-left max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">Le Geste & La Matière</span>
          <h2 className="font-serif text-3xl md:text-4xl italic text-white mt-2 leading-tight">L'Exception de l'Artisanat d'Art</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mt-4">
            Au cœur de notre démarche réside une conviction : chaque perle possède son propre récit. Nos artisans voyagent pour sélectionner des gemmes uniques d'une brillance, d'une pureté et d'une vibration chromatique sans égal, matérialisées dans des designs inimitables.
          </p>
        </div>

        {/* Triple pillars showcasing expert details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="flex flex-col bg-zinc-950/60 border border-zinc-900/60 p-8 hover:border-[#d4af37]/20 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center bg-zinc-900 border border-zinc-800 text-[#d4af37]">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl text-white mt-6">Sourcing Éthique</h3>
            <p className="text-zinc-500 text-xs leading-relaxed mt-3">
              Nous collaborons directement avec des mines familiales locales engagées à Madagascar, au Brésil et en Polynésie afin d'assurer l'origine équitable de nos minéraux et la préservation de la biodiversité.
            </p>
            <ul className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider space-y-2 mt-6 border-t border-zinc-900 pt-6">
              <li>• Gemmes certifiées non-traitées</li>
              <li>• Soutien aux artisans ruraux</li>
              <li>• Emballage 100% recyclable</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col bg-zinc-950/60 border border-zinc-900/60 p-8 hover:border-[#d4af37]/20 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center bg-zinc-900 border border-zinc-800 text-[#d4af37]">
              <Hammer className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl text-white mt-6">Tissage Point par Point</h3>
            <p className="text-zinc-500 text-xs leading-relaxed mt-3">
              Pas de machine, pas d'industrialisation répétitive. Chaque bracelet ou sac est noué ou tissé à la main à l'aide de fils haute densité brevetés pouvant résister à des décennies de porter sans jamais céder.
            </p>
            <ul className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider space-y-2 mt-6 border-t border-zinc-900 pt-6">
              <li>• Technique du micro-macramé</li>
              <li>• Tissage haute tension japonais</li>
              <li>• Jusqu'à 48 heures de travail par pièce</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col bg-zinc-950/60 border border-zinc-900/60 p-8 hover:border-[#d4af37]/20 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center bg-zinc-900 border border-zinc-800 text-[#d4af37]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl text-white mt-6">Métaux Précieux</h3>
            <p className="text-zinc-500 text-xs leading-relaxed mt-3">
              Pour assurer l'éclat de vos modèles, nos apprêts et fermoirs sont forgés en laiton recyclé puis plaqués d'un épais manteau d'or fin 18 ou 24 carats, garantissant durabilité, tenue et tolérance cutanée parfaite.
            </p>
            <ul className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider space-y-2 mt-6 border-t border-zinc-900 pt-6">
              <li>• Plaqué Or 3 microns certifié</li>
              <li>• Métal anallergique sans nickel</li>
              <li>• Traitement anti-ternissement</li>
            </ul>
          </div>

        </div>

        {/* Material spotlight card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20 items-center border border-zinc-900 bg-zinc-950/20 p-8 sm:p-12">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">Le Guide des Perles</span>
            <h3 className="font-serif text-2xl text-white mt-2 leading-tight">Matières Nobles et Minéraux Merveilleux</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mt-4">
              Explorez les gemmes signature de notre atelier. Chacune possède des caractéristiques uniques conférées par des millions d'années d'histoire géologique terrestre.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Nacre d'Eau Douce Royale</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Formée naturellement au sein de coquillages protégés pour des nuances lactées irisées de rose et de blanc.</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Jade Forêt Sauvage</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Une roche dure millénaire polie miroir conférant une sensation de toucher soyeux et rafraîchissant unique.</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Pierre de Soleil (Sunstone)</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Contient des micro-inclusions d'hématite miroitantes qui renvoient des éclats chauds et chatoyants au soleil.</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Onyx Noir Intense</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Un noir impérieux absolu poli de manière ultra-mate pour créer un contraste fort d'une sobriété royale.</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video lg:aspect-square w-full overflow-hidden bg-zinc-900 border border-zinc-800">
            {/* Displaying an elegant luxury micro shot */}
            <img 
              src="/src/assets/images/hero_bead_jewelry_1781216953070.jpg" 
              alt="Artisan assembling beads" 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white">Savoir-Faire Labellisé</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Certifié Artisan d'Art Relieur-Chaînier</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
