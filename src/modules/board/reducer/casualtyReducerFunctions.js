import { survivors } from '../../../lib/unit'

const survivingUnitsFrom = ({ unitsFrom, attackerCasualties }, complete) => {
  return survivors(unitsFrom, attackerCasualties, complete)
}

export const removeCasualties = (state, action) => {
  const { territoryIndex, defenderCasualties, currentPower } = action;
  return state.territories.map((territory, index) => {
    if (index === territoryIndex) {
      return { 
        ...territory, 
        unitsFrom: survivingUnitsFrom(territory),
        attackerCasualties: [],
        units: survivors(territory.units, defenderCasualties)
      }
    } else if (territory.unitsFrom.length && !territory.units.length) {
      //TODO: what about sea spaces? 
      return {
        ...territory,
        unitsFrom: [],
        units: territory.unitsFrom,
        currentPower,
        newlyConquered: true
      }
    }
    return territory;
  });
}

export const toggleCasualties = (state, action) => {
  const { id, territoryIndex } = action;
  return state.territories.map((territory, index) => {
    if (index === territoryIndex) {
      territory.attackerCasualties = territory.attackerCasualties || [];
      if (territory.attackerCasualties.includes(id)) {
        return { ...territory, attackerCasualties: territory.attackerCasualties.filter(otherId => otherId !== id) }
      } else {
        return { ...territory, attackerCasualties: [...territory.attackerCasualties, id ] }
      }
    }
    return territory;
  });
}

export const defenderWins = (state, action) => {
  const { territoryIndex, defenderCasualties } = action;
  return state.territories.map((territory, index) => {
    if (index === territoryIndex) {
      return { 
        ...territory, 
        unitsFrom: [],
        units: survivors(territory.units, defenderCasualties)
      }
    }
    return territory;
  });
}

//TODO: probably need victor in unitsFrom not units, so I can ensure they don't move during noncom
export const attackerWins = (state, action) => {
  const { territoryIndex, currentPower } = action;
  return state.territories.map((territory, index) => {
    if (index === territoryIndex) {
      const survivingUnits = survivingUnitsFrom(territory);
      const groundUnits = survivingUnits.filter(unit => unit.land);
      return { 
        ...territory, 
        currentPower: groundUnits.length ? currentPower : territory.currentPower,
        unitsFrom: [],
        units: survivingUnitsFrom(territory, true),
        newlyConquered: groundUnits.length
      }
    }
    return territory;
  });
}
