const roll = (n) => {
  const xRotations = Math.ceil(Math.random() * 10) * 360,
      yRotations = Math.ceil(Math.random() * 10) * 360
  const rotations = {
    1: [`${xRotations}deg`, `${yRotations}deg`],
    2: [`${xRotations + 90}deg`, `${yRotations}deg`],
    3: [`${xRotations}deg`, `${yRotations + 90}deg`],
    4: [`${xRotations}deg`, `${yRotations + 270}deg`],
    5: [`${xRotations + 270}deg`, `${yRotations}deg`],
    6: [`${xRotations + 180}deg`, `${yRotations}deg`]
  }
  return rotations[n]
}
export default roll
