const rolls = (state = {}, action) => {
  switch (action.type) {
    case 'ROLLS':
      return { ...state, [action.phase]: action.rolls }
    default:
      return state
  }
}
export default rolls
