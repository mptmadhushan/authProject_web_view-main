// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage, isSupported,Messaging } from 'firebase/messaging';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCVZpBkHwlJKI3OH31vo_NT4_njcjHqlNw",
  authDomain: "authproject-bbb9c.firebaseapp.com",
  databaseURL: "https://authproject-bbb9c-default-rtdb.firebaseio.com",
  projectId: "authproject-bbb9c",
  storageBucket: "authproject-bbb9c.appspot.com",
  messagingSenderId: "634086548741",
  appId: "1:634086548741:web:bc7c3c228f3dfbe8edc36c",
  measurementId: "G-LF2GYVLQBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const messaging = (async () => {
    try {
        const isSupportedBrowser = await isSupported();
        console.log('isSupportedBrowser',isSupportedBrowser);
        if (isSupportedBrowser) {
            return getMessaging(app);
        }
        console.log('Firebase not supported this browser');
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
    })();


export const requestPermission = () => {
    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification User Permission Granted.");
        const messaging = getMessaging();
        // Add the public key generated from the console here.
        let tok= getToken(messaging, {vapidKey: "BKYvuvNYcyk5V2E0fxBuhD1CRDLSACkQfMColKCuE-AK_NEU8sx6tVI89SYq5m_KpIzfog0fvR19CfGFCxyQfDA"});
         console.log(tok)
        //  getToken(messaging, { vapidKey: 'BPl7ud4toI9LvDXHYcWlQGrNpcfweaISo0YHDUKfKKOQTqB24KLfFXNuf-2JUO1T4FX97KDqqwT8Uy4tSQATwvs' })
        //   .then((currentToken) => {
        //     if (currentToken) {
        //       console.log('Client Token: ', currentToken);
              
        //     } else {
              
        //       console.log('Failed to generate the app registration token.');
        //     }
        //   })
        //   .catch((err) => {
        //     console.log('An error occurred when requesting to receive the token.', err);
        //   });

      
      } else {
        console.log("User Permission Denied.");
      }
    });
  }

 requestPermission()

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

export default app;