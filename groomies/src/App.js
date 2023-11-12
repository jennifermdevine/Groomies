// App.jsx
import { UserProvider } from "./components/UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from './components/Register';
import Nav from './components/Nav';
import Home from './components/Home';
import UserProfile from './pages/UserProfile';
import Calendar from './components/Calendar'
// import GroomieList from './components/GroomieList';
// import GroomieProfile from './pages/GroomieProfile';
import EditProfile from './pages/EditProfile';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';

import "./App.css";
import Error404 from "./pages/Error404";

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
              <Route path="/EditProfile" element={<EditProfile />} />
              <Route path="/AddPet" element={<AddPet />} />
              {/* <Route path="/groomie" element={<GroomieProfile />} /> */}
              {/* <Route path="/groomie/list" element={<GroomieList />} /> */}
              <Route path="/EditPet/:petId" element={<EditPet />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
