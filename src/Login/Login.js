import React, { useEffect, useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { child, get, getDatabase, ref, set } from "firebase/database";

import { getMessaging, getToken } from "firebase/messaging";
import Modal from "../components/Modal";
// const sendNotification = require('../config/sendNotification');
const db = getDatabase();
const Push = (userId) => {
  set(ref(db, "user_auth/" + userId), {
    isUserLog: false,
  });
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [encryptUserId, setEncryptUserId] = useState("");
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const notificationToken = (uId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer ya29.a0AfB_byD_yYfKdUNibBEhNv0UuypE9tctmSohw0M3kbtv2yw_Rn3oBZyiVy75qk33XcQNr0lS74Ox58gXE52Wkzrp7k9j3WWo7KefeRS6dFVYdQEwBCZrj1q8RCu2F5ILp2riTHAsVkhT5USP4UAiBJwcCT7Y9WK_GNxwaCgYKAVwSARISFQHGX2Mi81k9-uGJdUmlJxRjiFXgoA0171",
      },
      body: JSON.stringify({
        message: {
          token:
            "ch9oGNR0RvK-WERz9smzzr:APA91bEJT9eSNGVevrnKffmIlHzMGlcwaD2yZ5C2rdxHOuk-KQcWH76hVSePiIuaig3ir4bJWvE5PxLxtYOaKT3S-AliOGqtLXPUEQ-eikhVFh3tzfxUOdgpfL-UrblI4K_UbeUowIs8",
          notification: {
            title: "FCM Message",
            body: uId,
          },
          webpush: {
            headers: {
              Urgency: "high",
            },
            notification: {
              body: "This is a message from FCM to web",
              requireInteraction: "true",
              badge: "/badge-icon.png",
            },
          },
        },
      }),
    };
    fetch(
      "https://fcm.googleapis.com/v1/projects/authproject-bbb9c/messages:send",
      requestOptions
).then((response) => 
       console.log(JSON.stringify(response?.notification))
    )
      .then((response) => console.log(JSON.stringify(response?.notification)))
      .then((data) => console.log(data));
  };

  const messaging = getMessaging();
  const onLogin = (e) => {
    const getData = ref(db);
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userId = userCredential.user.uid;
        getEncryptedKeys(userId);
        const user = userCredential.user;
       
        setShowLoaderModal(true);
        setUserId(user.uid);
        Push(user.uid);
        console.log(user.uid);

        console.log(user);
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });

    // Assuming you have the FCM token for the target user

    // sendNotification(fcmToken, notificationBody);
    //             console.log(user);
    //         })
    //         .catch((error) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             console.log(errorCode, errorMessage)
    // });
  };

  const getEncryptedKeys = () => {
    console.log('erw')
    const getData = ref(db);
    console.log(userId);
    get(child(getData, `user_key/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key;
            const userData = childSnapshot.val();

            const privateKey = userData?.rsaKeyPair?.privateKey;
            const publicKey = userData?.rsaKeyPair?.publicKey;
            const encryptedUserId = userData?.rsaKeyPair.userid;

            console.log("UserId:", userId);
            console.log("User Data:", userData);
            console.log("Private Key:", privateKey);
            console.log("Public Key:", publicKey);
            console.log(" encryptedUserId:", encryptedUserId);
            const encryptedUserIdWithSlash = CryptoJS.AES.encrypt(userId, privateKey).toString();
            localStorage.setItem("userId", encryptedUserId);
            const encryptedUseId = encryptedUserIdWithSlash.replace(/\//g, '-');
            setEncryptUserId(encryptedUserId)
            console.log("encryptedUserId", encryptedUserId);
            const decryptedBytes = CryptoJS.AES.decrypt(
              encryptedUserId,
              privateKey
            );

            const decryptedUserId = decryptedBytes.toString(CryptoJS.enc.Utf8);

            console.log("Decrypted UserId:", decryptedUserId);
            notificationToken(encryptedUseId);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const checkBiometricAuth = () => {
    const getData = ref(db);
    console.log(userId);
    console.log("checkBiometricAuth - encryptUserId", encryptUserId);
    get(child(getData, `user_auth/${encryptUserId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log('User data:', userData);
    
          console.log(
            "DB node for user VwkBsyDpV8TD2uflpl5fHausaWF2 exists!!",
            JSON.parse(JSON.stringify(snapshot))
          );
          if (userData.isUserLog == true) {
            setShowLoaderModal(false);
            navigate("/home");
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (showLoaderModal == true) {
      const interval = setInterval(() => {
        checkBiometricAuth();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [showLoaderModal,encryptUserId]);

  return (
    <div className="login-container-main ">
      <div className="login-container">
        <h1>Login</h1>
        <form>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={onLogin}>Login</button>
        </form>

        <p className="text-sm text-white text-center" style={{ fontSize: 20 }}>
          No account yet?{" "}
          <NavLink to="/signup" style={{ color: "red" }}>
            Sign up
          </NavLink>
        </p>
        <Modal show={showLoaderModal} />
      </div>
    </div>
  );
};

export default Login;
