import './App.css';
import HomeStay from './pages/homeStay';
import Index from './pages/index';
import HomeStayDetail from './pages/homeStayDetail';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import Contact from './pages/contact';
import AdminDashBoard from './pages/adminDashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/homestay' element={<HomeStay />} />
          <Route path='/detail' Component={HomeStayDetail} />
          <Route path='/contact' Component={Contact} />
          {/* <Route path='/dashboard' Component={AdminDashBoard} /> */}

        </Routes>
      </Router>
      {/* <HomeStay /> */}
    </div>
  );
}

export default App;
