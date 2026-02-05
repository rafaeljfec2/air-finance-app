import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerGlobalErrorListeners } from '@/components/error/ErrorBoundary';
import { App } from './App';
import './index.css';

registerGlobalErrorListeners();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
