import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import GuildHall from './pages/GuildHall';
import CreateAdventurer from './pages/CreateAdventurer';
import AdventurerDetail from './pages/AdventurerDetail';
import EditAdventurer from './pages/EditAdventurer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guild-hall" element={<GuildHall />} />
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