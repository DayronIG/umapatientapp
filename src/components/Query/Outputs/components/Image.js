//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';
import mood from '../../assets/mood.jpeg'

const Example = (props) => {
  const data = props.data
  console.log(data)
  return (
    <>
      <img style={{width: '330px'}} src={mood}/>
    </>
  )
}


export default Example;