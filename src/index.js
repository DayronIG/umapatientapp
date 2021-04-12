import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import store from "./store/configStore";
import App from "./App";
import serviceWorker from "./service-worker";
import AuthProvider from "./components/User/Auth";
import DBConnection, { askPermissionToRecieveNotifications } from "./config/DBConnection"
import isIos from './components/Utils/isIos';

const PatientApp = () => {
  if (!isIos) {
    if (!localStorage.getItem('Notification_Token')) askPermissionToRecieveNotifications()
      const messaging = DBConnection.messaging()
      messaging.onMessage((payload) => {
    })
  }

  return (
    <>
      <Provider store={store}>
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
