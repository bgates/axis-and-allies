const rolls = (state = {}, action) => {
  switch (action.type) {
    case 'ROLLS':
      return { 
        player: action.playerRolls, 
        opponent: action.opponentRolls 
      }
    default:
      return state
  }
}
export default rolls
