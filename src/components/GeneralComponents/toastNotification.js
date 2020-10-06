import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import '../../styles/generalcomponents/ToastNotification.scss'

const ToastNotification = ({ title, description, button, action, audio, unsetNotification }) => {

    const dispatch = useDispatch()
    const [slide, setSlide] = useState(false)
    useEffect(() => {
        setSlide(true)
    }, [])

    const closeNotification = () => {
        setSlide(false)
        setTimeout(() => {
            dispatch({ type: 'CALL_REJECTED', payload: true })
            unsetNotification(false)
        }, 1000)
    }

    return (
        <div className={`toastNotificationContainer ${slide && 'active'}`} >

            <div className="toastNotification">

                <audio src={audio} autoPlay />
                <div className='closeButtonContainer' onClick={closeNotification}>
                    <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <div className='contentContainer'>
                    <h2>{title}</h2>
                    {description &&
                        <p>{description}</p>
                    }
                </div>

                {action &&
                    <div className="buttonsContainer">
                        <Link to={action}>
                            <button onClick={closeNotification}>
                                {button}
                            </button>
                        </Link>

                    </div>
                }


            </div>
        </div>
    )

}

export default ToastNotification