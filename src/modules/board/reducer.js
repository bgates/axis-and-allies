import Parser from '../../lib/Parser.js'
import startingBoard from '../../config/startingBoard'
import territoryData from '../../config/territories.json'
import { unitMatch } from '../../lib/unit'

const parsedBoard = Parser.hydrate(startingBoard)

const initialBoard = territoryData.map((territory, i) => {
  return {
    units: parsedBoard[i],
    unitsFrom: [],
    currentPower: territory.original_power
  }
  //TODO: currentPower should be controllingPower
})

const territoryAfterUnitMoves = (territory, movingUnit, ids, leave = true) => {
  let updatedUnits = territory.units.map(unit => {
    if (unitMatch(unit, movingUnit, 'power')) {
      let newIds = leave ? unit.ids.filter(id => !ids.includes(id)) : unit.ids.concat(ids)
      return { ...unit, ids: newIds }
    } else {
      return unit
    }
  })
  return { ...territory, units: updatedUnits }
}

const territoryAfterUnitWithdraws = (territory, movingUnit, ids) => {
  let updatedUnitsFrom = territory.unitsFrom.map(unit => {
    if (unitMatch(unit, movingUnit, 'originIndex')) {
      return { ...unit, ids: unit.ids.filter(id => !ids.includes(id)) }
    } else {
      return unit
    }
  })
  updatedUnitsFrom = updatedUnitsFrom.filter(unit => unit.ids.length)
  return { ...territory, unitsFrom: updatedUnitsFrom }
}

const territoryAfterUnitEnters = (territory, movingUnit, ids, mission) => {
  let newUnit = true;
  let updatedUnitsFrom = territory.unitsFrom.map(unit => {
    if (unitMatch(unit, movingUnit, mission, 'originIndex')) {
      newUnit = false;
      return { ...unit, ids: unit.ids.concat(ids), mission }
    } else {
      return unit
    }
  })
  if (newUnit) {
    updatedUnitsFrom.push({ ...movingUnit, ids, mission })
  }
  return { ...territory, unitsFrom: updatedUnitsFrom }
}

const board = (state = initialBoard, action) => {
  switch (action.type) {
    case 'COMMIT_UNITS': {
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
    case 'UNCOMMIT_UNITS': {
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
    case 'LOAD_TRANSPORT': {
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
    default:
      return state
  }
}
export default board
