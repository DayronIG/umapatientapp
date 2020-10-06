import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import MobileModal from '../../GeneralComponents/Modal/MobileModal'
import Autonomous from '../../Autonomous'

const Autonomus = props => {

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  return (
    <>
      {
        !loading ? 
        <>
          <p className="question">¿Desea hacer el test autónomo?</p>
    
          <div>
            <button
              onClick={ () => {
                setLoading(true)
                dispatch({ type: 'TOGGLE_DETAIL' })
              }}
              className="btnSI"
            >Si</button>
            
            <button 
              onClick={ () => {
                dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
              }} 
              className="btnNO"
            >No</button>
          </div>
        </> :

        <div className="coronavirus__modal--container">
          <MobileModal title="Test autónomo" callback={() => dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })}>
            <div className="coronavirus__autonomousContainer">
              <Autonomous isModal={true} />
            </div>
          </MobileModal>
        </div>
      }      
    </>
  )
}

export default Autonomus
