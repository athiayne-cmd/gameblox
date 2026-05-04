export const SPONSORS = [
  {
    id: 'playstation',
    name: 'PlayStation',
    slogan: 'Play Has No Limits',
    color: '#003087',
    accentColor: '#0070d1',
    bgColor: 'rgba(0,48,135,0.15)',
    categories: ['ps5', 'ps4', 'psp'],
  },
  {
    id: 'xbox',
    name: 'Xbox',
    slogan: 'Power Your Dreams',
    color: '#107c10',
    accentColor: '#52b043',
    bgColor: 'rgba(16,124,16,0.15)',
    categories: ['xbox'],
  },
  {
    id: 'nintendo',
    name: 'Nintendo',
    slogan: 'Play Together Anywhere',
    color: '#e53935',
    accentColor: '#ff5252',
    bgColor: 'rgba(229,57,53,0.15)',
    categories: ['nintendo'],
  },
  {
    id: 'razer',
    name: 'Razer',
    slogan: 'For Gamers. By Gamers.',
    color: '#00ff00',
    accentColor: '#44d62c',
    bgColor: 'rgba(0,255,0,0.08)',
    categories: ['casques', 'manettes'],
  },
]

export const CATEGORIES = [
  { id: 'ps5',      name: 'PlayStation 5', icon: '🎮', count: 234, gradient: 'from-purple-600 to-violet-800',  border: 'border-purple-500/30',  bg: 'bg-purple-500/10' },
  { id: 'ps4',      name: 'PlayStation 4', icon: '📀', count: 312, gradient: 'from-blue-600 to-blue-800',      border: 'border-blue-500/30',    bg: 'bg-blue-500/10' },
  { id: 'xbox',     name: 'Xbox Series',   icon: '🎯', count: 187, gradient: 'from-green-600 to-emerald-800',  border: 'border-green-500/30',   bg: 'bg-green-500/10' },
  { id: 'nintendo', name: 'Nintendo',      icon: '🃏', count: 156, gradient: 'from-red-600 to-rose-800',       border: 'border-red-500/30',     bg: 'bg-red-500/10' },
  { id: 'psp',      name: 'PSP / PS Vita', icon: '📱', count: 89,  gradient: 'from-cyan-600 to-sky-800',       border: 'border-cyan-500/30',    bg: 'bg-cyan-500/10' },
  { id: 'manettes', name: 'Manettes',      icon: '🕹️', count: 445, gradient: 'from-orange-500 to-amber-700',  border: 'border-orange-500/30',  bg: 'bg-orange-500/10' },
  { id: 'casques',  name: 'Casques',       icon: '🎧', count: 234, gradient: 'from-pink-600 to-fuchsia-800',   border: 'border-pink-500/30',    bg: 'bg-pink-500/10' },
  { id: 'jeux',     name: 'Jeux CD',       icon: '💿', count: 789, gradient: 'from-yellow-500 to-amber-700',  border: 'border-yellow-500/30',  bg: 'bg-yellow-500/10' },
]

export const CAT_STYLE = {
  ps5: {
    emoji: '🎮', gradient: 'from-purple-900 via-purple-700 to-violet-900',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=450&fit=crop&q=80',
  },
  ps4: {
    emoji: '📀', gradient: 'from-blue-900 via-blue-700 to-blue-900',
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=450&fit=crop&q=80',
  },
  xbox: {
    emoji: '🎯', gradient: 'from-green-900 via-green-700 to-emerald-900',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=450&fit=crop&q=80',
  },
  nintendo: {
    emoji: '🃏', gradient: 'from-red-900 via-red-700 to-rose-900',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=450&fit=crop&q=80',
  },
  psp: {
    emoji: '📱', gradient: 'from-cyan-900 via-cyan-700 to-sky-900',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=450&fit=crop&q=80',
  },
  manettes: {
    emoji: '🕹️', gradient: 'from-orange-900 via-orange-700 to-amber-900',
    image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600&h=450&fit=crop&q=80',
  },
  casques: {
    emoji: '🎧', gradient: 'from-pink-900 via-pink-700 to-fuchsia-900',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop&q=80',
  },
  jeux: {
    emoji: '💿', gradient: 'from-yellow-900 via-yellow-600 to-amber-900',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=450&fit=crop&q=80',
  },
}

