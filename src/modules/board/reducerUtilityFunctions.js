import { unitMatch } from '../../lib/unit'

export const territoryAfterUnitMoves = (territory, movingUnit, ids, leave = true) => {
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

export const territoryAfterUnitWithdraws = (territory, movingUnit, ids) => {
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

export const territoryAfterUnitEnters = (territory, movingUnit, ids, mission) => {
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

export const territoryAfterTransportCommits = (territory, transport, id, destinationIndex) => {
  let updatedUnitsFrom = territory.unitsFrom.map(unit => {
    if (unitMatch(unit, transport) && unit.ids.includes(id)) {
      let cargoDestinations = unit.cargoDestinations || {}
      return { ...unit, cargoDestinations: { ...cargoDestinations, [id]: destinationIndex } }
    } else {
      return unit
    }
  })
  return { ...territory, unitsFrom: updatedUnitsFrom }
}

export const territoryAfterAmphibCommits = (territory, transportOrigin, id) => {
  const amphib = territory.amphib || {}
  return { ...territory, amphib: { ...amphib, [id]: transportOrigin } }
}

export const territoryAfterAmphibUncommits = (territory, transport, id) => {
  let unitsFrom = territory.unitsFrom.map(unit => {
    if (unit.ids.includes(id)) {
      let cargoDestinations = Object.assign({}, unit.cargoDestinations);
      delete cargoDestinations[id];
      return { ...unit, cargoDestinations }
    } else {
      return unit
    }
  })
  return { ...territory, unitsFrom }
}
