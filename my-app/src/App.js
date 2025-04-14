import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Divisions from './components/Divisions';
import Positions from './components/Positions';
import Qualifications from './components/Qualifications';
import Insurance from './components/Insurance';
import Evaluation from './components/Evaluation';
import Salary from './components/Salary';
import './styles.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/divisions" element={<Divisions />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/qualifications" element={<Qualifications />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/salary" element={<Salary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
