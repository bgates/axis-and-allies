const rolls = (state = {}, action) => {
  switch (action.type) {
    case 'PLAYER_ROLL':
      return { player: action.rolls }
    default:
      return state
  }
}
export default rolls
