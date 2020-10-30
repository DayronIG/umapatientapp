import React, {useState} from 'react'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md"

export default function QuestionAnswer({question, answer}) {
    const [state, setState] = useState("none")
    return (
            <div className="questions-container">
                <div className="qa-container">
                    <div className="question-div">
                    <p>{question}</p>
                        {state === "none" ? <MdKeyboardArrowRight className="icon" onClick={()=>setState("block")}  />:
                        <MdKeyboardArrowDown className="icon" onClick={()=>setState("none")}  />}
                    </div>
                    <div className="answer-div" style={{display: state}}>
                    <div>
                        {
                            (typeof answer === "object")?
                            <ul>
                                {answer.map((item) => <li>{item}</li>)}
                            </ul>
                            :
                            answer
                        }
                    </div>
                </div>
                </div>
            </div>
    )
}
