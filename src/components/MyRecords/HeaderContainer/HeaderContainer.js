import React from 'react'
import '../../../styles/history/HeaderContainer.scss'

const HeaderContainer = ({children}) => {
    
    return(
        <div className="records-sections">
            {children.length > 1 ? children.map (item => {
                return(
                    <div>{item}</div>
                )
            })
        :
        <div className="button-record">{children}</div>
        }
        </div>
    )
}

export default HeaderContainer;