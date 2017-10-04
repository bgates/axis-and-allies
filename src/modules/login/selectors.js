export const getLoggedInPower = (firebase, { uid, email }) => {
  const db = firebase.database()
  return db.ref(`/users/${uid}`).once('value').then(snapshot => (    
    snapshot.val().currentGameId
  )).then(gameId => (
    db.ref(`/games/${gameId}`).once('value')
  )).then(snapshot => {
    const game = snapshot.val()  
    const { powers, currentPowerIndex } = game 
    const powersInOrder = [...powers.slice(currentPowerIndex), ...powers.slice(0, currentPowerIndex)]
    return powersInOrder.find(power => power.email === email)
  })
}

