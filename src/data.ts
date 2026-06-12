import { Product, BeadOption, CharmOption } from './types';

export const HERO_IMAGE = '/src/assets/images/hero_bead_jewelry_1781216953070.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'fw_1',
    name: 'Le Collier d\'Aura Baroque',
    category: 'freshwater',
    price: 145,
    image: '/src/assets/images/collier_nacre_1781216990305.jpg',
    description: 'Une création asymétrique moderne alliant le lustre sauvage des véritables perles d\'eau douce baroques et une chaîne contemporaine en plaqué or 24 carats. Une pièce de caractère raffinée.',
    features: [
      'Véritables perles d\'eau douce baroques blanches sélectionnées à la main',
      'Chaîne à maillons rectangulaires texturés en plaqué or 24 et 18 carats',
      'Fermoir bijou invisible très sécurisé',
      'Fini hypoallergénique, résistant à l\'eau'
    ],
    materials: ['Perles d\'Eau Douce Baroques', 'Plaqué Or 24k', 'Laiton Recyclé'],
    stockStatus: 'piece_unique',
    timeToCreate: '5 heures',
    artisan: 'Aurélie Martin',
    rating: 4.9,
    isFeatured: true
  },
  {
    id: 'fw_2',
    name: 'Bracelet Impérial de Nacre',
    category: 'freshwater',
    price: 85,
    image: '/src/assets/images/freshwater_pearls_collection_1781217726747.jpg',
    description: 'Composé d\'un rang parfait de perles d\'eau douce parfaitement rondes au fini blanc crème satiné. Ce bracelet de joaillerie classique est rehaussé d\'un discret médaillon d\'Atelier.',
    features: [
      'Perles d\'eau douce de culture de grade AAA (7.5mm)',
      'Fermoir mousqueton en or jaune fin 18 carats',
      'Fil de soie naturelle noué individuellement entre chaque perle',
      'Élasticité et tenue optimales testées en atelier'
    ],
    materials: ['Perles d\'Eau Douce AAA', 'Or Jaune 18k', 'Fil de Soie'],
    stockStatus: 'edition_limitee',
    stockCount: 4,
    timeToCreate: '3 heures',
    artisan: 'Élodie Dupond',
    rating: 4.8,
    isFeatured: false
  },
  {
    id: 'fw_3',
    name: 'Boucles d\'Oreilles Rosée Céleste',
    category: 'freshwater',
    price: 75,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
    description: 'De délicates gouttes de perles d\'eau douce suspendues à de fins anneaux dorés à l\'or fin. Un mouvement fluide et d\'une élégance intemporelle pour habiller votre port de tête.',
    features: [
      'Paire de perles d\'eau douce en forme de poire',
      'Anneaux créoles fins de 15mm plaqués or 24k',
      'Monture solide garantissant aucune perte de gemme',
      'Chaque perle est parfaitement appairée en éclat et dimension'
    ],
    materials: ['Perles d\'Eau Douce Poire', 'Plaqué Or 24k'],
    stockStatus: 'disponible',
    timeToCreate: '2 heures',
    artisan: 'Nicolas Berger',
    rating: 5.0,
    isFeatured: true
  },
  {
    id: 'sw_1',
    name: 'Le Sautoir Nuée de Tahiti',
    category: 'saltwater',
    price: 390,
    image: '/src/assets/images/saltwater_pearls_collection_1781217683657.jpg',
    description: 'Une pièce maîtresse de notre collection. Ce collier somptueux présente de véritables perles de Tahiti aux reflets vert paon, gris anthracite et aubergine d\'une profondeur mystique exceptionnelle.',
    features: [
      'Véritables perles de Tahiti de grade A récoltées en Polynésie',
      'Couleurs naturelles spectaculaires sans aucun traitement thermique',
      'Fermoir de sécurité barillet usiné en or vert 18 carats',
      'Livré avec certificat officiel d\'évaluation gemmologique'
    ],
    materials: ['Perles de Tahiti de Culture', 'Or Vert 18k', 'Fil d\'Acier Gainé'],
    stockStatus: 'piece_unique',
    timeToCreate: '12 heures',
    artisan: 'Jean-Baptiste Clauzel',
    rating: 5.0,
    isFeatured: true
  },
  {
    id: 'sw_2',
    name: 'Puces d\'Oreilles Akoya d\'Orient',
    category: 'saltwater',
    price: 180,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800',
    description: 'L\'élégance absolue. Les perles de culture Akoya japonaises sont reconnues mondialement pour leur lustre incomparable et leur blancheur immaculée rehaussée de délicats reflets rosés.',
    features: [
      'Perles Akoya du Japon de 8mm de diamètre',
      'Tiges et poussettes de sécurité à friction en or blanc 18 carats',
      'Lustre "Miroir" d\'une netteté parfaite',
      'Fini de surface lisse exceptionnel (sans imperfection visible)'
    ],
    materials: ['Perles Akoya Japonaises', 'Or Blanc 18k'],
    stockStatus: 'edition_limitee',
    stockCount: 6,
    timeToCreate: '2 heures',
    artisan: 'Aurélie Martin',
    rating: 4.7,
    isFeatured: false
  },
  {
    id: 'sw_3',
    name: 'Bague Reine des Mers du Sud',
    category: 'saltwater',
    price: 290,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    description: 'Une splendide perle dorée des Mers du Sud nichée au cœur d\'un anneau sculptural en laiton plaqué d\'or 24 carats. Un éclat solaire envoûtant.',
    features: [
      'Perle des Mers du Sud dorée naturelle de 10mm',
      'Monture brossée à la main au design organique fluide',
      'Placage or 24k de 3 microns d\'épaisseur',
      'Taille de l\'anneau ajustable délicatement à l\'atelier'
    ],
    materials: ['Perle dorée des Mers du Sud', 'Placage Or 24k 3 Recyclé'],
    stockStatus: 'piece_unique',
    timeToCreate: '6 heures',
    artisan: 'Jean-Baptiste Clauzel',
    rating: 4.9,
    isFeatured: false
  },
  {
    id: 'gs_1',
    name: 'Bracelet Éclat Lunaire Divine',
    category: 'gemstone',
    price: 85,
    image: '/src/assets/images/bracelet_precieux_1781216966141.jpg',
    description: 'Une alliance céleste de pierre de soleil cuivrée, de nacre d\'un blanc pur et d\'intercalaires en relief dorés à l\'or fin. Un modèle lumineux phare de notre atelier.',
    features: [
      'Perles de soleil et nacre de grade A de 6mm',
      'Petites billes facettées en hématite dorée',
      'Assemblage haute résistance, confortable au porter',
      'Chaque perle présente des inclusions cristallines scintillantes uniques'
    ],
    materials: ['Pierre de Soleil', 'Nacre Naturelle', 'Hématite Dorée'],
    stockStatus: 'edition_limitee',
    stockCount: 12,
    timeToCreate: '3 heures',
    artisan: 'Aurélie Martin',
    rating: 4.9,
    isFeatured: true
  },
  {
    id: 'gs_2',
    name: 'Ras-de-Cou Lapis Impérial',
    category: 'gemstone',
    price: 120,
    image: '/src/assets/images/gemstone_beads_collection_1781217696207.jpg',
    description: 'Idéal pour rehausser une tenue sombre avec élégance. Un rang dense de lapis-lazuli d\'un bleu cobalt royal profond, parsemé d\'éclats de pyrite dorée naturelle.',
    features: [
      'Perles rondes de lapis-lazuli naturel de grade AA',
      'Fermoir bouée massif en laiton doré à l\'or fine 18 carats',
      'Longueur ras-de-cou de 38 cm + 5 cm de chaîne de rallonge',
      'Couleur royale intense garantie sans coloration artificielle'
    ],
    materials: ['Lapis-Lazuli', 'Laiton Doré Or Fin 18k'],
    stockStatus: 'disponible',
    timeToCreate: '4 heures',
    artisan: 'Élodie Dupond',
    rating: 4.8,
    isFeatured: false
  },
  {
    id: 'gs_3',
    name: 'Le Cabas Bento de Jade Sauvage',
    category: 'gemstone',
    price: 245,
    image: '/src/assets/images/sac_perles_vert_1781217005329.jpg',
    description: 'Une folie de Haute Couture. Un sac à main structuré entièrement tissé à la main, perle par perle, d\'un damier de jade vert sapin brossé et d\'onyx crème. Magnifiquement doublé de satin.',
    features: [
      'Près de 1 500 perles de jade synthétique polies haute densité',
      'Fils en nylon noués à triple tension ultra-stable',
      'Doublure en satin de soie vert sapin avec compartiment cartes',
      'Une présence sculpturale incomparable pour les soirées'
    ],
    materials: ['Perles de Jade Synthétique', 'Fil Haute Résistance', 'Satin de Soie'],
    stockStatus: 'piece_unique',
    timeToCreate: '24 heures',
    artisan: 'Élodie Dupond',
    rating: 5.0,
    isFeatured: true
  },
  {
    id: 'cr_1',
    name: 'Coffret d\'Initiation l\'Atelier',
    category: 'crafting',
    price: 110,
    image: '/src/assets/images/crafting_supplies_collection_1781217711115.jpg',
    description: 'Tout le matériel d\'exception nécessaire pour composer vos premiers bijoux d\'art chez vous. Comprend une sélection de nos plus belles perles de nacre blanche et de gemmes naturelles.',
    features: [
      'Sélection de 150 perles de nacre et pierres de soleil',
      '20 fermoirs et anneaux en laiton plaqué or fin 18k',
      'Bobine de fil de soie japonaise et aiguilles ultra-fines de précision',
      'Livret d\'instructions et astuces de tissage de notre maître-artisan'
    ],
    materials: ['Perles d\'Art', 'Fermoirs Or Fin', 'Fil de Soie', 'Accessoires Métal'],
    stockStatus: 'disponible',
    timeToCreate: 'Uniquement Fourniture',
    artisan: 'Atelier Communautaire',
    rating: 4.9,
    isFeatured: true
  },
  {
    id: 'cr_2',
    name: 'Lot de Fermoirs Bouée 18k',
    category: 'crafting',
    price: 45,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
    description: 'Un jeu de 5 fermoirs de style bouée d\'ornementation, parfaits pour devenir le motif central de vos colliers ou pour assurer une finition luxueuse.',
    features: [
      '5 fermoirs bouée de 12mm de diamètre',
      'Placage or fin 18 carats de haute durabilité',
      'Système de ressort et fermeture à haute élasticité résistant au temps',
      'Anneaux de raccordement soudés pour une sécurité absolue'
    ],
    materials: ['Laiton', 'Placage Or Jaune 18k'],
    stockStatus: 'disponible',
    timeToCreate: 'Fourniture d\'Artisanat',
    artisan: 'Atelier Communautaire',
    rating: 4.6,
    isFeatured: false
  }
];

