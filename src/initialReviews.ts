import { ProductReview } from './types';

export const INITIAL_REVIEWS: ProductReview[] = [
  // fw_1
  {
    id: 'rev_fw_1_1',
    productId: 'fw_1',
    authorName: 'Hélène de Montalembert',
    authorEmail: 'helene.m@prestige.fr',
    rating: 5,
    comment: 'Le contraste entre l\'asymétrie sauvage des perles baroques et la perfection de la dorure à l\'or fin est saisissant. Ce collier a une prestance rare, il m\'accompagne dans tous mes dîners officiels.',
    date: '2026-05-14',
    artisanReply: {
      author: 'Aurélie Martin',
      comment: 'Un grand merci, chère Hélène, pour ce témoignage si élogieux. C\'était un réel plaisir de façonner ce bijou, sachant qu\'il accompagnerait de si grandes occasions.',
      date: '2026-05-15'
    }
  },
  {
    id: 'rev_fw_1_2',
    productId: 'fw_1',
    authorName: 'Jean-Christophe P.',
    authorEmail: 'jc.perrin@luxe-paris.com',
    rating: 4,
    comment: 'Acheté pour l\'anniversaire de ma compagne. Elle a été subjuguée par l\'originalité des formes baroques. L\'écrin de présentation en lin et velours est superbe.',
    date: '2026-06-02',
    artisanReply: {
      author: 'Aurélie Martin',
      comment: 'Ravi d\'avoir pu participer à cet événement, cher Jean-Christophe. Que la douceur nacrée de ces perles illumine le quotidien de votre compagne.',
      date: '2026-06-03'
    }
  },
  // fw_2
  {
    id: 'rev_fw_2_1',
    productId: 'fw_2',
    authorName: 'Sophie Laroche',
    authorEmail: 'sophie.laroche@outlook.fr',
    rating: 5,
    comment: 'La nacre des perles de ce bracelet possède un orient blanc crème absolument divin. Le nœud de soie entre chaque perle atteste du savoir-faire traditionnel millénaire de l\'Atelier.',
    date: '2026-04-20',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-beautiful-gold-necklace-42512-large.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300',
    artisanReply: {
      author: 'Élodie Dupond',
      comment: 'Merci infiniment Sophie. L\'enfilage traditionnel sur double fil de soie est en effet garant de la souplesse incomparable et de la longévité de ce bracelet d\'exception.',
      date: '2026-04-21'
    }
  },
  // fw_3
  {
    id: 'rev_fw_3_1',
    productId: 'fw_3',
    authorName: 'Béatrice de Vigan',
    authorEmail: 'b.vigan@club-opulent.fr',
    rating: 5,
    comment: 'Chic, sobres et légères au porter ! Les créoles s\'oublient mais attirent tous les regards. L\'appairage en taille et en éclat des deux perles poires suspendues est tout simplement remarquable.',
    date: '2026-05-29',
    artisanReply: {
      author: 'Nicolas Berger',
      comment: 'C\'est un honneur, Béatrice. Trouver deux perles naturelles de forme poire qui se répondent parfaitement en lustre et en galbe requiert de longues heures de sélection. Votre satisfaction en est la plus douce récompense.',
      date: '2026-05-30'
    }
  },
  // sw_1
  {
    id: 'rev_sw_1_1',
    productId: 'sw_1',
    authorName: 'Comtesse d’Aligny',
    authorEmail: 'comtesse.aligny@chateau.fr',
    rating: 5,
    comment: 'Ce sautoir est l’âme même des lagons polynésiens. Les nuances aubergine et vert paon de ces perles de Tahiti sont envoûtantes sous la lumière des bougies lors de nos réceptions. Un pur chef-d’œuvre d\'art.',
    date: '2026-05-10',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-jewels-and-pearl-earrings-on-a-display-42610-large.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300',
    artisanReply: {
      author: 'Jean-Baptiste Clauzel',
      comment: 'Je suis extrêmement sensible à votre appréciation, Madame la Comtesse. Les gemmes de Tahiti ont cette magie sombre et changeante qu\'aucune imitation ne saurait égaler. C\'était un privilège de l\'assembler.',
      date: '2026-05-11'
    }
  },
  {
    id: 'rev_sw_1_2',
    productId: 'sw_1',
    authorName: 'Isabelle V.',
    authorEmail: 'isabelle@v-gallery.com',
    rating: 5,
    comment: 'D\'une beauté brute et raffinée à la fois. Le certificat d’évaluation gemmologique fourni est d’un professionnalisme rassurant. C\'est un investissement coup de cœur que je transmettrai à ma fille.',
    date: '2026-06-08',
    artisanReply: {
      author: 'Jean-Baptiste Clauzel',
      comment: 'Merci pour ce commentaire précieux, Isabelle. La transmission intergénérationnelle est l\'un des plus beaux desseins de la haute joaillerie. Nous sommes heureux de vous accompagner sur cette lignée.',
      date: '2026-06-09'
    }
  },
  // sw_2
  {
    id: 'rev_sw_2_1',
    productId: 'sw_2',
    authorName: 'Emmanuelle S.',
    authorEmail: 'emmanuelle.s@luxe.ch',
    rating: 4,
    comment: 'Le lustre "Miroir" des perles Akoya japonaises est incontestable. Les tiges en or blanc 18 carats sont très bien calibrées. Dommage pour le délai d\'expédition de 48h, mais l\'attente en valait largement la peine.',
    date: '2026-03-12',
    artisanReply: {
      author: 'Aurélie Martin',
      comment: 'Tous mes remerciements, Emmanuelle. Comme notre atelier façonne tout de manière artisanale, nos temps d\'expédition incluent les derniers rituels de polissage. Nous vous remercions pour votre précieuse patience.',
      date: '2026-03-13'
    }
  },
  // gs_1
  {
    id: 'rev_gs_1_1',
    productId: 'gs_1',
    authorName: 'Claire Dupré',
    authorEmail: 'claire.dupre@sfr.fr',
    rating: 5,
    comment: 'Quelle merveille nocturne ! Les étincelles cuivrées de la pierre de soleil contrastent magnifiquement avec la nacre douce. C\'est un bijou vivant, organique et solaire qui donne du baume au cœur.',
    date: '2026-05-22',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-shining-gold-ring-40081-large.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300',
    artisanReply: {
      author: 'Aurélie Martin',
      comment: 'Un grand merci Claire. La pierre de soleil a cet éclat intérieur unique que nous adorons associer à la fraîcheur blanche de l\'eau douce.',
      date: '2026-05-23'
    }
  }
];
