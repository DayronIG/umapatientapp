import moment from 'moment'
import axios from 'axios'
import { config, umacare_tracking } from '../../config/endpoints'

export const activateUmacareTraking = (uid, from, to) => {
    return dispatch => {
        const trakingId = `${uid}_${moment().format('YYYYMMDDHHmm')}`  
        const data = {
            id: trakingId,
            from,
            to
        }      
        axios.post(`${umacare_tracking}/${trakingId}`, data, config)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}