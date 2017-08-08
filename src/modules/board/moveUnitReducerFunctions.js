import {
  territoryAfterUnitEnters,
  territoryAfterUnitMoves,
  territoryAfterUnitWithdraws
} from './reducerUtilityFunctions';

export const commitUnits = (state, action) => {
  let { destinationIndex, movingUnit, ids, mission } = action;
  return state.map((territory, index) => {
    if (index === movingUnit.originIndex) {
      return territoryAfterUnitMoves(territory, movingUnit, ids);
    } else if (index === destinationIndex) {
      return territoryAfterUnitEnters(territory, movingUnit, ids, mission);
    } else {
      return territory
    }
  });
}

export const uncommitUnits = (state, action) => {
  let { unit, destinationIndex, ids } = action;
  let cargoOrigin, transport, id;
  if (unit.transport) {
    id = ids[0];
    transport = state[destinationIndex].unitsFrom.find(unit => unit.ids.includes(id))
    cargoOrigin = transport.cargo[id][0].originIndex;
  }
  return state.map((territory, index) => {
    if (index === unit.originIndex) {
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

export const loadTransport = (state, action) => {
  const { units, destinationIndex, transport } = action;
  return state.map((territory, index) => {
    if (index === units[0].originIndex) {
      return units.reduce((t, unit) => territoryAfterUnitMoves(t, unit, unit.ids), territory);
    } else if (index === transport.unit.originIndex) {
      return territoryAfterUnitMoves(territory, transport.unit, [transport.id]);
    } else if (index === destinationIndex) {
      const loadedTransport = { ...transport.unit, cargo: {...transport.unit.cargo, [transport.id]: units}}
      return territoryAfterUnitEnters(territory, loadedTransport, [transport.id]);
    } else {
      return territory
    }
  });
}
