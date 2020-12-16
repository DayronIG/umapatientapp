import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiohazard } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import Modal from '../GeneralComponents/Modal/MobileModal';
import Autonomous from '../Autonomous/';
import '../../styles/floating/CoronavirusFloating.scss';

const CoronavirusModal = () => {
    const dispatch = useDispatch()
    const [launcher, setLauncher] = useState(true)
    const modal = useSelector(state => state.front.modal)

    return (
        <>
            <div className="coronavirus__modal--container">
                {modal &&
                    <Modal title="Test autónomo" callback={() => {
                                dispatch({ type: 'AUTONOMOUS_RESET' })
                                dispatch({ type: 'CLOSE_MODAL' })
                            }}>
                        <div className="coronavirus__autonomousContainer">
                            <Autonomous isModal={true} />
                        </div>
                    </Modal>}
            </div>
            {launcher && <>
                <div className="coronavirus__floating--container">
                    <div className="conoravirus__floating--close" onClick={() => setLauncher(false)}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </div>
                    <div className="coronavirus__floating--image" onClick={() => dispatch({ type: 'OPEN_MODAL', payload: true })}>
                        <FontAwesomeIcon icon={faBiohazard} />
                    </div>
                    <div className="coronavirus__floating--textContainer" onClick={() => dispatch({ type: 'OPEN_MODAL', payload: true })}>
                        <span>¿Sospechas de coronavirus?</span>
                    </div>
                </div>
            </>}
        </>
    )
}

export default CoronavirusModal;