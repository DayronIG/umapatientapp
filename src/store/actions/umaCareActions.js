import moment from 'moment'
import axios from 'axios'
import { config, umacare } from '../../config/endpoints'

export const activateUmacareTraking = async (uid) => {
    const from = moment().format('YYYY-MM-DD')
    const to = moment().add(9, 'days').format('YYYY-MM-DD')
    const mr = {
        mr_diagnostico: 'Seguimiento COVID'
    }
    const data = {
        id: uid,
        from,
        to,
        mr
    }      
    await axios.post(`${umacare}/create`, data, config)           
}