import React from 'react'
import '../../../styles/history/HeaderContainer.scss'

const HeaderContainer = ({children}) => {
    
    return(
        <div className="records-sections">
            {
                children.map(item => {
                    return(
                        <div>{item}</div>
                    )
                })
            }
        </div>
    )
}

export default HeaderContainer;