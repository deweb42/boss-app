import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PhaseDetail from './pages/PhaseDetail';
import Settings from './pages/Settings';
import Branding from './pages/Branding';
import { getClientData, saveClientData } from './services/storage';
import { ClientData } from './types';

function App() {
  // Initialize state from localStorage or defaults
  const [clientData, setClientData] = useState<ClientData>(getClientData());

  // Wrapper to update state and persistence simultaneously
  const handleUpdateClientData = (newData: ClientData) => {
    setClientData(newData);
    saveClientData(newData);
  };

  useEffect(() => {
    // Initial load check if needed
    const data = getClientData();
    setClientData(data);
  }, []);

  return (
    <Router>
      <Layout clientData={clientData}>
        <Routes>
          <Route 
            path="/" 
            element={
                <Dashboard 
                    clientData={clientData} 
                    updateClientData={handleUpdateClientData}
                />
            } 
          />
          <Route 
            path="/phase/:id" 
            element={
              <PhaseDetail 
                clientData={clientData} 
                updateClientData={handleUpdateClientData} 
              />
            } 
          />
          <Route 
            path="/branding" 
            element={
              <Branding 
                clientData={clientData} 
                updateClientData={handleUpdateClientData} 
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                clientData={clientData} 
                updateClientData={handleUpdateClientData} 
              />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;