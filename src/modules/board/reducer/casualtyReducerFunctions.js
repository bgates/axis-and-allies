import { isLand, allUnits } from '../../../lib/territory'
import { survivors } from '../../../lib/unit'

const survivingUnitsFrom = ({ unitsFrom, attackerCasualties }, complete) => {
  return survivors(unitsFrom, attackerCasualties, complete)
}

const possiblyConquered = (territory, currentPower) => {
  let updatedTerritory = { ...territory, unitsFrom: [], units: territory.unitsFrom }
  if (territory.currentPower !== 'Oceans') {
    updatedTerritory.currentPower = currentPower
    updatedTerritory.newlyConquered = true
  }
  return updatedTerritory
}

const amphibUnits = (amphib, territories) => {
  return Object.keys(amphib).reduce((array, id) => {
    const territory = territories[amphib[id]];
    const transport = (allUnits(territory)).find(unit => unit.ids.includes(id));
    return array.concat(transport.cargo[id]);
  }, [])
}

const unitsFromIncludingAmphib = (territory, territories) => ( 
  [ ...territory.unitsFrom, ...amphibUnits(territory.amphib, territories) ]
)

//TODO: rename something like 'updateUnitStatus'
export const removeCasualties = (state, action) => {
  const { territoryIndex, defenderCasualties, currentPower } = action;
  const objective = state.territories[territoryIndex];
  return state.territories.map((territory, index) => {
    if (index === territoryIndex) {
      const unitsFrom = territory.amphib ? 
        unitsFromIncludingAmphib(territory, state.territories) : 
        survivingUnitsFrom(territory);
      const updatedTerritory = { 
        ...territory, 
        unitsFrom,
        attackerCasualties: [],
        units: survivors(territory.units, defenderCasualties)
      }
      delete updatedTerritory.amphib;
      return updatedTerritory;
    } else if (territory.unitsFrom.length && !territory.units.length) {
      return possiblyConquered(territory, currentPower);
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
