const unitTypes = { 
  infantry: { 
    name: 'infantry', 
    cost: 3, 
    movement: 1, 
    attack: 1, 
    defend: 2,
    land: true
  },
  armor: { 
    name: 'armor', 
    cost: 6, 
    movement: 2, 
    attack: 3, 
    defend: 3,
    land: true
  },
  fighter: { 
    name: 'fighter', 
    cost: 10, 
    movement: 4, 
    attack: 3, 
    defend: 4, 
    fighter: true,
    air: true
  },
  'strategic bomber': { 
    name: 'strategic bomber', 
    cost: 12, 
    movement: 6, 
    attack: 4, 
    defend: 1, 
    bomber: true,
    air: true
  },
  'anti-aircraft gun': { 
    name: 'anti-aircraft gun', 
    cost: 6, 
    movement: 1, 
    range: 3, 
    flak: 1
  },
  battleship: { 
    name: 'battleship', 
    cost: 20, 
    movement: 2, 
    attack: 4, 
    defend: 4, 
    ship: true,
    canTakeDamage: true, 
    canBombard: true
  },
  'aircraft carrier': { 
    name: 'aircraft carrier', 
    cost: 18, 
    movement: 2, 
    attack: 1, 
    defend: 2, 
    ship: true,
    canTakeDamage: true, 
    landingSlots: 2
  },
  transport: { 
    name: 'transport', 
    cost: 2, 
    movement: 2,
    ship: true,
    transport: true
  },
  submarine: { 
    name: 'submarine', 
    cost: 6, 
    movement: 2, 
    ship: true,
    attack: 2, 
    defend: 1
  },
  'industrial complex': { name: 'industrial complex', cost: 30},
  artillery: { 
    name: 'artillery', 
    cost: 4, 
    movement: 1, 
    attack: 2, 
    defend: 2,
    land: true
  },
  destroyer: { 
    name: 'destroyer', 
    cost: 7, 
    movement: 2, 
    attack: 2, 
    defend: 2,
    ship: true
  },
  cruiser: { 
    name: 'cruiser', 
    cost: 10, 
    movement: 2, 
    attack: 4, 
    defend: 3,
    ship: true,
    canBombard: true
  },
  'tactical bomber': { 
    name: 'tactical bomber', 
    cost: 11, 
    movement: 4, 
    attack: 4, 
    defend: 2,
    air: true
  },
  'mechanized infantry': { 
    name: 'mechanized infantry', 
    cost: 4, 
    movement: 2, 
    attack: 2, 
    defend: 1,
    land: true
  },
  'damaged battleship': { 
    name: 'damaged battleship', 
    cost: 20, 
    movement: 1, 
    attack: 4, 
    defend: 4, 
    ship: true,
    canBombard: true
  },
  'damaged aircraft carrier': { 
    name: 'damaged aircraft carrier', 
    cost: 18, 
    movement: 1, 
    attack: 1, 
    defend: 2,
    ship: true,
    landingSlots: 1
  },
  'long-range fighter': { 
    name: 'long-range fighter', 
    cost: 11, 
    movement: 6, 
    attack: 3, 
    defend: 4, 
    fighter: true, 
    air: true,
    tech: ['longRange']
  },
  'long-range tactical bomber': { 
    name: 'long-range tactical bomber', 
    cost: 12, 
    movement: 6, 
    attack: 4, 
    defend: 2, 
    air: true,
    tech: ['longRange'] 
  },
  'long-range strategic bomber': { 
    name: 'long-range strategic bomber', 
    cost: 14, 
    movement: 8, 
    attack: 4, 
    defend: 1, 
    bomber: true, 
    air: true,
    tech: ['longRange']
  },
  'jet fighter': { 
    name: 'jet fighter', 
    cost: 12, 
    movement: 4, 
    attack: 3, 
    defend: 5, 
    fighter: true, 
    air: true,
    tech: ['jets']
  },
  'long-range strategic heavy bomber': { 
    name: 'long-range strategic heavy bomber', 
    cost: 18, 
    movement: 8, 
    attack: 4, 
    defend: 1, 
    numAttack: 2, 
    bomber: true, 
    air: true,
    tech: ['heavyBomber', 'longRange']
  },
  'super submarine': { 
    name: 'super submarine', 
    cost: 8, 
    movement: 2, 
    ship: true,
    attack: 3, 
    defend: 1, tech: ['subs']
  },
  'naval fighter': { 
    name: 'naval fighter', 
    cost: 11, 
    movement: 4, 
    attack: 3, 
    defend: 4, 
    fighter: true,
    air: true,
    navalRated: true
  },
  'long-range naval fighter': { 
    name: 'long-range naval fighter', 
    cost: 12, 
    movement: 6, 
    attack: 3, 
    defend: 4, 
    fighter: true, 
    air: true,
    navalRated: true,
    tech: ['longRange']
  },
  'naval tactical bomber': { 
    name: 'naval tactical bomber', 
    cost: 12, 
    movement: 4, 
    attack: 4, 
    defend: 2,
    navalRated: true,
    air: true
  },
  'long-range naval tactical bomber': { 
    name: 'long-range naval tactical bomber', 
    cost: 13, 
    movement: 6, 
    attack: 4, 
    defend: 2, 
    air: true,
    navalRated: true,
    tech: ['longRange'] 
  },
}

export default unitTypes
