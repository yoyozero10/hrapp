import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Evaluation from './components/Evaluation';
import Salary from './components/Salary';
import './styles.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/salary" element={<Salary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
