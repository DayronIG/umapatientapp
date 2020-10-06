//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';

const Text = (props) => {
  const data = props.data.type
  console.log(data)
  return (
    <>
      <p>{props.data.content}</p>
    </>
  )
}


export default Text;