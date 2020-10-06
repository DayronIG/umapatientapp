//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';


const Message = (props) => {
  const replacer = (template, obj) => {
    let keys = Object.keys(obj);
    console.log(keys, obj, template)
    let func = Function(...keys, "return `" + template  + "`;")
    return func(...keys.map(k => obj[k]))
  }
  if(props.params.split('${').length > 1){   
    const text = props.params
    const data = props.data
    let newtext = replacer(text, data)
    return (
      <>
        <p>{newtext}</p>
      </>
    )
  } else {
    return (
      <>
        <p>{props.params}</p>
      </>
    )
  }
}


export default Message;