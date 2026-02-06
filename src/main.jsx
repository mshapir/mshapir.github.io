import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  // Hydrate if pre-rendered by react-snap
  ReactDOM.hydrateRoot(rootElement, <App />);
} else {
  // Normal render for development
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
