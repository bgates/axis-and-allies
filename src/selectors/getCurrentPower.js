import { createSelector } from 'reselect';

export const getPowers = (state) => state.board.powers

const currentPowerIndex = (state) => state.board.currentPowerIndex 

export const getCurrentPower = createSelector(
  getPowers,
  currentPowerIndex,
  (powers, index) => powers[index]
);

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
