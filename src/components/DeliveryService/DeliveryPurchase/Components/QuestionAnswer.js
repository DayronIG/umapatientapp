import React, {useState} from 'react'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md"

export default function QuestionAnswer() {
    const [state, setState] = useState("none")
    return (
            <div className="questions-container">
                <div className="qa-container">
                    <div className="question-div">
                        <p>¿Cuáles son las ventajas de hacer un test rápido de hisopado a domicilio?</p>
                        {state === "none" ? <MdKeyboardArrowRight className="icon" onClick={()=>setState("block")}  />:
                        <MdKeyboardArrowDown className="icon" onClick={()=>setState("none")}  />}
                    </div>
                    <div className="answer-div" style={{display: state}}>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias dolores, accusamus sed est totam fugit ut hic suscipit voluptate nulla?
                    </p>
                </div>
                </div>
            </div>
    )
}
