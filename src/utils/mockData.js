export const CATEGORIES = [
  { id: 'ps5',       name: 'PlayStation 5', icon: '🎮', count: 234, gradient: 'from-purple-600 to-violet-800',  border: 'border-purple-500/30',  bg: 'bg-purple-500/10' },
  { id: 'ps4',       name: 'PlayStation 4', icon: '📀', count: 312, gradient: 'from-blue-600 to-blue-800',      border: 'border-blue-500/30',    bg: 'bg-blue-500/10' },
  { id: 'xbox',      name: 'Xbox Series',   icon: '🎯', count: 187, gradient: 'from-green-600 to-emerald-800',  border: 'border-green-500/30',   bg: 'bg-green-500/10' },
  { id: 'nintendo',  name: 'Nintendo',      icon: '🃏', count: 156, gradient: 'from-red-600 to-rose-800',       border: 'border-red-500/30',     bg: 'bg-red-500/10' },
  { id: 'psp',       name: 'PSP / PS Vita', icon: '📱', count: 89,  gradient: 'from-cyan-600 to-sky-800',       border: 'border-cyan-500/30',    bg: 'bg-cyan-500/10' },
  { id: 'manettes',  name: 'Manettes',      icon: '🕹️', count: 445, gradient: 'from-orange-500 to-amber-700',  border: 'border-orange-500/30',  bg: 'bg-orange-500/10' },
  { id: 'casques',   name: 'Casques',       icon: '🎧', count: 234, gradient: 'from-pink-600 to-fuchsia-800',   border: 'border-pink-500/30',    bg: 'bg-pink-500/10' },
  { id: 'jeux',      name: 'Jeux CD',       icon: '💿', count: 789, gradient: 'from-yellow-500 to-amber-700',  border: 'border-yellow-500/30',  bg: 'bg-yellow-500/10' },
]

export const SELLERS = [
  { id: 's1', name: 'Kofi Mensah',   avatar: null, rating: 4.9, reviewCount: 87, location: 'Dakar',    verified: true  },
  { id: 's2', name: 'Amara Diallo',  avatar: null, rating: 4.7, reviewCount: 43, location: 'Abidjan',  verified: true  },
  { id: 's3', name: 'Fatou Sow',     avatar: null, rating: 4.5, reviewCount: 21, location: 'Lomé',     verified: false },
  { id: 's4', name: 'Kwame Asante',  avatar: null, rating: 4.8, reviewCount: 65, location: 'Accra',    verified: true  },
  { id: 's5', name: 'Moussa Traoré', avatar: null, rating: 4.3, reviewCount: 14, location: 'Bamako',   verified: false },
  { id: 's6', name: 'Aïcha Camara',  avatar: null, rating: 4.6, reviewCount: 32, location: 'Conakry',  verified: true  },
]

