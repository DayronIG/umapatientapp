import React from 'react';
import '../../../styles/user/genericComponents.scss';


export default function Modal({children}) {
    return (    
        <div className='modal__container'>
            {children}
        </div>
    )
}
