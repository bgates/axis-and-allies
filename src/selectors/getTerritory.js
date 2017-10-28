import { createSelector } from 'reselect'
import territoryData from '../config/territories.json'

export const getTerritoryData = (_, territoryIndex) => territoryData[territoryIndex]

export const getTerritory = (state, territoryIndex) => state.territories[territoryIndex]
