import React, { useMemo, useState, useRef, useEffect } from 'react';
import {useSelector} from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPaperclip, faCommentAlt, faLocationArrow, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import './bubbleChatComponent.scss';
import { FaUserNurse, FaChevronLeft } from "react-icons/fa"
import { IoIosSend } from "react-icons/io"

const BubbleChat = ({ 
	messages = [], 
	onPostMsg,
	onPostFile, 
	bubble = false, 
	notification = {}
}) => {
    const [chatWindow, setChatWindow] = useState({ state: true, open: true });
    const [handlerInputChange, setChangeInputChange] = useState('');
    const chatScrollRef = useRef();
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
	const { fullname_nurse, cuit_nurse } = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.delivery) || {fullname_nurse: "Profesional", cuit_nurse: "-"};
    const {patient} = useSelector(state => state.queries) 
	const {incidente_id} = useParams()
	const docId = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex]?.docId) || incidente_id
    const history = useHistory();

    const chatContent = useMemo(() => (
        <>
            {messages.map(({ author, data }) => (
                <>
                    {!data.text.includes('///') &&
                        <>
                            {author === 'me' && (
                                <div className='messageContainer me'>
                                    <div className="messageMeContainer">
                                        {data.text.includes('http') ? (
                                            <a href={data.text}>{data.text}</a>
                                        ) : (
                                            <span>{data.text}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {author === 'them' && (
                                <div className='messageContainer them'>
                                    <div className="messageThemContainer">
                                        {data.text.includes('\n\n') ? (
                                            <>
                                                <div className='answerContainer'>
                                                    <>
                                                        {data.text.split('\n\n')[0].toString()}
                                                    </>
                                                </div>
                                                <div className='conversation'>
                                                    <>{data.text.split('\n\n')[1].toString()}</>
                                                </div>
                                            </>
                                        ) : (
                                                <>
                                                    <div className="conversation">
                                                        <>
                                                            {data.text.toString()}
                                                        </>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </div>
                            )}
                        </>
                    }
                </>

            ))}
        </>
    ), [messages])


    useEffect(() => {
        if (chatScrollRef.current?.scrollHeight) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
        }
    }, [chatScrollRef, chatWindow, messages, notification])

    const sendMsg = () => {
        onPostMsg(handlerInputChange)
        setChangeInputChange('')
    }

    const bubbleChatComponent = () => {
        return (
            <div className={`componentWrapper no-cursor ${!bubble && 'notBubbleChat'} ${"patient" !== 'uma-admin' && 'notSelector'}`}>
                {chatWindow.state && (
                    <div className={`chatWindowContainer open`}>
                        {/* <div className="headerContainer">
                            {bubble && (
                                <>
                                    <span>Habla con soporte</span>
                                    <div className="closeButton" onClick={() => setChatWindow(!chatWindow)} >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </div>
                                </>
                            )}
                        </div> */}
                        <div className="nursedata__container">
                            <div className="arrow__icon" onClick={()=>history.push(`/delivery/progress/${patient.ws}/${docId}/`)}>
                            <FaChevronLeft />
                            </div>
                            <div className="nursedata__picname" >
                                <span className="nurse__icon">
                                    <FaUserNurse />
                                </span>

                                <div className="data__container">
                                    <p className="profesional">{fullname_nurse || 'Federico Miranda'}</p>
                                    <p className="cuit">CUIT {cuit_nurse}</p>
                                </div>
                            </div>
                        </div>

                        <div className="messagesContainer" ref={chatScrollRef}>
                            {chatContent}
                        </div>
                        <div className="bottomContainer">
                            <input
                                placeholder='Chatea con tu enfermero'
                                type="text"
                                value={handlerInputChange}
                                onChange={(e) => setChangeInputChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                            />
                            <div className="optionsContainer">
                                <IoIosSend onClick={sendMsg} />
                                {/* <label className='labelFile' >
                                    <input className='inputFile' type="file" onChange={(e) => onPostFile(e.target.files)} />
                                    <FontAwesomeIcon className='clipIcon' icon={faPaperclip} />
                                </label> */}
                            </div>
                        </div>
                    </div>
                )}
                <div className="bubbleContainer">
                    <div className={` bubble ${notification.not && bubble && !chatWindow.open && 'notificationBubble'}`}>
                        {bubble && (
                            <div className="moveItem">
                                <strong><FontAwesomeIcon className='cursor' icon={faArrowsAlt} /></strong>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {bubble ? (
                <>
                    {bubbleChatComponent()}
                </>
            ) : (
                    <>
                        {bubbleChatComponent()}
                    </>
                )}
        </>
    )
}
export default BubbleChat