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

export const territoryAfterTransportUnloads = (territory, transport, id, destinationIndex) => {
  let updatedUnitsFrom = territory.unitsFrom.map(unit => {
    if (unitMatch(unit, transport, 'originIndex')) {
      let destinations = unit.destinations || {}
      let cargo = unit.cargo
      return { ...unit, destinations: { ...destinations, [id]: destinationIndex, cargo: { ...cargo, [id]: [] } }}
    } else {
      return unit
    }
  })
  return { ...territory, unitsFrom: updatedUnitsFrom }
}

export const territoryAfterAmphibCommit = (territory, units, transportId, originIndex) => {
  let amphibUnits = units.map(unit => {
    return { ...unit, transportedBy: transportId, transportedFrom: originIndex }
  })
  let updatedUnitsFrom = [ ...territory.unitsFrom, ...amphibUnits ]
  return { ...territory, unitsFrom: updatedUnitsFrom }
}
