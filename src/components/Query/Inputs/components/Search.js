//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';

const Search = (props) => {
    const [ input, setInput ] = useState('')
    const names = props.data.options.items;
    const selectOption = (option) => {
      if(option !== ''){
        props.chatbot.triggerNextStep({ value: option });
      }
    }
    
    return (
      <>
        <input 
          onChange={e => setInput(e.target.value)}
          value={input} 
          type="text" 
          placeholder="Filtrar resultados..."
        />
        <ul>
          {
            names.filter(d => d.toLowerCase().includes(input.toLowerCase()))
            .map((d, i) => (
              <button onClick={() => selectOption(d)} key={i}>
                {d}
              </button>
            ))
          }
        </ul>
      </>
    );
  }


export default Search;