export const PRODUCTS = [
  {
    id: '1', title: 'PS5 Edition Disque — Parfait état', slug: 'ps5-edition-disque-parfait-etat',
    price: 320000, originalPrice: 390000, category: 'ps5', categoryName: 'PlayStation 5',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
      'https://images.unsplash.com/photo-1607853202273-232359b18e21?w=800&q=80',
    ],
    description: 'PS5 Edition Disque en parfait état, achetée il y a 8 mois. Vendue avec 2 manettes DualSense, câbles d'origine et toute la documentation. Aucune rayure. Fonctionne parfaitement.',
    seller: SELLERS[0], location: 'Dakar, Sénégal', views: 1247, likes: 89,
    createdAt: '2024-02-10', featured: true,
  },
  {
    id: '2', title: 'DualSense Midnight Black — Neuf', slug: 'dualsense-midnight-black-neuf',
    price: 35000, originalPrice: null, category: 'manettes', categoryName: 'Manettes',
    condition: 'new', images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    ],
    description: 'Manette DualSense Midnight Black neuve, jamais déballée. Boîte scellée.',
    seller: SELLERS[1], location: 'Abidjan, Côte d\'Ivoire', views: 543, likes: 34,
    createdAt: '2024-02-18', featured: true,
  },
  {
    id: '3', title: 'Spider-Man 2 — PS5', slug: 'spider-man-2-ps5',
    price: 22000, originalPrice: 30000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    ],
    description: 'Jeu Spider-Man 2 pour PS5, acheté il y a 3 semaines. Excellent état, aucune rayure.',
    seller: SELLERS[2], location: 'Lomé, Togo', views: 312, likes: 22,
    createdAt: '2024-02-15', featured: false,
  },
  {
    id: '4', title: 'PS4 Pro 1TB — Très bon état', slug: 'ps4-pro-1tb-tres-bon-etat',
    price: 145000, originalPrice: 180000, category: 'ps4', categoryName: 'PlayStation 4',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80',
    ],
    description: 'PS4 Pro 1TB, console seule. Très bon état général, propre. Inclut le câble HDMI et le câble d\'alimentation.',
    seller: SELLERS[3], location: 'Accra, Ghana', views: 876, likes: 56,
    createdAt: '2024-02-05', featured: true,
  },
  {
    id: '5', title: 'Xbox Series X — Comme neuf', slug: 'xbox-series-x-comme-neuf',
    price: 310000, originalPrice: 380000, category: 'xbox', categoryName: 'Xbox Series',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    ],
    description: 'Xbox Series X en parfait état. Vendue avec 1 manette sans-fil et tous les câbles. Aucun problème.',
    seller: SELLERS[0], location: 'Dakar, Sénégal', views: 654, likes: 45,
    createdAt: '2024-01-28', featured: true,
  },
  {
    id: '6', title: 'Nintendo Switch OLED — Neuf', slug: 'nintendo-switch-oled-neuf',
    price: 195000, originalPrice: null, category: 'nintendo', categoryName: 'Nintendo',
    condition: 'new', images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    ],
    description: 'Nintendo Switch OLED Blanc, neuve dans sa boîte. Jamais utilisée. Garantie 1 an.',
    seller: SELLERS[4], location: 'Bamako, Mali', views: 432, likes: 67,
    createdAt: '2024-02-20', featured: true,
  },
  {
    id: '7', title: 'FIFA 24 — PS4', slug: 'fifa-24-ps4',
    price: 12000, originalPrice: 18000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'good', images: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    ],
    description: 'FIFA 24 pour PS4. Bon état, quelques légères rayures mais fonctionne parfaitement.',
    seller: SELLERS[1], location: 'Abidjan, Côte d\'Ivoire', views: 234, likes: 12,
    createdAt: '2024-02-12', featured: false,
  },
  {
    id: '8', title: 'Casque Sony Pulse 3D — Parfait', slug: 'casque-sony-pulse-3d-parfait',
    price: 45000, originalPrice: 55000, category: 'casques', categoryName: 'Casques',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    ],
    description: 'Casque Sony Pulse 3D blanc, parfait état. Son 3D exceptionnel. Vendu avec câble USB.',
    seller: SELLERS[5], location: 'Conakry, Guinée', views: 321, likes: 28,
    createdAt: '2024-02-08', featured: false,
  },
  {
    id: '9', title: 'Manette Xbox Elite Série 2', slug: 'manette-xbox-elite-serie-2',
    price: 65000, originalPrice: 85000, category: 'manettes', categoryName: 'Manettes',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
    ],
    description: 'Manette Xbox Elite Série 2 noire, excellent état. Gâchettes ajustables, palettes amovibles.',
    seller: SELLERS[2], location: 'Lomé, Togo', views: 178, likes: 19,
    createdAt: '2024-02-14', featured: false,
  },
  {
    id: '10', title: 'God of War Ragnarök — PS5', slug: 'god-of-war-ragnarok-ps5',
    price: 25000, originalPrice: 35000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    ],
    description: 'God of War Ragnarök pour PS5. Jeu complet, excellent état. Un chef-d\'œuvre.',
    seller: SELLERS[3], location: 'Accra, Ghana', views: 567, likes: 78,
    createdAt: '2024-01-22', featured: false,
  },
  {
    id: '11', title: 'PSP 3000 + 10 Jeux UMD', slug: 'psp-3000-10-jeux-umd',
    price: 55000, originalPrice: null, category: 'psp', categoryName: 'PSP / PS Vita',
    condition: 'good', images: [
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
    ],
    description: 'PSP 3000 noire en bon état, avec 10 jeux UMD (FIFA, GTA, PES, ...) et chargeur d\'origine.',
    seller: SELLERS[0], location: 'Dakar, Sénégal', views: 289, likes: 41,
    createdAt: '2024-02-01', featured: false,
  },
  {
    id: '12', title: 'Nintendo Switch Lite Jaune', slug: 'nintendo-switch-lite-jaune',
    price: 120000, originalPrice: 145000, category: 'nintendo', categoryName: 'Nintendo',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    ],
    description: 'Switch Lite jaune très bon état. Légères marques sur la boîte, console impeccable.',
    seller: SELLERS[1], location: 'Abidjan, Côte d\'Ivoire', views: 345, likes: 29,
    createdAt: '2024-02-09', featured: false,
  },
  {
    id: '13', title: 'Zelda: Tears of the Kingdom — Switch', slug: 'zelda-tears-of-the-kingdom',
    price: 28000, originalPrice: 38000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
    ],
    description: 'Zelda Tears of the Kingdom pour Nintendo Switch. Excellent état, boîte incluse.',
    seller: SELLERS[4], location: 'Bamako, Mali', views: 412, likes: 55,
    createdAt: '2024-02-17', featured: false,
  },
  {
    id: '14', title: 'PS5 Digital Edition — Très bon', slug: 'ps5-digital-edition-tres-bon',
    price: 280000, originalPrice: 340000, category: 'ps5', categoryName: 'PlayStation 5',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    ],
    description: 'PS5 Digital Edition blanc très bon état. Inclut manette, câbles, notice.',
    seller: SELLERS[5], location: 'Conakry, Guinée', views: 789, likes: 62,
    createdAt: '2024-01-30', featured: false,
  },
  {
    id: '15', title: 'Casque SteelSeries Arctis 7P', slug: 'casque-steelseries-arctis-7p',
    price: 55000, originalPrice: 70000, category: 'casques', categoryName: 'Casques',
    condition: 'good', images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    ],
    description: 'Casque SteelSeries Arctis 7P sans-fil pour PS5/PS4. Son excellent, micro rétractable.',
    seller: SELLERS[2], location: 'Lomé, Togo', views: 156, likes: 14,
    createdAt: '2024-02-11', featured: false,
  },
  {
    id: '16', title: 'DualSense Cosmic Red — Neuf', slug: 'dualsense-cosmic-red-neuf',
    price: 40000, originalPrice: null, category: 'manettes', categoryName: 'Manettes',
    condition: 'new', images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    ],
    description: 'Manette DualSense Cosmic Red, neuve sous blister. Coloris exclusif.',
    seller: SELLERS[0], location: 'Dakar, Sénégal', views: 623, likes: 88,
    createdAt: '2024-02-19', featured: false,
  },
  {
    id: '17', title: 'Xbox Series S 512GB — Neuf', slug: 'xbox-series-s-neuf',
    price: 195000, originalPrice: 230000, category: 'xbox', categoryName: 'Xbox Series',
    condition: 'new', images: [
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80',
    ],
    description: 'Xbox Series S 512GB blanche neuve dans sa boîte. Jamais ouverte.',
    seller: SELLERS[3], location: 'Accra, Ghana', views: 445, likes: 36,
    createdAt: '2024-02-16', featured: false,
  },
  {
    id: '18', title: 'GTA V — PS4', slug: 'gta-v-ps4',
    price: 8000, originalPrice: 12000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'good', images: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    ],
    description: 'GTA V pour PS4. Bon état, fonctionne parfaitement. Quelques micro-rayures.',
    seller: SELLERS[1], location: 'Abidjan, Côte d\'Ivoire', views: 198, likes: 8,
    createdAt: '2024-02-03', featured: false,
  },
  {
    id: '19', title: 'Pokémon Écarlate — Nintendo Switch', slug: 'pokemon-ecarlate-switch',
    price: 18000, originalPrice: 28000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
    ],
    description: 'Pokémon Écarlate pour Switch, parfait état. Boîte et cartouche en excellent état.',
    seller: SELLERS[4], location: 'Bamako, Mali', views: 267, likes: 31,
    createdAt: '2024-02-06', featured: false,
  },
  {
    id: '20', title: 'Call of Duty MW3 — Xbox', slug: 'call-of-duty-mw3-xbox',
    price: 18000, originalPrice: 25000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'good', images: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    ],
    description: 'Call of Duty Modern Warfare 3 pour Xbox Series. Bon état général.',
    seller: SELLERS[5], location: 'Conakry, Guinée', views: 134, likes: 9,
    createdAt: '2024-02-13', featured: false,
  },
]

export const STATS = [
  { label: 'Produits en ligne', value: '12 400+', icon: '🎮' },
  { label: 'Vendeurs actifs',   value: '5 200+',  icon: '🧑‍💻' },
  { label: 'Ventes réalisées',  value: '38 000+', icon: '💸' },
  { label: 'Note moyenne',      value: '4.9 ★',   icon: '⭐' },
]

export const TESTIMONIALS = [
  { id: 1, name: 'Ibrahima K.', location: 'Dakar', rating: 5, text: 'J\'ai vendu ma PS4 en 48h ! La plateforme est super simple et le paiement sécurisé. Je recommande à 100%.' },
  { id: 2, name: 'Chloé M.',    location: 'Abidjan', rating: 5, text: 'Trouvé ma Nintendo Switch OLED 30 000 FCFA moins cher qu\'en boutique. Vendeur sérieux, livraison rapide.' },
  { id: 3, name: 'Kwame A.',    location: 'Accra', rating: 5, text: 'GameBlox c\'est le meilleur endroit pour trouver des accessoires gaming rares en Afrique de l\'Ouest.' },
]
