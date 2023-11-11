// App.jsx
import { UserProvider } from './components/UserContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './components/Register';
import Nav from './components/Nav';
import Home from './components/Home';
import UserProfile from './pages/UserProfile';
import Calendar from './components/Calendar'
import GroomieProfile from './pages/GroomieProfile';
// import CreateProfile from './pages/CreateProfile';

import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <header>
            <Nav />
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              {/* <Route path="/create-profile" element={<CreateProfile />} />               */}
              <Route path="/groomie/:groomieId" element={<GroomieProfile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;