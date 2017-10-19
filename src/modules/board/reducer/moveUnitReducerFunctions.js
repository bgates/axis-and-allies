import {
  territoryAfterUnitEnters,
  territoryAfterUnitMoves,
  territoryAfterUnitWithdraws,
  territoryAfterTransportCommits,
  territoryAfterAmphibCommits,
  territoryAfterAmphibUncommits
} from './reducerUtilityFunctions';

export const landPlanes = (state, action) => {
  const { planesFrom } = action;
  const newState = JSON.parse(JSON.stringify(state.territories));
  Object.keys(planesFrom).forEach(index => {
    let territory = newState[index];
    let planesDestinations = planesFrom[index];
    let planes = territory.units.filter(u => u.air);
    territory.units = territory.units.filter(u => !u.air);
    Object.keys(planesDestinations).forEach(planeId => {
      let territory = newState[planesDestinations[planeId]];
      let plane = planes.find(p => `${p.name}-${p.originName}` === planeId);
      territory.units = [ ...territory.units, plane ]
    })
  })
  return newState
}

export const commitUnits = (state, action) => {
  let { destinationIndex, movingUnit, ids, mission } = action;
  return moveUnits(state, movingUnit, movingUnit.originIndex, destinationIndex, ids, mission);
}

const moveUnits = (state, movingUnit, originIndex, destinationIndex, ids, mission) => {
  return state.territories.map((territory, index) => {
    if (index === originIndex) {
      return territoryAfterUnitMoves(territory, movingUnit, ids);
    } else if (index === destinationIndex) {
      return territoryAfterUnitEnters(territory, movingUnit, ids, mission, index);
    } else {
      return territory
    }
  });
}

export const commitAmphibUnits = (state, action) => {
  const { transport, destinationIndex, id } = action;
  const originIndex = transport.originIndex;
  return state.territories.map((territory, index) => {
    if (index === originIndex) {
      return territoryAfterTransportCommits(territory, transport, id, destinationIndex);
    } else if (index === destinationIndex){
      return territoryAfterAmphibCommits(territory, originIndex, id);
    } else {
      return territory
    }
  });
}

const byId = id => unit => unit.ids.includes(id)

const unitsWithUpdatedTransport = (units, id, transport) => (
  units.filter(u => !u.ids.includes(id)).concat(transport)
)

export const uncommitUnits = ({ territories }, action) => {
  let { unit, destinationIndex, ids } = action;
  let cargoOrigin, transport, id;
  if (unit.transport) {
    id = ids[0];
    transport = territories[destinationIndex].unitsFrom.find(byId(id)) ||
      territories[destinationIndex].units.find(byId(id));
    if (transport.cargo) {
      cargoOrigin = transport.cargo[id][0].originIndex;
    }
  }
  // not handling uncommitting from transport which loads w/out moving
  return territories.map((territory, index) => {
    if (index === unit.originIndex) {
      if (index === destinationIndex) {
        const unloadedTransport = JSON.parse(JSON.stringify(transport))
        delete unloadedTransport.cargo[id]
        if (Object.keys(unloadedTransport.cargo).length === 0) {
          delete unloadedTransport.cargo
        }
        const units = unitsWithUpdatedTransport(territory.units, id, unloadedTransport)
        return { ...territory, units }
      }
      return territoryAfterUnitMoves(territory, unit, ids, false);
    } else if (index === destinationIndex) {
      return territoryAfterUnitWithdraws(territory, unit, ids);
    } else if (index === cargoOrigin) {
      return transport.cargo[id].reduce((t, u) => territoryAfterUnitMoves(t, u, u.ids, false), territory)
    } else {
      return territory
    }
  });
}

export const uncommitAmphibUnits = (state, action) => {
  // transport.cargoDestinations needs to lose prop based on transport id; t.cD[id] territory must lose its amphib prop
  const { id, destinationIndex, transport } = action;
  return state.territories.map((territory, index) => {
    if (index === destinationIndex) {
      let amphib = Object.assign({}, territory.amphib);
      delete amphib[id];
      return { ...territory, amphib }
    } else if (index === transport.originIndex) {
      return territoryAfterAmphibUncommits(territory, transport, id);
    } else {
      return territory
    }
  })
}

export const loadTransport = (state, action) => {
  const { units, destinationIndex, transport } = action;
  return state.territories.map((territory, index) => {
    if (index === units[0].originIndex) {
      return units.reduce((t, unit) => territoryAfterUnitMoves(t, unit, unit.ids), territory);
    } else if (index === transport.unit.originIndex) {
      if (index === destinationIndex) {
        const loadedTransport = { ...transport.unit, cargo: {...transport.unit.cargo, [transport.id]: units}}
        const allUnits = unitsWithUpdatedTransport(territory.units, transport.id, loadedTransport)
        return { ...territory, units: allUnits }
      }
      return territoryAfterUnitMoves(territory, transport.unit, [transport.id]);
    } else if (index === destinationIndex) {
      const loadedTransport = { ...transport.unit, cargo: {...transport.unit.cargo, [transport.id]: units}}
      return territoryAfterUnitEnters(territory, loadedTransport, [transport.id], null, index);
    } else {
      return territory
    }
  });
}

//TODO: if retreat includes loaded transport, cancel amphib
export const retreat = (state, action) => {
  const { battleTerritoryIndex, retreatTerritoryIndex } = action
  const battleTerritory = state.territories[battleTerritoryIndex]
  return state.territories.map((territory, index) => {
    if (index === battleTerritoryIndex) {
      return { ...territory, unitsFrom: [] }
    } else if (index === retreatTerritoryIndex) {
      return battleTerritory.unitsFrom.reduce((t, unit) => territoryAfterUnitEnters(t, unit, unit.ids, 'retreat', index), territory)
    } else {
      return territory
    }
  })
}
