const rolls = (state = {}, action) => {
  switch (action.type) {
    case 'ROLLS':
      return { ...state, [action.purpose]: action.rolls }
    case 'CLEAR_ROLLS':
      return []
    default:
      return state
  }
}
export default rolls
