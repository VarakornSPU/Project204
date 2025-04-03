import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import App from './App';  // Your main App component
import './index.css';  // Your global CSS

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap your App component inside BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
