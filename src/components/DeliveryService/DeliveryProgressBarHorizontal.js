import React, { useState, useEffect } from 'react';
import '../../styles/deliveryService/progressBarHorizontal.scss';

const DeliveryProgressBarHorizontal = ({ steps }) => {
    const [msg, setMsg] = useState('');
    
    useEffect(() => {
            const activeItems = steps.filter(item => item.active);
            const lastActiveItemMessage = activeItems[activeItems.length - 1]?.msg;

            if(!!lastActiveItemMessage) {
                setMsg(lastActiveItemMessage);
            }

    }, [steps]);

    return (
        <div className="ProgressHorizotal__container">    
            <ul className="ProgressHorizotal__list">
                {
                    steps.map((step, index) => {
                    return (
                        <li key={index} className={`ProgressHorizotal__listItems ${step.active ? 'active' : ''}`}>
                            <span>
                                {step.icon}
                            </span>
                        </li>
                    )  
                    })
                }
            </ul>

            {
                msg && 
                <p className="ProgressHorizotal__message">{msg}</p>
            }
        </div>
    )
}

export default DeliveryProgressBarHorizontal;