import React, { useState } from 'react'
import '../../../styles/hisopado/hisopadosFlux.scss';
import ReferredRegister from "./Components/ReferredRegister"
import Referred from "./Components/Referred"

export default function ReferredIndex() {
    const [doneRegister, setDoneRegister] = useState(false)
    return (
        <div>
            {doneRegister? <ReferredRegister finalAction={() => setDoneRegister(true)} />: <Referred />}
        </div>
    )
}
