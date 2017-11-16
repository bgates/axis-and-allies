import { createSelector } from 'reselect'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  mergeBoardAndTerritories, 
  getFocusTerritory,
  getMovedUnitIds,
  isFriendly,
  isLand,
  isSea
} from '../../selectors/getTerritory'
import { land } from '../../selectors/units'
import unitTypes from '../../config/unitTypes'
export { getFocusTerritory }

const _hasLoadable = (territory, currentPower) => {
  return isFriendly(territory, currentPower) && 
    territory.units.some(u => land(u) && u.power === currentPower)
}

const notBy = (i, territory) => !territory.adjacentIndexes.includes(i)

const loadableSources = (currentPower, destination, origin, territories) => {
  const onMap = (i) => territories[i]
  const notByOrigin = (i) => notBy(i, origin)
  const notByDestination = (i) => notBy(i, destination)
  const hasLoadableUnits = (territory) => _hasLoadable(territory, currentPower)
  const landBorderingOrigin = origin.adjacentIndexes
    .map(onMap).filter(isLand).filter(hasLoadableUnits)
  const landBorderingDestination = destination.adjacentIndexes
    .filter(notByOrigin).map(onMap)
    .filter(isLand).filter(hasLoadableUnits)
  return origin.adjacentIndexes
    .filter(i => destination.adjacentIndexes.includes(i))
    .map(onMap)
    .filter(isSea)
    .reduce((arr, territory) => {
      return territory.adjacentIndexes
        .filter(notByOrigin)
        .filter(notByDestination)
        .map(onMap).filter(isLand).filter(hasLoadableUnits)
        .filter(territory => !arr.includes(territory))
        .concat(arr)
    }, [...landBorderingOrigin, ...landBorderingDestination])
}

const loadableUnits = (currentPower, destination, movedUnitIds, origin, board) => {
  const territories = board.map(territory => (
    { ...territory, units: territory.units.filter(({ id }) => !movedUnitIds[id]) }
  ))
  const sources = loadableSources(currentPower, destination, origin, territories)
  const landUnits = Object.values(unitTypes).filter(u => u.land)
  const isType = type => u => u.power === currentPower && u.type === type
  return sources.reduce((all, source) => {
    const inf = source.units.find(isType('infantry'))
    const { name, index } = source
    const currentOption = { originName: name, originIndex: index }
    return all.concat(landUnits.reduce((options, { name }) => {
      const unit = source.units.find(isType(name))
      if (unit) {
        options.push({ ...currentOption, units: [unit] })
        if (unit.type === 'infantry') {
          const infantry = source.units.filter(isType('infantry'))
          if (infantry.length > 1) {
            options.push({ ...currentOption, units: infantry.slice(0, 2) })
          }
        } else if (inf) {
          options.push({ ...currentOption, units: [inf, unit] })
        }
      }
      return options
    }, []))
  }, [])
}

export const getLoadableUnits = createSelector(
  getCurrentPowerName,
  getFocusTerritory,
  getMovedUnitIds,
  state => state.phase.transport,
  mergeBoardAndTerritories,
  (currentPower, territory, movedUnitIds, transport, board) => (
    loadableUnits(currentPower, territory, movedUnitIds, board[transport.originIndex], board)
  )
)

