import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherSummary from './components/WeatherSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherSummary />} />
      </Routes>
    </Router>
  );
}

export default App;