export const SELLERS = [
  { id: 's1', name: 'Moussa Diallo',   avatar: null, rating: 4.9, reviewCount: 87, location: 'Dakar',       verified: true  },
  { id: 's2', name: 'Fatou Mbaye',     avatar: null, rating: 4.7, reviewCount: 43, location: 'Thiès',       verified: true  },
  { id: 's3', name: 'Ibrahima Ndiaye', avatar: null, rating: 4.5, reviewCount: 21, location: 'Saint-Louis', verified: false },
  { id: 's4', name: 'Aminata Diop',    avatar: null, rating: 4.8, reviewCount: 65, location: 'Mbour',       verified: true  },
  { id: 's5', name: 'Cheikh Sow',      avatar: null, rating: 4.3, reviewCount: 14, location: 'Kaolack',     verified: false },
  { id: 's6', name: 'Mariama Gueye',   avatar: null, rating: 4.6, reviewCount: 32, location: 'Ziguinchor',  verified: true  },
]

export const PRODUCTS = [
  {
    id: '1', title: 'PS5 Edition Disque — Parfait état', slug: 'ps5-edition-disque-parfait-etat',
    price: 350000, originalPrice: 420000, category: 'ps5', categoryName: 'PlayStation 5',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&h=600&fit=crop&q=80',
    ],
    description: "PS5 Edition Disque en parfait état, achetée il y a 8 mois. Vendue avec 2 manettes DualSense, câbles d'origine et toute la documentation. Aucune rayure. Fonctionne parfaitement.",
    videoUrl: 'https://www.youtube.com/watch?v=RkC0l4iekYo',
    seller: SELLERS[0], location: 'Dakar, Plateau', views: 1247, likes: 89,
    createdAt: '2024-02-10', featured: true, sponsored: 'playstation',
  },
  {
    id: '2', title: 'DualSense Midnight Black — Neuf', slug: 'dualsense-midnight-black-neuf',
    price: 28000, originalPrice: null, category: 'manettes', categoryName: 'Manettes',
    condition: 'new', images: [
      'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&h=600&fit=crop&q=80',
    ],
    description: 'Manette DualSense Midnight Black neuve, jamais déballée. Boîte scellée. Parfaite pour PS5.',
    seller: SELLERS[1], location: 'Thiès, Centre', views: 543, likes: 34,
    createdAt: '2024-02-18', featured: true,
  },
  {
    id: '3', title: 'Spider-Man 2 — PS5', slug: 'spider-man-2-ps5',
    price: 22000, originalPrice: 32000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&q=80',
    ],
    description: "Jeu Spider-Man 2 pour PS5, acheté il y a 3 semaines. Excellent état, aucune rayure. Boîte et disque impeccables.",
    seller: SELLERS[2], location: 'Saint-Louis', views: 312, likes: 22,
    createdAt: '2024-02-15', featured: false,
  },
  {
    id: '4', title: 'PS4 Pro 1TB — Très bon état', slug: 'ps4-pro-1tb-tres-bon-etat',
    price: 160000, originalPrice: 200000, category: 'ps4', categoryName: 'PlayStation 4',
    condition: 'excellent', images: [],
    description: "PS4 Pro 1TB, console seule. Très bon état général, propre. Inclut le câble HDMI et le câble d'alimentation. Aucun problème technique.",
    seller: SELLERS[3], location: 'Mbour', views: 876, likes: 56,
    createdAt: '2024-02-05', featured: true,
  },
  {
    id: '5', title: 'Xbox Series X — Comme neuf', slug: 'xbox-series-x-comme-neuf',
    price: 330000, originalPrice: 400000, category: 'xbox', categoryName: 'Xbox Series',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=800&h=600&fit=crop&q=80',
    ],
    description: "Xbox Series X en parfait état. Vendue avec 1 manette sans-fil et tous les câbles d'origine. Aucun problème. Rarement utilisée.",
    videoUrl: 'https://www.youtube.com/watch?v=Lq594XmpPBg',
    seller: SELLERS[0], location: 'Dakar, Almadies', views: 654, likes: 45,
    createdAt: '2024-01-28', featured: true, sponsored: 'xbox',
  },
  {
    id: '6', title: 'Nintendo Switch OLED — Neuf', slug: 'nintendo-switch-oled-neuf',
    price: 195000, originalPrice: null, category: 'nintendo', categoryName: 'Nintendo',
    condition: 'new', images: [],
    description: "Nintendo Switch OLED Blanc, neuve dans sa boîte. Jamais utilisée. Garantie 1 an. Achetée au Sénégal.",
    seller: SELLERS[4], location: 'Kaolack', views: 432, likes: 67,
    createdAt: '2024-02-20', featured: true,
  },
  {
    id: '7', title: 'FIFA 24 — PS4', slug: 'fifa-24-ps4',
    price: 8000, originalPrice: 15000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'good', images: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&h=600&fit=crop&q=80',
    ],
    description: 'FIFA 24 pour PS4. Bon état, quelques légères rayures mais fonctionne parfaitement. Idéal pour jouer en famille.',
    seller: SELLERS[1], location: 'Thiès', views: 234, likes: 12,
    createdAt: '2024-02-12', featured: false,
  },
  {
    id: '8', title: 'Casque Sony Pulse 3D — Parfait', slug: 'casque-sony-pulse-3d-parfait',
    price: 42000, originalPrice: 55000, category: 'casques', categoryName: 'Casques',
    condition: 'excellent', images: [],
    description: 'Casque Sony Pulse 3D blanc, parfait état. Son 3D exceptionnel pour PS5. Vendu avec câble USB-C et chargeur.',
    seller: SELLERS[5], location: 'Ziguinchor', views: 321, likes: 28,
    createdAt: '2024-02-08', featured: false,
  },
  {
    id: '9', title: 'Manette Xbox Elite Série 2', slug: 'manette-xbox-elite-serie-2',
    price: 55000, originalPrice: 75000, category: 'manettes', categoryName: 'Manettes',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&h=600&fit=crop&q=80',
    ],
    description: "Manette Xbox Elite Série 2 noire, excellent état. Gâchettes ajustables, palettes amovibles. Compatible PC et Xbox.",
    seller: SELLERS[2], location: 'Saint-Louis', views: 178, likes: 19,
    createdAt: '2024-02-14', featured: false,
  },
  {
    id: '10', title: 'God of War Ragnarök — PS5', slug: 'god-of-war-ragnarok-ps5',
    price: 25000, originalPrice: 35000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&q=80',
    ],
    description: "God of War Ragnarök pour PS5. Jeu complet en excellent état. Un chef-d'oeuvre à ne pas manquer. Boîte impeccable.",
    seller: SELLERS[3], location: 'Mbour', views: 567, likes: 78,
    createdAt: '2024-01-22', featured: false,
  },
  {
    id: '11', title: 'PSP 3000 + 10 Jeux UMD', slug: 'psp-3000-10-jeux-umd',
    price: 35000, originalPrice: null, category: 'psp', categoryName: 'PSP / PS Vita',
    condition: 'good', images: [],
    description: "PSP 3000 noire en bon état, avec 10 jeux UMD (FIFA, GTA, PES, Naruto, Tekken...) et chargeur d'origine.",
    seller: SELLERS[0], location: 'Dakar, Médina', views: 289, likes: 41,
    createdAt: '2024-02-01', featured: false,
  },
  {
    id: '12', title: 'Nintendo Switch Lite Jaune', slug: 'nintendo-switch-lite-jaune',
    price: 120000, originalPrice: 145000, category: 'nintendo', categoryName: 'Nintendo',
    condition: 'excellent', images: [],
    description: "Switch Lite jaune très bon état. Légères marques sur la boîte, console impeccable. Idéale pour jouer en déplacement.",
    seller: SELLERS[1], location: 'Thiès, Nord', views: 345, likes: 29,
    createdAt: '2024-02-09', featured: false,
  },
  {
    id: '13', title: 'Zelda : Tears of the Kingdom — Switch', slug: 'zelda-tears-of-the-kingdom',
    price: 25000, originalPrice: 38000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [],
    description: "Zelda Tears of the Kingdom pour Nintendo Switch. Excellent état, boîte et cartouche incluses. Un jeu incroyable.",
    seller: SELLERS[4], location: 'Kaolack', views: 412, likes: 55,
    createdAt: '2024-02-17', featured: false,
  },
  {
    id: '14', title: 'PS5 Digital Edition — Très bon', slug: 'ps5-digital-edition-tres-bon',
    price: 320000, originalPrice: 390000, category: 'ps5', categoryName: 'PlayStation 5',
    condition: 'excellent', images: [],
    description: "PS5 Digital Edition blanc très bon état. Inclut manette, câbles et notice. Quelques mois d'utilisation seulement.",
    seller: SELLERS[5], location: 'Ziguinchor', views: 789, likes: 62,
    createdAt: '2024-01-30', featured: false,
  },
  {
    id: '15', title: 'Casque SteelSeries Arctis 7P', slug: 'casque-steelseries-arctis-7p',
    price: 48000, originalPrice: 65000, category: 'casques', categoryName: 'Casques',
    condition: 'good', images: [],
    description: 'Casque SteelSeries Arctis 7P sans-fil pour PS5/PS4. Son excellent, micro rétractable. Autonomie 24h.',
    seller: SELLERS[2], location: 'Saint-Louis', views: 156, likes: 14,
    createdAt: '2024-02-11', featured: false,
  },
  {
    id: '16', title: 'DualSense Cosmic Red — Neuf', slug: 'dualsense-cosmic-red-neuf',
    price: 28000, originalPrice: null, category: 'manettes', categoryName: 'Manettes',
    condition: 'new', images: [
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&h=600&fit=crop&q=80',
    ],
    description: 'Manette DualSense Cosmic Red, neuve sous blister. Coloris exclusif très recherché. Boîte scellée.',
    seller: SELLERS[0], location: 'Dakar, Parcelles Assainies', views: 623, likes: 88,
    createdAt: '2024-02-19', featured: false,
  },
  {
    id: '17', title: 'Xbox Series S 512 Go — Neuf', slug: 'xbox-series-s-neuf',
    price: 200000, originalPrice: 240000, category: 'xbox', categoryName: 'Xbox Series',
    condition: 'new', images: [],
    description: "Xbox Series S 512 Go blanche neuve dans sa boîte. Jamais ouverte. Parfaite pour le gaming numérique.",
    seller: SELLERS[3], location: 'Mbour', views: 445, likes: 36,
    createdAt: '2024-02-16', featured: false,
  },
  {
    id: '18', title: 'GTA V — PS4', slug: 'gta-v-ps4',
    price: 8000, originalPrice: 12000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'good', images: [],
    description: 'GTA V pour PS4. Bon état, fonctionne parfaitement. Quelques micro-rayures sans impact sur le jeu.',
    seller: SELLERS[1], location: 'Thiès', views: 198, likes: 8,
    createdAt: '2024-02-03', featured: false,
  },
  {
    id: '19', title: 'Pokémon Écarlate — Nintendo Switch', slug: 'pokemon-ecarlate-switch',
    price: 18000, originalPrice: 28000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'excellent', images: [],
    description: "Pokémon Écarlate pour Switch, parfait état. Boîte et cartouche en excellent état. Aucune rayure.",
    seller: SELLERS[4], location: 'Kaolack', views: 267, likes: 31,
    createdAt: '2024-02-06', featured: false,
  },
  {
    id: '20', title: 'Call of Duty MW3 — Xbox Series', slug: 'call-of-duty-mw3-xbox',
    price: 18000, originalPrice: 25000, category: 'jeux', categoryName: 'Jeux CD',
    condition: 'good', images: [],
    description: 'Call of Duty Modern Warfare 3 pour Xbox Series. Bon état général. Jeu multijoueur incontournable.',
    seller: SELLERS[5], location: 'Ziguinchor', views: 134, likes: 9,
    createdAt: '2024-02-13', featured: false,
  },
]

