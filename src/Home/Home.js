import React from "react";
import './Home.css';
import {
  child,
  get,
  getDatabase,
  ref,
  set
} from "firebase/database";
import { useNavigate } from "react-router-dom";




const Home = () => {
  const navigate = useNavigate();

  const db = getDatabase();
const resetUserID = (userId) => {
  set(ref(db, "userrand/" + userId), {
    isUserLog: false,
  });
  navigate("/")
};
  

  const onLogout = (e) => {
    const userid = JSON.parse(localStorage.getItem('userId'));
  if (userid) {
    //   auth().signOut().then(function() {
       
    //   // Sign-out successful.
    // }).catch(function(error) {
    //   console.log('An error happened', error)
    // });
    resetUserID(userid)
    
  }
   
  }

  return (
    <div>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-left">Auth App</div>
          <div className="navbar-right">
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        </nav>
        <div className="content">{/* Your other content goes here */}</div>
      </div>

      <div>
      <iframe src="https://docs.google.com/spreadsheets/d/1mxOOduzYUaFfHOqoGkIWUA24Nn-ZXKfp5XuiXIvhyQI/edit#gid=0" height="1000" width="90%"/>,
      </div>

    </div>
  );
};

export default Home;
