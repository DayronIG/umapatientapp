//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';


const Audio = (props) => {
  console.log('button', props)
  const data = props.data.options
  return (
    <>
      <button style={data.style}>{data.text}</button>
    </>
  )
}


export default Audio;