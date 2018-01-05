const roll = (n, randomX, randomY) => {
  const xRotations = Math.ceil(randomX * 10) * 360
  const yRotations = Math.ceil(randomY * 10) * 360
  return {
    1: [`${xRotations}deg`, `${yRotations}deg`],
    2: [`${xRotations + 90}deg`, `${yRotations}deg`],
    3: [`${xRotations}deg`, `${yRotations + 90}deg`],
    4: [`${xRotations}deg`, `${yRotations + 270}deg`],
    5: [`${xRotations + 270}deg`, `${yRotations}deg`],
    6: [`${xRotations + 180}deg`, `${yRotations}deg`]
  }[n]
}
export default roll
