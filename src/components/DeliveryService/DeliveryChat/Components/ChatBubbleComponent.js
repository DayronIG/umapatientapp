import React, { useMemo, useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPaperclip, faCommentAlt, faLocationArrow, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import './bubbleChatComponent.scss';
import { FaUserNurse } from "react-icons/fa"
import { BsChatFill } from "react-icons/bs"

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

    const openChat = (e) => {
        e.stopPropagation();
        notification.setNot(0);
        if (chatWindow.state === false) {
            setChatWindow({ state: true, open: false })
            setTimeout(() => (
                setChatWindow({ state: true, open: true })
            ), 500)
        } else {
            setChatWindow({ state: true, open: false })
            setTimeout(() => (
                setChatWindow({ state: false, open: false })
            ), 500)
        }
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
                            <div className="nursedata__picname" >
                                <FaUserNurse className="nurse__icon" />
                            <div className="data__container">
                                <p><b>{"CARLOS"}</b></p>
                                <p className="cuit">CUIT {"123"}</p>
                            </div>
					    </div>
					    <div className="icons__container">
						    <p className="chat__icon" onClick={()=>openChat()}>
							    <BsChatFill/>
						    </p>
					    </div>
                        </div>

                        <div className="messagesContainer" ref={chatScrollRef}>
                            {chatContent}
                        </div>
                        <div className="bottomContainer">
                            <input
                                placeholder='Escribir...'
                                type="text"
                                value={handlerInputChange}
                                onChange={(e) => setChangeInputChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                            />
                            <div className="optionsContainer">
                                <FontAwesomeIcon className='sendIcon' icon={faLocationArrow} onClick={sendMsg} />
                                <label className='labelFile' >
                                    <input className='inputFile' type="file" onChange={(e) => onPostFile(e.target.files)} />
                                    <FontAwesomeIcon className='clipIcon' icon={faPaperclip} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bubbleContainer">
                    <div className={` bubble ${notification.not && bubble && !chatWindow.open && 'notificationBubble'}`}>
                        {!bubble && <small className={`${notification.not && !bubble && !chatWindow.open && 'notification'} ${chatWindow.state && 'disable'}`} onClick={openChat}>Habla con soporte</small>}
                        <FontAwesomeIcon className={`${notification.not && !bubble && !chatWindow.open && 'notification'}`} onClick={openChat} icon={faCommentAlt} />
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