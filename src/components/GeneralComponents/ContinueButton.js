import React from 'react'
import '../../styles/generalcomponents/ContinueButton.scss'
const ContinueButton = (props) => {
    return (
        <div className="buttonContainer">
            <button onClick={() => props.callback()} >
                {props.children}
            </button>
        </div>
    )
}

export default ContinueButton