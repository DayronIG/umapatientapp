import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import db from "../../../../config/DBConnection"
import moment from "moment"

export const useChat = (isInternal) => {
    const [error,] = useState(null);
    const [loading,] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMsj, setNewMsgActive] = useState(0)
    const date = moment();
    const [corporation] = useState("uma");
    const [user] = useState("patient")
    const firestore = db.firestore();

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
        if (isInternal !== undefined) {
            let chatRef = isInternal ? user.replace('-', '') : corporation.replace(/[^a-zA-Z ]|\s/g, "")
            firestore
                .collection('events')
                .doc('messages')
                .collection(chatRef)
                .onSnapshot({ includeMetadataChanges: true }, (snap) => {
                    setMessages(snap.docs.map(d => {
                        return ({
                            id: d.data().id,
                            author: d.data().rol === 'soporte' ? 'them' : 'me',
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
    }, [corporation, date, firestore, isInternal]);

    return { error, loading, messages, newMsj, setNewMsgActive }
}