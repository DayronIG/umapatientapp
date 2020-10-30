import React from 'react'
import QuestionAnswer from "./QuestionAnswer"
import { MdKeyboardArrowLeft } from "react-icons/md"

export default function FrequentQuestions({goBack}) {
    return (
        <div className="allwhite-hisopados-background">
            <div className="title-terms-frequent-container">
                <p onClick={() => goBack()} className="icon" ><MdKeyboardArrowLeft/></p>
                <p className="title">Preguntas frecuentes</p>
            </div>
            <QuestionAnswer />
        </div>)
}
