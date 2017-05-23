const roll = (n) => {
  let xRotations = Math.ceil(Math.random() * 10) * 360,
      yRotations = Math.ceil(Math.random() * 10) * 360
  switch (n) {
    case 1:
      return [`${xRotations}deg`, `${yRotations}deg`]
    case 2:
      return [`${xRotations + 90}deg`, `${yRotations}deg`]
    case 3:
      return [`${xRotations}deg`, `${yRotations + 90}deg`]
    case 4:
      return [`${xRotations}deg`, `${yRotations + 270}deg`]
    case 5:
      return [`${xRotations + 270}deg`, `${yRotations}deg`]
    default:
      return [`${xRotations + 180}deg`, `${yRotations}deg`]
  }
}
export default roll
