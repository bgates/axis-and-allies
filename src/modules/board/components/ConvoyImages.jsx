import React from 'react'
import ussrConvoy from '../../../assets/images/units/ussr_convoy.png'
import italyConvoy from '../../../assets/images/units/italy_convoy.png'
import ukConvoy from '../../../assets/images/units/uk_convoy.png'
import usConvoy from '../../../assets/images/units/us_convoy.png'
import japanConvoy from '../../../assets/images/units/japan_convoy.png'
import ussrConvoyDistress from '../../../assets/images/units/ussr_convoy_distress.png'
import italyConvoyDistress from '../../../assets/images/units/italy_convoy_distress.png'
import ukConvoyDistress from '../../../assets/images/units/uk_convoy_distress.png'
import usConvoyDistress from '../../../assets/images/units/us_convoy_distress.png'
import japanConvoyDistress from '../../../assets/images/units/japan_convoy_distress.png'

const ConvoyImage = ({ power, img }) => (
  <pattern
    id={`${power}_convoy`}
    patternUnits="objectBoundingBox"
    width="100"
    height="50"
    key={`${power}Pattern`}>
    <image
      xlinkHref={img}
      x="0"
      y="0"
      width="100"
      height="50"></image>
  </pattern>
)

const ConvoyImages = () => {
  const navalPowers = ['ussr', 'japan', 'uk', 'italy', 'us']
  const images = { 
    ussr: ussrConvoy, 
    japan: japanConvoy, 
    uk: ukConvoy, 
    italy: italyConvoy, 
    us: usConvoy,
    ussrDistress: ussrConvoyDistress, 
    japanDistress: japanConvoyDistress, 
    ukDistress: ukConvoyDistress, 
    italyDistress: italyConvoyDistress,
    usDistress: usConvoyDistress
  }
  return (
    <defs>
      {navalPowers.map((power, index) => {
        return <ConvoyImage key={index} power={power} img={images[power]}/>
      })}
      {navalPowers.map((power, index) => {
        return <ConvoyImage key={index + 5} power={`${power}_distress`} img={images[`${power}Distress`]}/>
      })}
    </defs>
  )
}
export default ConvoyImages
