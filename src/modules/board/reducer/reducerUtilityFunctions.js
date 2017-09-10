import { unitMatch } from '../../../lib/unit'

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

const unitsWithCargoDestinations = (transport, id, destinationIndex) => unit => {
  if (unitMatch(unit, transport) && unit.ids.includes(id)) {
    let cargoDestinations = unit.cargoDestinations || {}
    return { ...unit, cargoDestinations: { ...cargoDestinations, [id]: destinationIndex } }
  } else {
    return unit
  }
}

export const territoryAfterTransportCommits = (territory, transport, id, destinationIndex) => {
  const unitsFrom = territory.unitsFrom.map(unitsWithCargoDestinations(transport, id, destinationIndex));
  const units = territory.units.map(unitsWithCargoDestinations(transport, id, destinationIndex));
  return { ...territory, units, unitsFrom }
}

export const territoryAfterAmphibCommits = (territory, transportOrigin, id) => {
  const amphib = territory.amphib || {}
  return { ...territory, amphib: { ...amphib, [id]: transportOrigin } }
}

const unitsWithoutCargoDestination = id => unit => {
  if (unit.ids.includes(id)) {
    let cargoDestinations = Object.assign({}, unit.cargoDestinations);
    delete cargoDestinations[id];
    return { ...unit, cargoDestinations }
  } else {
    return unit
  }
}

export const territoryAfterAmphibUncommits = (territory, transport, id) => {
  const unitsFrom = territory.unitsFrom.map(unitsWithoutCargoDestination(id))
  const units = territory.units.map(unitsWithoutCargoDestination(id))
  return { ...territory, units, unitsFrom }
}
