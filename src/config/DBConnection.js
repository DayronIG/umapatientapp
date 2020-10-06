import Firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/auth';
import 'firebase/auth';
import isIos from '../components/Utils/isIos'

var messaging;
var config = {
    apiKey: 'AIzaSyAGQ-AMCmpkcgErO2UVW0b_BFcFFHTCAJw',
    authDomain: 'uma-v2.firebaseapp.com',
    databaseURL: 'https://uma-v2.firebaseio.com',
    projectId: 'uma-v2',
    storageBucket: 'uma-v2.appspot.com',
    messagingSenderId: '320149797683',
    appId: '1:320149797683:web:6cb56009aaa69a3dc9dc46'
};

function DBConnection() {
    Firebase.initializeApp(config);
    const ios = isIos()
    if (!ios) {
        messaging = Firebase.messaging();
        messaging.usePublicVapidKey(
            'BDpPH-rMBfK3XOpw_ZoGFkT0surd8f6NQeUlHjiumSHKBU0s0KxTKcFk8EHBm8sU4myk-SQ7ln1fXcWoejaRZYU'
        );
    }
    return Firebase;
}


export const askPermissionToRecieveNotifications = async () => {
    try {
        await messaging.requestPermission();
        const token = await messaging.getToken();
        // console.log('token: ', token)
        localStorage.setItem('Notification_Token', token)
        return token
    } catch (err) {
        console.log(err)
    }
}


export default DBConnection();