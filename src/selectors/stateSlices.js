export const getAmphib = state => state.amphib

export const getAllInbound = state => state.inboundUnits

export const getAllOutbound = state => state.outboundUnits

export const getAllUnits = state => state.units

export const getAttackerCasualties = state => state.casualties

export const getBombardment = state => state.bombardment 

export const getBombedTerritories = state => state.strategicBombing.targetTerritories

export const getCombatUnderway = state => state.combatUnderway

export const getCompletedMissions = state => state.missionComplete

export const getCurrentPhase = state => state.phase.current

export const getCurrentTerritoryIndex = state => state.phase.territoryIndex

export const getDestinations = state => state.unitDestination

export const getDogfights = state => state.dogfight

export const getFlights = state => state.flightDistance

export const getInboundUnits = state => state.inboundUnits

export const getPathname = state => state.router.location.pathname

export const getCurrentTransport = state => state.phase.transport

export const getPhase = state => state.phase

export const getPlacement = state => state.placement

export const getPurchases = state => state.purchases

export const getRecentlyConquered = state => state.conquered

export const getResearch = state => state.research

export const getRolls = state => state.rolls

export const getSelectedOptions = state => state.landPlanes

export const getSelectedRocketTargets = state => state.rocketTargets

export const getTransport = state => state.transport
