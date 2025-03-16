import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginPage from './main/loginPage';
import SignupPage from './main/registerPage';
import DashBoard from './main/dashboard';
import PlayGround from './main/playground';


function App() {
  
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/playground" element={<PlayGround />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
