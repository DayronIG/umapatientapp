import DBConnection, {firebaseInitializeApp} from '../../config/DBConnection';
var d = new Date()
var currentMonth = ('0' + (d.getMonth() + 1)).substr(-2)
const currentDate = [d.getFullYear(), currentMonth].join('')

export const getAssignations = (assigns) => ({
    type: 'GET_ASSIGNS',
    payload: assigns
})

export const getAppointment = (appoint) => ({
    type: 'GET_APPOINT',
    payload: appoint
})

export const saveAppointment = (assigns) => ({
    type: 'SAVE_ASSIGN',
    payload: assigns
})


export function listenAppointment(specialty, key, cm) {
    const firestore = DBConnection.firestore(firebaseInitializeApp)
    const query = firestore.collection('assignations').doc(specialty).collection(currentMonth).doc(key)
    var appointment = {}
    return dispatch => {
        query.onSnapshot({
            includeMetadataChanges: true
        }, function (snapshot) {
            appointment = {
                ...snapshot.data(),
                'path': snapshot.ref.path,
                'dateref': snapshot.date
            }
            dispatch(getAppointment(appointment))
        })
    }
}

export function matchToStore(match) {
    return dispatch => dispatch({
        type: 'MATCH_TO_STORE',
        payload: match
    })
}

export function selectedAppointment(appoint) {
    return dispatch => dispatch({
        type: 'CONFIRMED_APPOINTMENT',
        payload: appoint
    })
}