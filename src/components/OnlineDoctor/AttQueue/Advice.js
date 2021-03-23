import React from 'react';
import {useSelector} from "react-redux";
import {FaInfoCircle} from "react-icons/fa";

export default function Advice() {
    const {guardia_advice} = useSelector((state) => state.front)

    return (
        <section className="advice__container">
        <div className="advice__content">
            {guardia_advice && guardia_advice} <FaInfoCircle className="icon" />
        </div>
        </section>
    )
}
