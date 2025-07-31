import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { ConfigProvider } from './context/ConfigContext.jsx';

import './css/base.css';
import './css/main.css'; // Comentar para probar
import './css/modal.css';
import './css/player.css'; // Comentar para probar
import './css/sidebar.css'; // Solo sidebar.css para probar

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PlayerProvider>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </PlayerProvider>
    </AuthProvider>
  </BrowserRouter>
);
