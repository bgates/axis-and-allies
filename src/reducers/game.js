export const game = (state = {}, action) => {
  switch(action.type) {
    case SET_GAME_ID:
      return { ...state, id: action.id }
    default:
      return state
  }
}
