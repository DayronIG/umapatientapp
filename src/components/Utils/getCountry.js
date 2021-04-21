
import DBConnection, {firebaseInitializeApp} from '../../config/DBConnection';
const db = DBConnection.firestore(firebaseInitializeApp);

export const getCountry = async (ws) => {
    let country = 'AR'
    let countryList = await db.doc('/parametros/userapp/variables/countries').get()
    countryList.data().codes.forEach(el => {
        if(ws.startsWith(el.prefix)) {
            country = el.code
        }
    })
    return country
}