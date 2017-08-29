import React from 'react';
import fire from '../../../assets/images/fire.gif';

const FireImage = () => {
  return (
    <pattern 
       id="p-fire" 
       viewBox="90 200 80 90"
       patternUnits="userSpaceOnUse"
       width="256" height="300"
       x="0" y="0">
        <image xlinkHref={fire} width="256" height="300"/>
    </pattern>
  )
}
export default FireImage;
