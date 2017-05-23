import React from 'react';
import ussrConvoy from '../../assets/images/units/ussr_convoy.png';
import italyConvoy from '../../assets/images/units/italy_convoy.png';
import ukConvoy from '../../assets/images/units/uk_convoy.png';
import usConvoy from '../../assets/images/units/us_convoy.png';
import japanConvoy from '../../assets/images/units/japan_convoy.png';

const ConvoyImage = (props) => {
  const power = props.power;
  return (
    <pattern
      id={`${power}_convoy`}
      patternUnits="objectBoundingBox"
      width="100"
      height="50"
      key={`${power}Pattern`}>
      <image
        xlinkHref={props.img}
        x="0"
        y="0"
        width="100"
        height="50"></image>
    </pattern>
  )
}
const ConvoyImages = () => {
  const navalPowers = ['ussr', 'japan', 'uk', 'italy', 'us'];
  let images = { ussr: ussrConvoy, japan: japanConvoy, uk: ukConvoy, italy: italyConvoy, us: usConvoy };
  return (
    <defs>
      {navalPowers.map((power, index) => {
        return <ConvoyImage key={index} power={power} img={images[power]}/>
      })}
    </defs>
  )
}
export default ConvoyImages;
