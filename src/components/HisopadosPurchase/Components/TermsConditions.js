import React from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"

export default function TermsConditions({goBack}) {
    return (
        <div className="allwhite-hisopados-background">
            <div className="title-terms-frequent-container">
                <p onClick={() => goBack()} className="icon" ><MdKeyboardArrowLeft/></p>
                <p className="title">Términos y condiciones</p>
            </div>
        </div>)
}
