//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';
import {Audio, Text, Video, Chart, Example, Image, SlidingCards} from './components/Index';

const Outputs = (props) => {
  const data = props.data

  return data.outputs.map((output, key) =>{

    if(output.type === "text") {
      return <Text key={key} data={output} className={output.options.style}/>
    } else if (output.type === "Audio") {
      return <Audio key={key} data={output} className={output.options.style}/>
    } else if (output.type === "video") {
      return <Video key={key} data={output} className={output.options.style}/>
    } else if (output.type === "chart") {
      return <Chart key={key} data={output} className={output.options.style}/>
    } else if (output.type === "image") {
      return <Image key={key} data={output} className={output.options.style}/>
    } else if (output.type === "slidingCard") {
      return <SlidingCards key={key} data={output} className={output.options.style}/>
    } else return (
      <>
      <Example>dafault output</Example>
      </>
    )
  })
}


export default Outputs;