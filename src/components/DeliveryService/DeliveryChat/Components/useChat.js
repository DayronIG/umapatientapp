import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import db, {firebaseInitializeApp} from "../../../../config/DBConnection"
import moment from "moment"

export const useChat = (isInternal) => {
    const [error,] = useState(null);
    const [loading,] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMsj, setNewMsgActive] = useState(0)
    // const date = moment();
    // const [corporation] = useState("uma");
    // const [user] = useState("patient")
    const patient = useSelector(state => state.user)
    const firestore = db.firestore(firebaseInitializeApp);
    const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
	const {incidente_id} = useParams()
	const docId = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex]?.docId) || incidente_id

    useEffect(() => {
        try {
            if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                if (lastMsg.author === 'them') setNewMsgActive(1);
                else setNewMsgActive(0);
            }
        } catch (error) {
            // console.error(error)
        }
    }, [messages]);

    useEffect(() => {
        if (isInternal !== undefined && patient.dni) {
            let chatRef = patient.dni
            firestore
                .collection('events')
                .doc('messages')
                .collection(chatRef)
                .where("assignation_id", "==", docId)
                .onSnapshot({ includeMetadataChanges: true }, (snap) => {
                    setMessages(snap.docs.map(d => {
                        return ({
                            id: d.data().id,
                            author: d.data().rol === 'nurse' ? 'them' : 'me',
                            date: d.data().dt,
                            type: 'text',
                            data: { text: `${d.data().msg}` },
                            event: d.data().msg.split('///')[0]
                        })
                    })
                        .filter(msg => !["take", "untake", "finish"].includes(msg.event))
                        .sort((a, b) => moment(a.date) - moment(b.date)));
                }, err => {
                    console.error(err)
                });
        }
    }, [firestore, isInternal, patient]);

    return { error, loading, messages, newMsj, setNewMsgActive }
}