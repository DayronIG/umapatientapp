import React from 'react';
import '../../../styles/history/HeaderContainer.scss';

const HeaderContainer = ({children}) => {
    
    return(
        <div className="records-sections">
            {
                children.map(item => {
                    return(
                        <section>{item}</section>
                    )
                })
            }
        </div>
    )
}

export default HeaderContainer;