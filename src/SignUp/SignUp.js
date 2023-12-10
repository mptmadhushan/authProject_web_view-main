import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import "./SignUp.css";
import { auth } from '../config/firebaseConfig';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

  // const handleUsernameChange = (event) => {
  //   setUsername(event.target.value);
  // };

  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(email)
    console.log(password)
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
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
      <p style={{fontSize:20}}>
        Already have an account? <NavLink to="/" style={{color: 'red'}}>Sign in</NavLink>
      </p>
    </div>
    </div>
   
  );
};

export default SignUp;
