import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShowList from './pages/ShowList';
import ShowDetails from './pages/ShowDetails';
import ShowEdit from './pages/ShowEdit';
import VenueList from './pages/VenueList';
import EquipmentList from './pages/EquipmentList';
import ShowCreate from './pages/ShowCreate';
import PDFViewer from './pages/PDFViewer';
import AirportList from './pages/AirportList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="shows" element={<ShowList />} />
          <Route path="shows/create" element={<ShowCreate />} />
          <Route path="shows/:id" element={<ShowDetails />} />
          <Route path="shows/:id/edit" element={<ShowEdit />} />
          <Route path="venues" element={<VenueList />} />
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="pdf/:showId" element={<PDFViewer />} />
          <Route path="airports" element={<AirportList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
