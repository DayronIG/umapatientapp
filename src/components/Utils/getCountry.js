
import DB from '../../config/DBConnection';
const db = DB.firestore();

export const getCountry = async (ws) => {
    let country = null
    let countryList = await db.doc('/parametros/userapp/variables/countries').get()
    countryList.data().codes.forEach(el => {
        if(ws.startsWith(el.prefix)) {
            country = el.code
        }
    })
    return country
}