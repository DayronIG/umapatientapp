import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import store from "./store/configStore";
import App from "./App";
import serviceWorker from "./serviceWorker";
import AuthProvider from "./components/User/Auth";
import Bowser from "bowser";
import DBConnection, { askPermissionToRecieveNotifications } from "./config/DBConnection"
import isIos from './components/Utils/isIos';

const PatientApp = () => {
  if (!isIos) {
    if (!localStorage.getItem('Notification_Token')) askPermissionToRecieveNotifications()
    const messaging = DBConnection.messaging()
    messaging.onMessage((payload) => {
      // console.log('Message received. ', payload);
    })
  }
  
  const browser = Bowser.getParser(window.navigator.userAgent);
  const isValidBrowser = browser.satisfies({
    macos: {
      safari: '>=9',
    },
    mobile: {
      safari: '>=9'
    },
    safari: '>=9',
    chrome: ">=19",
  });

  if (!isValidBrowser) {
    alert('Te recomendamos utilizar Google Chrome o Safari en su última versión.')
  };

  return (
    <>
      <Provider store={store()}>
        <Router
          history={createBrowserHistory({ basename: process.env.PUBLIC_URL })}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </Provider>
    </>
  );
};

ReactDOM.render(<PatientApp />, document.getElementById("root"));

serviceWorker();
