import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUp, Send, Heart, Mail, Compass, Star, FileText, Search, SlidersHorizontal, User, ArrowRightLeft } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArtisanSection from './components/ArtisanSection';
import CharteSection from './components/CharteSection';
import DiyBuilder from './components/DiyBuilder';
import ProductCard from './components/ProductCard';
import ProductDrawer from './components/ProductDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import ProfileModal from './components/ProfileModal';
import CheckoutModal from './components/CheckoutModal';
import AiChatWidget from './components/AiChatWidget';
import ContactSection from './components/ContactSection';
import TestimonialsSection from './components/TestimonialsSection';
import EventsSection from './components/EventsSection';
import CompareModal from './components/CompareModal';
import { PRODUCTS } from './data';
import { Product, Inquiry, CartItem, UserProfile, Order, ProductReview } from './types';
import { INITIAL_REVIEWS } from './initialReviews';

export default function App() {
  // Navigation & Category states
  const [selectedCategory, setSelectedCategory] = useState<'tout' | 'freshwater' | 'saltwater' | 'gemstone' | 'crafting'>('tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  // E-commerce & Interactive lists
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  
  // Cart, Profile, Checkout, and Order states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [customNote, setCustomNote] = useState<string>('');
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [chatWidgetInitialInput, setChatWidgetInitialInput] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  
  // UI drawers / modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showInquiriesPanel, setShowInquiriesPanel] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  // Initialize wishlist, inquiries, cart, profile & orders from local storage
  useEffect(() => {
    let currentWishlist: Product[] = [];
    const savedWishlist = localStorage.getItem('aurum_wishlist');
    if (savedWishlist) {
      try {
        currentWishlist = JSON.parse(savedWishlist);
        setWishlist(currentWishlist);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }

    // Read shared wishlist from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sharedIds = urlParams.get('wishlist') || urlParams.get('shared');
    if (sharedIds) {
      const ids = sharedIds.split(',');
      const importedProducts = PRODUCTS.filter(p => ids.includes(p.id));
      if (importedProducts.length > 0) {
        const merged = [...currentWishlist];
        importedProducts.forEach(p => {
          if (!merged.some(item => item.id === p.id)) {
            merged.push(p);
          }
        });
        setWishlist(merged);
        localStorage.setItem('aurum_wishlist', JSON.stringify(merged));
        setIsWishlistOpen(true);
        setImportedCount(importedProducts.length);

        // Auto dismiss imported banner after 7 seconds
        setTimeout(() => setImportedCount(null), 7000);

        // Clear query parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }

    const savedInquiries = localStorage.getItem('aurum_inquiries');
    if (savedInquiries) {
      try {
        setInquiries(JSON.parse(savedInquiries));
      } catch (e) {
        console.error('Failed to parse inquiries', e);
      }
    }

    const savedCart = localStorage.getItem('aurum_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    const savedProfile = localStorage.getItem('aurum_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }

    const savedOrders = localStorage.getItem('aurum_orders');
    if (savedOrders) {
      try {
        setOrderHistory(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }

    const savedReviews = localStorage.getItem('aurum_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Failed to parse reviews', e);
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('aurum_reviews', JSON.stringify(INITIAL_REVIEWS));
    }

    // Scroll top visibility listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      
      // Determine active section in nav on scroll
      const sections = ['hero', 'vitrine', 'artisanat', 'atelier-diy', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -200 && rect.top <= 400) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save changes to local storage
  const updateWishlist = (newWishlist: Product[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('aurum_wishlist', JSON.stringify(newWishlist));
  };

  const handleAddToWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      updateWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      updateWishlist([...wishlist, product]);
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    updateWishlist(wishlist.filter(item => item.id !== product.id));
  };

  const handleClearWishlist = () => {
    updateWishlist([]);
  };

  const handleToggleCompare = (product: Product) => {
    const exists = compareProducts.some(p => p.id === product.id);
    if (exists) {
      setCompareProducts(compareProducts.filter(p => p.id !== product.id));
    } else {
      if (compareProducts.length >= 3) {
        setCompareError("Vous pouvez séléctionner jusqu'à 3 bijoux pour comparer.");
        setTimeout(() => setCompareError(null), 5000);
        return;
      }
      setCompareProducts([...compareProducts, product]);
    }
  };

  const handleRemoveFromCompare = (product: Product) => {
    setCompareProducts(compareProducts.filter(p => p.id !== product.id));
  };

  const handleClearCompare = () => {
    setCompareProducts([]);
  };

  // Save cart & profile changes helper functions
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aurum_cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (productId: string, quantity = 1) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existingIndex = cart.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
      const copy = [...cart];
      copy[existingIndex].quantity += quantity;
      updateCart(copy);
    } else {
      updateCart([...cart, { product, quantity }]);
    }
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      updateCart(cart.filter(item => item.product.id !== productId));
    } else {
      updateCart(cart.map(item => item.product.id === productId ? { ...item, quantity } : item));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    updateCart(cart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    updateCart([]);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('aurum_profile', JSON.stringify(updatedProfile));
  };

  const handleAddChatTestimonial = (authorName: string, comment: string, rating: number) => {
    const newReview: ProductReview = {
      id: `rev_chat_${Date.now()}`,
      productId: undefined,
      authorName,
      authorEmail: `${authorName.toLowerCase().replace(/\s+/g, '')}@temoignage.fr`,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      artisanReply: {
        author: 'Aurélie Martin',
        comment: 'Toute l\'équipe de l\'Atelier est extrêmement touchée par votre magnifique témoignage en direct. Merci infiniment !',
        date: new Date().toISOString().split('T')[0],
      }
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('aurum_reviews', JSON.stringify(updated));
  };

  const handleOrderSuccess = (order: Order) => {
    const updatedHistory = [order, ...orderHistory];
    setOrderHistory(updatedHistory);
    localStorage.setItem('aurum_orders', JSON.stringify(updatedHistory));
    updateCart([]); // Clear cart on success
    setIsCheckoutOpen(false);
  };

  // Inquiry processing
  const handleAddInquiry = (newInquiryData: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const freshInquiry: Inquiry = {
      ...newInquiryData,
      id: `inq_${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'pending'
    };

    const updatedInquiries = [freshInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    localStorage.setItem('aurum_inquiries', JSON.stringify(updatedInquiries));
  };

  const handleAddReview = (newReview: ProductReview) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('aurum_reviews', JSON.stringify(updated));
  };

  // Filtered products list
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'tout' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured products list for the home page showcase section
  const featuredProducts = PRODUCTS.filter(p => p.isFeatured);

  const jumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f2ed] font-sans antialiased overflow-x-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/3 left-0 -z-10 h-72 w-72 rounded-full bg-[#d4af37]/3 blur-3xl lg:h-96 lg:w-96" />
      <div className="absolute bottom-1/4 right-12 -z-10 h-80 w-80 rounded-full bg-[#d4af37]/2 blur-3xl lg:h-[450px] lg:w-[450px]" />

      {/* Navigation Header */}
      <Navbar
        wishlist={wishlist}
        openWishlist={() => setIsWishlistOpen(true)}
        cart={cart}
        openCart={() => setIsCartOpen(true)}
        profile={profile}
        openProfile={() => setIsProfileOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onDiyClick={() => jumpToSection('atelier-diy')}
      />

      {/* Hero Showcase Section */}
      <Hero
        onExploreClick={() => jumpToSection('vitrine')}
        onDiyClick={() => jumpToSection('atelier-diy')}
      />

      {/* Featured Products Section (Les Joyaux Vedettes) */}
      <section id="featured-products" className="scroll-mt-20 border-t border-zinc-900/60 bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0c] to-[#0a0a0a] py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">Les Joyaux Vedettes</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light italic text-white mt-3 tracking-wide">Créations d'Exception & Best-Sellers</h2>
            <div className="mx-auto mt-4 h-[1px] w-24 bg-[#d4af37]/30" />
            <p className="mx-auto mt-4 max-w-lg text-zinc-400 text-xs leading-relaxed">
              Une sélection rigoureuse de nos pièces de joaillerie les plus demandées et de nos dernières créations signatures élues par les artisans de l'Atelier.
            </p>
          </div>

          {/* Featured Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map(product => (
              <div 
                key={`featured-${product.id}`}
                className="relative group bg-zinc-950/20 border border-zinc-900 overflow-hidden transition-all duration-300 hover:border-[#d4af37]/45"
              >
                {/* Visual marker */}
                <div className="absolute top-4 right-4 z-10 flex h-7 items-center justify-center bg-black/60 backdrop-blur-md px-3 border border-[#d4af37]/40">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    Coup de Coeur
                  </span>
                </div>

                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900/40 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>

                <div className="p-6 text-left">
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-[#d4af37]">
                    {product.category === 'freshwater' 
                      ? 'Perles d’Eau Douce' 
                      : product.category === 'saltwater' 
                      ? 'Perles de Mer' 
                      : product.category === 'gemstone' 
                      ? 'Pierres Fines' 
                      : 'Kits & Fournitures'}
                  </span>
                  <h3 className="font-serif text-xl text-white mt-1 group-hover:text-[#d4af37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-zinc-500 text-xs italic mt-1 font-sans">
                    Réalisé par {product.artisan} — {product.timeToCreate}
                  </p>
                  
                  <p className="text-zinc-400 text-xs leading-relaxed mt-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">Estimation de l'artisan</span>
                      <p className="font-serif text-lg font-bold text-[#faf6f0]">{product.price} €</p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#faf6f0] text-black text-[9px] font-extrabold uppercase tracking-widest px-4 py-2 hover:bg-[#d4af37] hover:scale-105 transition-all"
                    >
                      Découvrir la Pièce
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Organized Product Catalog Section */}
      <section id="vitrine" className="scroll-mt-20 py-24 px-6 md:px-12 border-t border-zinc-900/80 bg-[#0a0a0a] relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-[#d4af37]/2 blur-3xl" />
        
        <div className="mx-auto max-w-7xl">
          
          {/* Catalog Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 border-b border-zinc-900 pb-10 text-left">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-[#d4af37]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">Le Grand Catalogue</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl italic text-white leading-tight">La Galerie des Perles d'Art</h2>
              <p className="text-zinc-500 text-xs md:text-sm max-w-xl leading-relaxed">
                Explorez notre collection structurée et trouvez la création qui correspond à votre sensibilité. Filtrez par catégorie et recherchez des matières spécifiques.
              </p>
            </div>

            {/* Catalog Live Real-time Search Box */}
            <div className="mt-8 lg:mt-0 relative w-full lg:max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une perle, matière, artisan..."
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#d4af37]/75 px-4.5 py-3 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/20 transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[10px] text-zinc-500 hover:text-[#d4af37]"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Interactive Navigation Catalog Grid Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {([
              { id: 'tout', label: 'Tout Explorer', count: PRODUCTS.length },
              { id: 'freshwater', label: 'Perles d’Eau Douce', count: PRODUCTS.filter(p => p.category === 'freshwater').length },
              { id: 'saltwater', label: 'Perles de Mer (Akoya/Tahiti)', count: PRODUCTS.filter(p => p.category === 'saltwater').length },
              { id: 'gemstone', label: 'Gemmes & Pierres Fines', count: PRODUCTS.filter(p => p.category === 'gemstone').length },
              { id: 'crafting', label: 'Matériel & Accessoires', count: PRODUCTS.filter(p => p.category === 'crafting').length }
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  // Clean query sometimes if they change tab to let them explore fully
                }}
                className={`flex flex-col items-center justify-between p-4 border text-center transition-all ${
                  selectedCategory === tab.id
                    ? 'border-[#d4af37] bg-[#d4af37]/5 text-white'
                    : 'border-zinc-900 bg-zinc-950/25 text-zinc-400 hover:border-zinc-800 hover:text-white hover:bg-zinc-950/50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block leading-tight">{tab.label}</span>
                <span className="text-[9px] font-mono mt-3 px-2 py-0.5 bg-zinc-900/90 text-zinc-500 border border-zinc-800/60 rounded-xs block">
                  {tab.count} créations
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Category Description & Education Card Panel */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
            <div className="space-y-1.5 flex-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Guide d'Achat & Connaissances :
                <span className="text-white normal-case font-mono font-normal">
                  {selectedCategory === 'tout' ? 'L\'intégralité' : selectedCategory === 'freshwater' ? 'Perles d\'Eau Douce' : selectedCategory === 'saltwater' ? 'Perles d\'Eau de Mer' : selectedCategory === 'gemstone' ? 'L\'éclat des minéraux' : 'Fournitures de Joaillerie'}
                </span>
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-4xl">
                {selectedCategory === 'tout' && "Bienvenue dans l'intégralité de notre showroom de perlerie précieuse d'art. Chacune de ces pièces a été minutieusement conçue et testée pour sa pérennité."}
                {selectedCategory === 'freshwater' && "Formées au cœur des rivières et des lacs, les perles d’eau douce (Freshwater) se distinguent par leur variété infinie de formes organiques blanches et crème, offrant un charme poétique, robuste et résistant."}
                {selectedCategory === 'saltwater' && "Joyaux marins par excellence, les perles de mer d'Akoya, de Tahiti et des Mers du Sud captivent par leur lustre miroir parfait, leurs diamètres impressionnants et leurs teintes spectaculaires d’orient anthracite ou doré."}
                {selectedCategory === 'gemstone' && "Sélectionnées pour leur éclat et leurs vibrations pures, nos gemmes naturelles solides — des pierres de soleil cuivrées au lapis-lazuli d'un bleu cobalt profond — insufflent couleur brute et singularité à nos bracelets."}
                {selectedCategory === 'crafting' && "Libérez votre âme d’artisan. Retrouvez ici la même sélection premium de fournitures que celle de nos ateliers : fermoirs exclusifs plaqués or fin 18 carats, fils de soie de haute durabilité et kits créatifs guidés."}
              </p>
            </div>
            
            <div className="shrink-0 flex gap-2 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              <span className="border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-center">Fait Main</span>
              <span className="border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-center">Certifié Perle</span>
            </div>
          </div>

          {/* Products Catalog Display Grid */}
          {filteredProducts.length === 0 ? (
            <div className="border border-dashed border-zinc-900 py-20 px-6 text-center space-y-4">
              <p className="text-zinc-500 font-serif text-sm italic">Aucun joyau ne correspond exactement à votre recherche.</p>
              <p className="text-[11px] text-zinc-650 max-w-md mx-auto">
                Essayez d'utiliser des termes plus génériques comme "Perle", "Or", "Lapis", ou explorez une autre catégorie en utilisant les boutons d'accès ci-dessus.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('tout');
                  setSearchQuery('');
                }}
                className="inline-block border border-zinc-800 px-6 py-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={wishlist.some(item => item.id === product.id)}
                  onAddToCart={handleAddToCart}
                  onToggleCompare={handleToggleCompare}
                  isInCompare={compareProducts.some(p => p.id === product.id)}
                />
              ))}
            </div>
          )}
          
        </div>
      </section>

      {/* Craftsmanship & Lore Stories Section */}
      <ArtisanSection />

      {/* Charte de Confiance, Qualité et Éthique de l'Atelier */}
      <CharteSection />

      {/* Interactive Custom DIY Builder Playground */}
      <DiyBuilder onAddInquiry={handleAddInquiry} />

      {/* Dynamic Livre d'Or Client Testimonials Column */}
      <TestimonialsSection 
        reviews={reviews} 
        onTriggerTestimonialChat={() => {
          setChatWidgetInitialInput("Je souhaite rédiger un témoignage d'émerveillement pour votre site !");
          setIsChatWidgetOpen(true);
        }}
      />

      {/* Contact & Private Commisssions Form */}
      <ContactSection onAddInquiry={handleAddInquiry} />

      {/* Événements & Ateliers de Prestige */}
      <EventsSection onAddInquiry={handleAddInquiry} />

      {/* Footer Branding Area */}
      <footer className="bg-[#050505] border-t border-zinc-900 py-16 px-6 md:px-12 text-zinc-500 text-xs">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left">
          
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-serif text-lg tracking-widest text-[#d4af37]">AURUM BEADS</h3>
            <p className="text-[11px] leading-relaxed text-zinc-500 pr-4">
              Vitrine de joaillerie d'art et créateur de maroquinerie de perles. Chaque perle est un univers de reflets façonnés avec amour sous le ciel parisien.
            </p>
            <div className="flex gap-4 pt-1 text-zinc-400">
              <span className="hover:text-[#d4af37] cursor-pointer">Instagram</span>
              <span className="hover:text-[#d4af37] cursor-pointer">Pinterest</span>
              <span className="hover:text-[#d4af37] cursor-pointer">Showroom 75001</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-3">Sections Vitrine</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => jumpToSection('hero')} className="hover:text-white">Accueil Prestige</button></li>
              <li><button onClick={() => jumpToSection('vitrine')} className="hover:text-white">Collections Pierres Fines</button></li>
              <li><button onClick={() => jumpToSection('artisanat')} className="hover:text-white">Techniques de Tissage</button></li>
              <li><button onClick={() => jumpToSection('atelier-diy')} className="hover:text-white">Créateur DIY interactif</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-3">Informations Légales</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="hover:text-white cursor-pointer">Conditions d'Acquisition Privée</li>
              <li className="hover:text-white cursor-pointer">Garantie & Entretien des Gemmes</li>
              <li className="hover:text-white cursor-pointer">Politique d'Expédition Assurée</li>
              <li className="hover:text-white cursor-pointer">Crédits de l'Atelier</li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Inquiries / Demandes</h4>
            <button
              onClick={() => setShowInquiriesPanel(true)}
              className="w-full flex items-center justify-center gap-1.5 border border-zinc-800 bg-[#0c0c0c] px-3.5 py-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:border-[#d4af37]/60 hover:text-white transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-[#d4af37]" />
              Mes Devis ({inquiries.length})
            </button>
            <p className="text-[9px] text-zinc-650 leading-relaxed font-mono">
              Enregistré localement dans votre navigateur sécurisé.
            </p>
          </div>

        </div>

        <div className="mx-auto max-w-7xl border-t border-zinc-950 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-wide text-zinc-600">
            © {new Date().getFullYear()} Aurum Beads S.A.S. Tous droits réservés. Haute Joaillerie de Perles.
          </p>
          
          <div className="flex gap-2">
            <span className="text-[10px] text-zinc-650 border border-zinc-900 bg-zinc-950 px-2.5 py-0.5 uppercase tracking-widest">
              Showroom Paris Vendôme
            </span>
          </div>
        </div>
      </footer>

      {/* Slide Drawer: Product Details Info */}
      <ProductDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddInquiry={handleAddInquiry}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Slide Drawer: Wishlist Cart Drawer */}
      {isWishlistOpen && (
        <WishlistDrawer
          wishlist={wishlist}
          onClose={() => setIsWishlistOpen(false)}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onAddInquiry={handleAddInquiry}
          onClearWishlist={handleClearWishlist}
        />
      )}

      {/* Drawer: Sent Inquiries Panel (Bespoke details tracking in-app) */}
      {showInquiriesPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setShowInquiriesPanel(false)} />
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-[#0d0d0d] border-l border-zinc-900 text-[#f5f2ed] shadow-2xl flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#d4af37]" />
                  <h3 className="font-serif text-lg italic text-white font-normal">Mes Devis & Réservations</h3>
                </div>
                <button
                  onClick={() => setShowInquiriesPanel(false)}
                  className="p-1 rounded-sm text-zinc-400 hover:text-[#d4af37] hover:bg-zinc-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Inquiries list body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {inquiries.length === 0 ? (
                  <div className="text-center py-20 text-zinc-500 space-y-3">
                    <p className="text-xs">Aucun projet ou devis soumis pour le moment.</p>
                    <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
                      Utilisez notre Atelier de Création DIY ou notre formulaire de réservation produit pour envoyer votre première idée créative à notre maître-artisan !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-sm space-y-2.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] font-mono font-bold bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            {inq.type === 'custom_diy' ? 'Création DIY' : inq.type === 'product_reservation' ? 'Réservation' : inq.type === 'workshop_booking' ? 'Atelier Paris' : 'Projet Privé'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-600">{inq.date}</span>
                        </div>
                        
                        <div className="text-xs space-y-1 font-mono">
                          <p className="text-[#f5f2ed] font-semibold">Client: {inq.name}</p>
                          <p className="text-zinc-500">Email: {inq.email}</p>
                        </div>

                        {inq.customDesignDetails && (
                          <div className="bg-zinc-900/60 p-2.5 rounded-xs border border-zinc-800/40 text-[10px] font-mono text-[#d4af37] leading-relaxed">
                            {inq.customDesignDetails}
                          </div>
                        )}

                        <p className="text-[11px] text-zinc-400 leading-relaxed italic border-t border-zinc-900/60 pt-2 font-serif">
                          "{inq.message}"
                        </p>

                        <div className="border-t border-zinc-900/80 pt-2 flex justify-between items-center text-[10px]">
                          <span className="text-zinc-600">Statut de l'Atelier</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-widest text-[9px]">
                            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Reçue - Analyse
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button: Back to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-30 flex h-10 w-10 items-center justify-center bg-[#d4af37]/90 text-black border border-[#d4af37] transition-all hover:bg-[#d4af37] hover:scale-110 active:scale-95 shadow-md shadow-black/80 rounded-full"
          aria-label="Remonter en haut de page"
        >
          <ArrowUp className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}

      {/* Slide Drawer: Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
          profile={profile}
          appliedDiscount={appliedDiscount}
          onApplyDiscount={setAppliedDiscount}
          customNote={customNote}
          onUpdateCustomNote={setCustomNote}
        />
      )}

      {/* Modal: Customer Profile Fields Form */}
      {isProfileOpen && (
        <ProfileModal
          profile={profile}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Modal: Direct Checkout simulated methods */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          cart={cart}
          profile={profile}
          totalPrice={Math.round(cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) * (1 - appliedDiscount / 100))}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Floating Conversational AI Concierge Chatbot Widget */}
      <AiChatWidget
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onAddTestimonial={handleAddChatTestimonial}
        isOpen={isChatWidgetOpen}
        onOpenChange={setIsChatWidgetOpen}
        initialUserInput={chatWidgetInitialInput}
      />

      {/* Floating Compare Panel (Bottom-Left) */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm bg-zinc-950/95 border border-[#d4af37]/35 shadow-2xl rounded-sm p-4 backdrop-blur-md animate-fade-in flex flex-col gap-3">
          {compareError && (
            <div className="absolute -top-12 left-0 right-0 bg-amber-950 border border-amber-500 text-amber-200 text-[10px] uppercase tracking-wider font-mono py-1.5 px-3 rounded-sm shadow-md text-center animate-pulse">
              {compareError}
            </div>
          )}
          
          <div className="flex items-center justify-between gap-6 border-b border-zinc-900 pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] font-mono">
                Comparateur ({compareProducts.length}/3)
              </span>
            </div>
            
            <button 
              onClick={handleClearCompare}
              className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              Vider
            </button>
          </div>

          <div className="flex items-center justify-between gap-5">
            {/* Round Mini Avatars Grid */}
            <div className="flex items-center gap-2">
              {compareProducts.map(product => (
                <div 
                  key={`comp-item-${product.id}`}
                  className="relative group h-9 w-9 rounded-full border border-zinc-900 overflow-hidden bg-zinc-900 cursor-help"
                  title={product.name}
                >
                  <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveFromCompare(product)}
                    className="absolute inset-0 bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500 cursor-pointer"
                    title="Retirer"
                  >
                    <X className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              ))}
              
              {/* Empty Comparison slots with plus indicators */}
              {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                <div 
                  key={`comp-slot-${i}`}
                  className="h-9 w-9 rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-700 text-[10px] font-mono"
                >
                  +
                </div>
              ))}
            </div>

            {/* Direct Open Modal compare link */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="bg-[#d4af37] hover:bg-white text-black font-semibold text-[9px] uppercase tracking-[0.18em] px-4 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer rounded-[1px] shadow-sm"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Comparer
            </button>
          </div>
        </div>
      )}

      {/* Side-by-side Compare Modal Matrix */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedProducts={compareProducts}
        onRemoveFromCompare={handleRemoveFromCompare}
        onAddToCart={handleAddToCart}
      />

      {/* Floating Wishlist Imported Notification */}
      {importedCount !== null && (
        <div className="fixed top-24 right-6 z-50 max-w-sm bg-zinc-950/95 border border-[#d4af37] shadow-xl p-4 rounded-sm backdrop-blur-md animate-fade-in flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af37] font-mono">
              ÉCRIN PARTAGÉ IMPORTÉ
            </span>
            <button 
              onClick={() => setImportedCount(null)}
              className="text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-serif italic">
            "Félicitations ! Vous avez importé avec succès la sélection d'exception ({importedCount} bijou{importedCount > 1 ? 'x' : ''}) partagée par votre proche."
          </p>
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest pt-1 border-t border-zinc-900 block">
            MAISON AURUM VENDÔME
          </span>
        </div>
      )}

    </div>
  );
}

// Inline Close SVG Icon Helper since we had X from Lucide but just in case
function X({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
