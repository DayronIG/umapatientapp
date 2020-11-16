
import React from 'react';
import { useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md'
import '../../../styles/modal.scss';

/* 
<MobileModal hideCloseButton="" title="" children="" />
*/

const MobileModal = (props) => {
  const dispatch = useDispatch()
  return (
    <div className="modalContainer">
      <div className="modal-back"></div>
      <div className={`mobile-modal ${props.noScroll? "no-scroll": ""} ${props.surveyHisopados ? 'hisopados' : ''}`}>
        {props.hideCloseButton ? '' :
          <div className="modal-close" onClick={() => {
            if (props.callback) props.callback();
            dispatch({ type: 'HANDLE_MODAL', payload: false })
          }}>
            <MdClose />
          </div>
        }
        {
          props.hideTitle ? '' : 
          <div className="modaTitle">{props.title}</div>
        }
        <div className="modalContent">{props.children}</div>
      </div>
    </div>
  )
}

export default MobileModal;
