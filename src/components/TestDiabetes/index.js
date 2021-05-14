import React from 'react'
import logo from '../../assets/icons/icon.png'
import './diabetes.scss'
import Form from './Form'

const index = () => {
    
    return (
        <>
        <div className='testDiabetes__main'>
            <div className='testDiabetes__header'>
                <h1>Test Diabetes</h1>
                {/* <img src={logo}></img> */}
            </div>
            <Form/>
        </div>

        </>
    )
}

export default index
