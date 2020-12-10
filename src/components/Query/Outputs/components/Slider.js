import React, { useState, useEffect } from 'react';

import moment from 'moment-timezone';


const Slider = (props) => {
  const data = props.data
  const style = props.style
  return (
    <>
        <div className={style}>
          <input type="range" min={data.options.range[0]} max={data.options.range[1]} value={data.options.value}  className="slider" id="myRange"></input>
        </div>

    </>
  )
}


export default Slider;