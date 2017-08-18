const PLAN_COMBAT = 'PLAN_COMBAT';
const RESOLVE_COMBAT = 'RESOLVE_COMBAT';
const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY';
const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES';
const ROLLS = 'ROLLS';
const COMMIT_UNITS = 'COMMIT_UNITS';
const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS';
const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS';
const LOAD_TRANSPORT = 'LOAD_TRANSPORT';
const PLAN_ATTACK = 'PLAN_ATTACK';
const WIN_ATTACK = 'WIN_ATTACK';
const LOSE_ATTACK = 'LOSE_ATTACK';

export const resolveCombat = (territory) => {
  return { type: RESOLVE_COMBAT, territory }
}

const removeCasualties = (defenderCasualties, territoryIndex) => {
  return {
    type: REMOVE_CASUALTIES,
    defenderCasualties,
    territoryIndex
  }
}

const roll = (phase, rolls) => {
  return {
    type: ROLLS,
    phase,
    rolls
  }
}

const planAttack = (territory) => {
  return {
    type: PLAN_ATTACK,
    territory
  }
}

const winAttack = (territoryIndex, currentPower) => {
  return { 
    type: WIN_ATTACK, 
    territoryIndex,
    currentPower
  }
}

export {
  PLAN_ATTACK,
  PLAN_COMBAT,
  RESOLVE_COMBAT,
  TOGGLE_CASUALTY,
  REMOVE_CASUALTIES,
  ROLLS,
  COMMIT_UNITS,
  UNCOMMIT_UNITS,
  VIEW_TRANSPORT_LOAD_OPTIONS,
  LOAD_TRANSPORT,
  WIN_ATTACK,
  roll,
  removeCasualties,
  planAttack,
  winAttack
}
