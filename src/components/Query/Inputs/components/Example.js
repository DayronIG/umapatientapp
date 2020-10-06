//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';


const Example = (props) => {
  const data = props.data.type
  console.log(data)
  return (
    <>
      <p>this is an Example component</p>
    </>
  )
}


export default Example;