export const STORIES = [
  {
    id: 'st1', isPremium: true,
    seller: { id: 's1', name: 'Moussa Diallo', rating: 4.9, location: 'Dakar', verified: true },
    product: { id: '1', title: 'PS5 Edition Disque', slug: 'ps5-edition-disque-parfait-etat', price: 350000, category: 'ps5', categoryName: 'PlayStation 5' },
    videoUrl: 'https://www.youtube.com/watch?v=RkC0l4iekYo',
    caption: 'PS5 Disc Edition en parfait état — 350 000 FCFA',
  },
  {
    id: 'st2', isPremium: true,
    seller: { id: 's4', name: 'Aminata Diop', rating: 4.8, location: 'Mbour', verified: true },
    product: { id: '6', title: 'Nintendo Switch OLED', slug: 'nintendo-switch-oled-neuf', price: 195000, category: 'nintendo', categoryName: 'Nintendo' },
    videoUrl: null,
    caption: 'Nintendo Switch OLED — neuve, jamais utilisée !',
  },
  {
    id: 'st3', isPremium: true,
    seller: { id: 's2', name: 'Fatou Mbaye', rating: 4.7, location: 'Thiès', verified: true },
    product: { id: '5', title: 'Xbox Series X', slug: 'xbox-series-x-comme-neuf', price: 330000, category: 'xbox', categoryName: 'Xbox Series' },
    videoUrl: 'https://www.youtube.com/watch?v=Lq594XmpPBg',
    caption: 'Xbox Series X comme neuf — 330 000 FCFA',
  },
  {
    id: 'st4', isPremium: false,
    seller: { id: 's6', name: 'Mariama Gueye', rating: 4.6, location: 'Ziguinchor', verified: true },
    product: { id: '2', title: 'DualSense Midnight Black', slug: 'dualsense-midnight-black-neuf', price: 28000, category: 'manettes', categoryName: 'Manettes' },
    videoUrl: null,
    caption: 'Manette DualSense neuve — 28 000 FCFA 🎮',
  },
  {
    id: 'st5', isPremium: true,
    seller: { id: 's3', name: 'Ibrahima Ndiaye', rating: 4.5, location: 'Saint-Louis', verified: false },
    product: { id: '8', title: 'Casque Sony Pulse 3D', slug: 'casque-sony-pulse-3d-parfait', price: 42000, category: 'casques', categoryName: 'Casques' },
    videoUrl: null,
    caption: 'Casque Pulse 3D — son immersif pour PS5',
  },
]

export const STATS = [
  { label: 'Produits en ligne', value: '12 400+', icon: '🎮' },
  { label: 'Vendeurs actifs',   value: '5 200+',  icon: '🧑' },
  { label: 'Ventes réalisées',  value: '38 000+', icon: '💸' },
  { label: 'Note moyenne',      value: '4.9 ★',   icon: '⭐' },
]

export const TESTIMONIALS = [
  { id: 1, name: 'Ibrahima K.', location: 'Dakar',    rating: 5, text: "J'ai vendu ma PS4 en 48h ! La plateforme est super simple et le paiement sécurisé. Je recommande à 100%." },
  { id: 2, name: 'Aminata D.',  location: 'Thiès',    rating: 5, text: "Trouvé ma Nintendo Switch OLED 30 000 FCFA moins cher qu'en boutique. Vendeur sérieux, livraison rapide." },
  { id: 3, name: 'Ousmane N.',  location: 'Mbour',    rating: 5, text: "GameBlox est le meilleur endroit pour trouver des accessoires gaming rares au Sénégal. Service au top !" },
]
