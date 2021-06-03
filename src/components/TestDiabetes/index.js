import React, { useState } from 'react'
import icon from '../../assets/icon.png'
import './diabetes.scss'
import Form from './Form'
import TermsAndConditions from './TermsAndConditions'
import PictureTest from './PictureTest'
import Test from './Test'
import {FaArrowLeft} from 'react-icons/fa' 

const Index = () => {

    const [step, setStep] = useState(0)

    const previousStep = (step) => {
        if(step !== 0){
            setStep(step - 1)
        }
        else{
            console.log('asd')
        }
    }
    
    return (
    <>
        <div className='testDiabetes__main'>
            <div className='testDiabetes__header'>
                    <FaArrowLeft style={{color:'white'}} onClick={() => previousStep(step)}/>
                {/* <h1>Test Diabetes</h1> */}
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
            ''}
        </div>

    </>
    )
}

export default Index
