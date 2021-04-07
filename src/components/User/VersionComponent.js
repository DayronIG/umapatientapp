import React, { useEffect, useState } from 'react';
import clearCache from './CacheClearer';
import { useDispatch, useSelector } from 'react-redux';
import firebase, {firebaseInitializeApp} from "../../config/DBConnection";
import Modal from '../GeneralComponents/Modal/MobileModal';
import '../../styles/generalcomponents/VersionComponent.scss';
export const version_number = require('../../config/version.json');

export const HiddenCacheClearer = ({ platform }) => {
    const dispatch = useDispatch() 
    const actual_version = useSelector((state) => state.front.versions);
    const [needUpdate, setNeedUpdate] = useState(false);
    const db = 	firebase.firestore(firebaseInitializeApp);

    useEffect(() => {
        let unsubscribe = () => {}
        const subscription = db.doc(`parametros/version`).onSnapshot((response) => {
            dispatch({ type: 'SET_VERSIONS', payload: response.data() });
        }, err => console.log(err));

        return () => {
            if(typeof subscription === "function") {
                unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        if(version_number?.patients?.replace(/\./g, "") < actual_version?.patients?.replace(/\./g, "")) {
            setNeedUpdate(true)
        } else {
            setNeedUpdate(false)
        }
    }, [actual_version])

    const clearAll = async () => {
        await clearCache();
        // window.location.reload(true);
    }

    return (<>
    {needUpdate && <Modal hideCloseButton={true}>
        <div className='hiddenCache__container'>
            <p>Hay una nueva versión de la aplicación disponible. Actualiza para seguir usando UMA.</p>
            <button onClick={clearAll}>Actualizar ahora</button>
        </div>
    </Modal>
    }</>
    )
}