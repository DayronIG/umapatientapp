//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';




const Video = (props) => {
  const data = props.data
  return (
    <>

    <video autoPlay muted src={data} />
    </>
  )
}


export default Video;