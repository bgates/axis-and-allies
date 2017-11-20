import { createSelector } from 'reselect'
import { isEmpty } from 'react-redux-firebase'

export const getPowers = state => state.powers

const currentPowerIndex = state => state.currentPowerIndex 

export const getCurrentPower = createSelector(
  getPowers,
  currentPowerIndex,
  (powers, index) => powers[index]
)

export const getCurrentPowerName = createSelector(
  getCurrentPower,
  currentPower => currentPower.name
)

export const loggedInAsCurrentPower = createSelector(
  getCurrentPower
)

const getProfilePowers = ({ firebase }) => firebase.profile[firebase.profile.currentGameId]

export const getLoggedInPower = createSelector(
  getProfilePowers,
  getPowers,
  currentPowerIndex,
  (profilePowers, powers, currentPowerIndex) => { 
    if (profilePowers ) {
      const powerName = [...powers.slice(currentPowerIndex), ...powers.slice(0, currentPowerIndex)]
        .map(power => power.name).find(name => profilePowers[name])
      return { name: powerName, screenname: profilePowers[powerName] }
    } else {
      return {}
    }
  }
)

export const isCurrentPower = createSelector(
  state => state.firebase.auth,
  getCurrentPower,
  getLoggedInPower,
  (auth, currentPower, loggedInPower) => isEmpty(auth) || currentPower.name === loggedInPower.name
)
