import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate';
import App from './App';
import AppErrorBoundary from './components/AppErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
