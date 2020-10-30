
import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import '../../../styles/modal.scss';

/* 
<MobileModal hideCloseButton="" title="" children="" />
*/

const MobileModal = (props) => {
  const dispatch = useDispatch()
  return (
    <div className="modalContainer">
      <div className="modal-back"></div>
      <div className="mobile-modal">
        {props.hideCloseButton ? '' :
          <div className="modal-close" onClick={() => {
            if (props.callback) props.callback();
            dispatch({ type: 'HANDLE_MODAL', payload: false })
          }}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
        }z
        <div className="modaTitle">{props.title}</div>
        <div className="modalContent">{props.children}</div>
      </div>
    </div>
  )
}

export default MobileModal;
