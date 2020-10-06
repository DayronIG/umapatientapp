//takes in an array of objects describing inputs, returns the rendered component
import React from 'react';
import {Audio, Slider, Search, Text, Video, Button, Breathe, Camera} from './components/Index';

const Inputs = (props) => {
  let output = {}
  const data = props.data
  const chatbot = props.chatbot
  return data.inputs.map((input, key)=>{

    if(input.type === "text") {
      return <Text key={key} data={input} style={input.options.style}/>
    } else if (input.type === "slider") {
      return <Slider key={key} data={input} style={input.options.style}/>
    } else if (input.type === "audio") {
      return <Audio key={key} data={input} style={input.options.style}/>
    } else if (input.type === "video") {
      return <Video key={key} data={input} style={input.options.style}/>
    } else if (input.type === "button") {
      return <Button key={key} data={input} style={input.options.style}/>
    } else if (input.type === "breathe") {
      return <Breathe key={key} data={input} style={input.options.style}/>
    } else if (input.type === "camera") {
      return <Camera key={key} data={input} style={input.options.style}/>
    } else if (input.type === "search") {
      return <Search key={key} chatbot={chatbot} data={input} style={input.options.style}/>
    } else return (
      <>
      <p>dafault input</p>
      </>
    )
  })
}


export default Inputs;