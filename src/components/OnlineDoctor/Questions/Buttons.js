import React, { useState } from 'react'

const Buttons = ({ handleChange, symp }) => {

  const [yes, setYes] = useState(false);
  const [no, setNo] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          handleChange(true, symp.label)
          setYes(true);
          setNo(false);
        }}
        className={`${yes && 'yes-active'}`}
        type="button"
      >Si</button>
      <button
        onClick={() => {
          handleChange(false, symp.label)
          setNo(true);
          setYes(false);
        }}
        className={`${no && 'no-active'}`}
        type="button"
      >No</button>
    </>
  )
}

export default Buttons
