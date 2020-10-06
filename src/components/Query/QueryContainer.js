import React, { useState, useEffect } from 'react';

import Inputs from './Inputs/Inputs';
import Outputs from './Outputs/Outputs';

const QueryContainer = (props) => {
  const [publish, setPublish] = useState()
  useEffect(()=>{
    const topic = publish?.topic || ''
    const message = publish?.message || ''
  },[publish])
  
  const data = props.step.metadata.query
  return (
    <>
      <div style={data.style}>
        <Outputs style={data.outputs.style} chatbot={props}  data={data.outputs}/>
      </div>
      <div className={data.style.container}>
        <Inputs publish={e=>setPublish(e)} style={data.inputs.style} chatbot={props} data={data.inputs}/>
      </div>
    </>
  )
}


export default QueryContainer;