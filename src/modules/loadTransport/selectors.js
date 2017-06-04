import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { isLand, isSea, isFriendly } from '../../lib/territory';
import unitTypes from '../../config/unitTypes';
export { getFocusTerritory }

const _hasLoadable = (territory, currentPower) => {
  return isFriendly(territory, currentPower) && 
    territory.units.some(u => u.land && u.power === currentPower.name)
}

const notBy = (i, territory) => !territory.adjacentIndexes.includes(i);

const loadableSources = (currentPower, destination, origin, board) => {
  const onMap = (i) => board[i];
  const notByOrigin = (i) => notBy(i, origin);
  const notByDestination = (i) => notBy(i, destination);
  const hasLoadableUnits = (territory) => _hasLoadable(territory, currentPower);
  const landBorderingOrigin = origin.adjacentIndexes
    .map(onMap).filter(isLand).filter(hasLoadableUnits);
  const landBorderingDestination = destination.adjacentIndexes
    .filter(notByOrigin).map(onMap)
    .filter(isLand).filter(hasLoadableUnits);
  const landBorderingSeaBetween = origin.adjacentIndexes
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
    }, []);
  return [...landBorderingOrigin,
    ...landBorderingDestination,
    ...landBorderingSeaBetween]
}

const loadableUnits = (currentPower, destination, origin, board) => {
  const sources = loadableSources(currentPower, destination, origin, board);
  let options = [];
  let landUnits = Object.values(unitTypes).filter(u => u.land);
  sources.forEach(source => {
    let inf = source.units.find(u => {
      return u.power === currentPower.name && u.name === 'infantry'
    });
    landUnits.forEach(unitType => {
      const unit = source.units.find(u => {
        return u.power === currentPower.name && u.name === unitType.name
      })
      if (unit && unit.ids.length) {
        const ids = unit.ids;
        options.push({ origin: source, units: [{...unit, ids: [ids[0]]}] })
        if (unit.name === 'infantry') {
          if (inf.ids.length > 1) {
            options.push({ origin: source, units: [{...unit, ids: ids.slice(0, 2) }] })
          }
        } else if (inf) {
          options.push({ origin: source, units: [{...inf, ids: [inf.ids[0]]}, { ...unit, ids: [ids[0]] }] })
        }
      }
    })
  })
  return options.map(option => {
    return option.units.map(unit => {
      return { ...unit, originName: option.origin.name, originIndex: option.origin.index }
    })
  })
}

export const getLoadableUnits = createSelector(
  getCurrentPower,
  getFocusTerritory,
  state => state.phase.transport,
  mergeBoardAndTerritories,
  (currentPower, territory, transport, board) => loadableUnits(currentPower, territory, board[transport.unit.originIndex], board)
)

