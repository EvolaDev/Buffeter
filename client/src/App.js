import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'materialize-css';
import { useRoutes } from './routes';

function App() {
  const router = useRoutes(false);
  return (
    <Router>
      <div className="container">{router}</div>
    </Router>
  );
}

export default App;
