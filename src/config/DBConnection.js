import Firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/auth';
import 'firebase/performance';

import isIos from '../components/Utils/isIos'

var messaging;
var config = {
    apiKey: 'AIzaSyAGQ-AMCmpkcgErO2UVW0b_BFcFFHTCAJw',
    authDomain: 'uma-v2.firebaseapp.com',
    databaseURL: 'https://uma-v2.firebaseio.com',
    projectId: 'uma-v2',
    storageBucket: 'uma-v2.appspot.com',
    messagingSenderId: '320149797683',
    appId: '1:320149797683:web:6cb56009aaa69a3dc9dc46',
    measurementId: "G-9E186399VJ"
};


export const firebaseInitializeApp = Firebase.initializeApp(config, "patients_app");

function DBConnection() {
    // Firebase.performance(firebaseInitializeApp);
    const ios = isIos()
    if (!ios) {
        messaging = Firebase.messaging(firebaseInitializeApp);
        messaging.usePublicVapidKey(
            'BDpPH-rMBfK3XOpw_ZoGFkT0surd8f6NQeUlHjiumSHKBU0s0KxTKcFk8EHBm8sU4myk-SQ7ln1fXcWoejaRZYU'
        );
        messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
            // ...
          });
    }
    return Firebase;
}


export const askPermissionToRecieveNotifications = async () => {
    try {
        await messaging.requestPermission().catch(err => {
            console.log(err)
        });
        const token = await messaging.getToken();
        localStorage.setItem('Notification_Token', token)
        return token
    } catch (err) {
        console.log(err)
    }
}


export default DBConnection();