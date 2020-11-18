import Axios from "axios"
import { install_event } from "../../config/endpoints"
import moment from 'moment';

export const installPrompt = async (deferredPrompt, ws, dni = '') => {
    console.log(deferredPrompt)
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
                console.log('User accepted the install prompt');
                window.gtag('event', 'select_content', {
                  'content_type': 'install_app',
                });
              } else {
                console.log('User dismissed the install prompt');
              }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}