export const BEAD_CATALOG: BeadOption[] = [
  {
    id: 'b1',
    name: 'Pierre de Soleil (Doré)',
    color: '#e2a36f',
    type: 'Gemme Naturelle',
    pricePerBead: 1.5,
    description: 'Apporte joie, chaleur et un chatoiement satiné cuivre-orange.'
  },
  {
    id: 'b2',
    name: 'Nacre Blanche Royale',
    color: '#faf6f0',
    type: 'Nacre Organique',
    pricePerBead: 1.8,
    description: 'Reflets irisés blancs laiteux, symbole de douceur et pureté.'
  },
  {
    id: 'b3',
    name: 'Jade Forêt (Vert)',
    color: '#2a5c43',
    type: 'Gemme Fine',
    pricePerBead: 2.0,
    description: 'Vert impérial profond, synonyme de sérénité et prospérité.'
  },
  {
    id: 'b4',
    name: 'Onyx Profond (Noir Matte)',
    color: '#1a1a1a',
    type: 'Pierre de Volcan',
    pricePerBead: 1.2,
    description: 'Noir intense au poli mat velouté pour un style affirmé.'
  },
  {
    id: 'b5',
    name: 'Lapis-Lazuli (Bleu Nuit)',
    color: '#1a3a6c',
    type: 'Gemme Céleste',
    pricePerBead: 1.6,
    description: 'Cobalt intense strié de paillettes dorées de pyrite.'
  },
  {
    id: 'b6',
    name: 'Quartz Rose (Romantique)',
    color: '#f4c3c3',
    type: 'Quartz Naturel',
    pricePerBead: 1.4,
    description: 'Rose pastel translucide, symbole universel d\'amour et tendresse.'
  },
  {
    id: 'b7',
    name: 'Perle intercalaire Or 18k',
    color: '#d4af37',
    type: 'Métal Précieux',
    pricePerBead: 2.5,
    description: 'Petite perle polie miroir plaquée or pour rythmer le bijou.'
  }
];

export const CHARM_OPTIONS: CharmOption[] = [
  { id: 'c1', name: 'Soleil Céleste', icon: '☀️', price: 15 },
  { id: 'c2', name: 'Coquillage d\'Or', icon: '🐚', price: 12 },
  { id: 'c3', name: 'Étoile Divine', icon: '✨', price: 10 },
  { id: 'c4', name: 'Médaille Impériale', icon: '🪙', price: 18 },
  { id: 'c5', name: 'Glan d\'Or Sauvage', icon: '🍃', price: 8 }
];
