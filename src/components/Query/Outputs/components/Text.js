//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';


const Text = (props) => {
  const data = props.data
  console.log(data)
  return (
    <>
      <p style={data.options.style}>{props.data.content}</p>
    </>
  )
}


export default Text;