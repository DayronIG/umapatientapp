import Axios from "axios"
import { install_event } from "../../config/endpoints"
import moment from 'moment';

export const installPrompt = async (deferredPrompt, ws, dni) => {
    if (deferredPrompt !== undefined) {
        deferredPrompt.prompt()
        try {
            const choiceResult = await deferredPrompt.userChoice;
            let date = moment(new Date()).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss')
            let data = {
                ws: ws,
                dni: dni || '',
                dt: date,
                lat: '',
                lon: '',
                event: 'INSTALL'
            }
            let headers = { 'Content-Type': 'Application/Json' }
            if (choiceResult.outcome === 'accepted') {
                Axios.post(install_event, data, headers)
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}