const categories = {
  tops: {
    metadata: {
      catId: 1,
    },
    details: {
      name: 'tops',
      gender: 'both',
    },
  },
  bottoms: {
    metadata: {
      catId: 2,
    },
    details: {
      name: 'bottoms',
      gender: 'both',
    },
  },
  dresses: {
    metadata: {
      catId: 3,
    },
    details: {
      name: 'dresses',
      gender: 'womens',
    },
  },
  shoes: {
    metadata: {
      catId: 4,
    },
    details: {
      name: 'shoes',
      gender: 'both',
    },
  },
  underwear: {
    metadata: {
      catId: 5,
    },
    details: {
      name: 'underwear',
      gender: 'both',
    },
  },
  accessories: {
    metadata: {
      catId: 6,
    },
    details: {
      name: 'accessories',
      gender: 'both',
    },
  },
  athleisure: {
    metadata: {
      catId: 7,
    },
    details: {
      name: 'athleisure',
      gender: 'both',
    },
  },
  outerwear: {
    metadata: {
      catId: 8,
    },
    details: {
      name: 'outerwear',
      gender: 'both',
    },
  },
  swimsuit: {
    metadata: {
      catId: 9,
    },
    details: {
      name: 'swimsuit',
      gender: 'both',
    },
  },
};

const { tops, bottoms, dresses, shoes, underwear, accessories, athleisure, outerwear, swimsuit } = categories;

const categoryAssignment = {
  'mens-shortsleeve-shirts': tops,
  'mens-straight-leg-jeans': bottoms,
  // 'womens-clothes': 85,
  'womens-athletic-clothes': athleisure,
  jackets: outerwear,
  jeans: bottoms,
  'day-dresses': dresses,
  sweatshirts: tops,
  'stretch-jeans': bottoms,
  'straight-leg-jeans': bottoms,
  'skinny-jeans': bottoms,
  'womens-tech-accessories': accessories,
  'leather-jackets': outerwear,
  'womens-outerwear': outerwear,
  coats: outerwear,
  hats: accessories,
  scarves: accessories,
  slippers: shoes,
  'mens-messenger-bags': accessories,
  'mens-business-bags': accessories,
  'travel-duffels-and-totes': accessories,
  'mens-backpacks': accessories,
  'mens-sweatshirts': tops,
  'mens-tees-and-tshirts': tops,
  'mens-sweaters': tops,
  'mens-shirts': tops,
  'mens-shorts': bottoms,
  'womens-tops': tops,
  'cardigan-sweaters': tops,
  'tees-and-tshirts': tops,
  'dresses': dresses,
  'cashmere-sweaters': tops,
  'skinny-pants': bottoms,
  'shortsleeve-tops': tops,
  'evening-dresses': dresses,
  'tank-tops': tops,
  'raincoats-and-trenchcoats': outerwear,
  'crewneck-sweaters': tops,
  'sleeveless-tops': tops,
  'cropped-pants': bottoms,
  'longsleeve-tops': tops,
  shorts: bottoms,
  sweaters: tops,
  'casual-pants': bottoms,
  'long-skirts': bottoms,
  leggings: bottoms,
  'casual-jackets': outerwear,
  'mid-length-skirts': bottoms,
  'womens-pants': bottoms,
  'mens-cashmere-sweaters': tops,
  'mens-longsleeve-shirts': tops,
  'mens-tote-bags': accessories,
  'mens-outerwear': outerwear,
  'mens-bags': accessories,
  'mens-crewneck-sweaters': tops,
  'mens-jackets': outerwear,
  'mens-pants': bottoms,
  'mens-scarves': accessories,
  skirts: bottoms,
  blazers: tops,
  'athletic-pants': athleisure,
  // 'mens-clothes': 13,
  'teen-guys-shirts': tops,
  'mens-sneakers': shoes,
  'cocktail-dresses': dresses,
  'v-neck-sweaters': tops,
  'mini-skirts': bottoms,
  'mens-wallets': accessories,
  'turleneck-sweaters': tops,
  'tunic-tops': tops,
  'one-piece-swimsuits': swimsuit,
  'two-piece-swimsuits': swimsuit,
  'swimsuit-coverups': swimsuit,
  // chemises: 1,
  pajamas: underwear,
  'womens-intimates': underwear,
  panties: underwear,
  bras: underwear,
  sunglasses: accessories,
  'mens-leather-and-suede-coats': outerwear,
  'mens-jeans': bottoms,
  'mens-casual-pants': bottoms,
  'mens-blazers-and-sport-coats': outerwear,
  'wide-leg-pants': bottoms,
  necklaces: accessories,
  'button-front-tops': tops,
  rings: accessories,
  earrings: accessories,
  bracelets: accessories,
  'flare-jeans': bottoms,
  'camisole-tops': tops,
  'mens-low-rise-jeans': bottoms,
  'mens-slim-jeans': bottoms,
  'mens-distressed-jeans': bottoms,
  'mens-loose-jeans': bottoms,
  'mens-denim-jackets': outerwear,
  // 'bridal-gowns': 2,
  'cropped-jeans': bottoms,
  'denim-jackets': outerwear,
  'womens-eyeglasses': accessories,
  'mens-slip-ons-shoes': shoes,
  'mens-sunglasses': accessories,
  'mens-jewelry': accessories,
  vests: tops,
  'puffer-coats': outerwear,
  'mens-boots': shoes,
  'mens-shoes': shoes,
  'mens-lace-up-shoes': shoes,
  'mens-shoes-athletic': shoes,
  'mens-half-zip-sweaters': tops,
  'mens-sports-bags': accessories,
  'mens-gloves': accessories,
  'mens-cardigan-sweaters': tops,
  'mens-cargo-pants': bottoms,
  'mens-chinos-and-khakis': bottoms,
  'mens-hats': accessories,
  'mens-relaxed-jeans': bottoms,
  'womens-sneakers': shoes,
};

module.exports = categoryAssignment;
