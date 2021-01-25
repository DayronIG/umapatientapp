import React from 'react'
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useSelector} from 'react-redux'
import { faUserMd, faChevronRight, faFlask, faFileAlt } from '@fortawesome/free-solid-svg-icons'


const Events = (props) => {
    // let { data } = props
    const {ws} = useSelector(state => state.user)

    const renderEvents = () => {
        return (
            <>
            {/* {data.map((record, index) => {  */}
                {/* return (record.mr &&  */}
                        <div className="event" >
                            <div onClick={e => props.history.push(`/${ws}/recipes`)}>
                                <div className="section-icon" >
                                    <FontAwesomeIcon icon={faFileAlt} />
                                    <span>Recetas</span>
                                </div>
                                <FontAwesomeIcon style={{color: "#719397"}} icon={faChevronRight} /> 
                            </div>
                            <hr/>
                            <div>
                                <div className="section-icon">
                                    <FontAwesomeIcon icon={faFlask} />
                                    <span>Órdenes y análisis</span>
                                </div>
                                <FontAwesomeIcon style={{color: "#719397"}} icon={faChevronRight} /> 
                            </div>
                            <hr/>
                            <div onClick={e => props.history.push(`/${ws}/record`)}>
                                <div className="section-icon"  >
                                    <FontAwesomeIcon icon={faUserMd} />
                                    <span>Consultas</span>
                                </div>
                                <FontAwesomeIcon style={{color: "#719397"}} icon={faChevronRight} /> 
                            </div>
                            
                        </div>
                     {/* )    */}
             {/* })} */}
            </>
        )
    }
    return (
        <>
            {renderEvents()}
        </>
    )
}

export default withRouter(Events);