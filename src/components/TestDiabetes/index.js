import React, { useState } from 'react'
import icon from '../../assets/icon.png'
import './diabetes.scss'
import Form from './Form'
import TermsAndConditions from './TermsAndConditions'
import PictureTest from './PictureTest'

const Index = () => {

    const [step, setStep] = useState(0)
    
    return (
    <>
        <div className='testDiabetes__main'>
            <div className='testDiabetes__header'>
                <h1>Test Diabetes</h1>
            </div>

            {step === 0 ?
            <TermsAndConditions step={step} setStep={setStep}/>
            :
            step === 1 ?
                <Form step={step} setStep={setStep}/>
            :
            step === 2 ?
            <PictureTest step={step} setStep={setStep}/>
            :
            'asd'}
        </div>

    </>
    )
}

export default Index
