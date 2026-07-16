import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GuildHall from './pages/GuildHall/GuildHall';
import CreateAdventurer from './pages/CreateAdventurer/CreateAdventurer';
import AdventurerDetail from './pages/AdventurerDetail/AdventurerDetail';
import EditAdventurer from './pages/EditAdventurer/EditAdventurer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<GuildHall />} />
            <Route path="/create" element={<CreateAdventurer />} />
            <Route path="/adventurer/:id" element={<AdventurerDetail />} />
            <Route path="/edit/:id" element={<EditAdventurer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;