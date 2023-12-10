import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./SignUp.css";
import { auth } from "../config/firebaseConfig";
import CryptoJS from "crypto-js";
import rsaPemFromModExp from 'rsa-pem-from-mod-exp';
import { child, get, getDatabase, ref, set } from "firebase/database";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  // const handleUsernameChange = (event) => {
  //   setUsername(event.target.value);
  // };

  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };
  const generateRSAKeyPair = (modulusBitLength) => {
    return new Promise((resolve, reject) => {
      rsaPemFromModExp(modulusBitLength, 65537, (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      });
    });
  };
  
  const _generatePrivateKey = (seed) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    return CryptoJS.SHA256(CryptoJS.lib.WordArray.create(data)).toString(
      CryptoJS.enc.Hex
    );
  };
  
  const _generatePublicKey = async (modulusBitLength, seed) => {
    const rsaKeyPair = await generateRSAKeyPair(modulusBitLength);
    return rsaKeyPair.publicKey;
  };
  
  const generatePrivateKey = (seed) =>
    CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);

  const generatePublicKey = (seed) => generatePrivateKey(seed); 

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      console.log("userId", userId);
     // Generate dynamic RSA key pair based on a random seed
     const modulusBitLength = 2048;
     const rsaKeyPair = {
       privateKey: generatePrivateKey(userId),
       publicKey: await generatePublicKey(modulusBitLength, userId),
     };
 
     console.log("RSA Key Pair:", rsaKeyPair);
     console.log("Private Key:", rsaKeyPair.privateKey);
     console.log("Public Key:", rsaKeyPair.publicKey);
     const encryptedUserIdWithSlash = CryptoJS.AES.encrypt(userId, rsaKeyPair.privateKey).toString();

     const encryptedUserId = encryptedUserIdWithSlash.replace(/\//g, '-');
  

     console.log("encryptedUserId", encryptedUserId);
      const database = getDatabase();
      const userRef = ref(database, "/user_key/" + userId);

      set(userRef, {
        rsaKeyPair: {
          privateKey: rsaKeyPair.privateKey,
          publicKey: rsaKeyPair.publicKey,
          userid: encryptedUserId,
        },
      })
        .then(() => {
          console.log("RSA key pair saved to the database.");
        })
        .catch((error) => {
          console.error("Error saving RSA key pair to the database:", error);
        });

      console.log(userCredential.user);
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      // Handle errors
    }
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Perform login logic here with username and password
  //   console.log(`Username: ${username}`);
  //   console.log(`Password: ${password}`);
  //   // Reset the form
  //   setUsername("");
  //   setPassword("");
  // };

  return (
    <div className="login-container-main">
      <div className="login-container">
        <h1>Sign Up</h1>
        <form>
          <div className="input-container">
            <label htmlFor="username">Username</label>

            <input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              label="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              label="Confirm password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </div>
          <button type="submit" onClick={onSubmit}>
            Sign up
          </button>
        </form>
        <p style={{ fontSize: 20 }}>
          Already have an account?{" "}
          <NavLink to="/" style={{ color: "red" }}>
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
