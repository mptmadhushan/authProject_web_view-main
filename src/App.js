
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Home from './Home/Home';
import Notification from './components/Notification'


import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';


function App() {
  return (
    <Router>
    <div>
      <section>                              
          <Routes>  
            <Route path="/" element={<Login/>}/>
             <Route path="/signup" element={<SignUp/>}/>
             <Route path="/home" element={<Home/>}/>
          </Routes>                    
      </section>
 <Notification/>     
    </div>
  </Router>
  );
}

export default App;
