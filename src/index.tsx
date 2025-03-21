import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LinuxGPUDashboard from './linux-gpu-dashboard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <LinuxGPUDashboard />
  </React.StrictMode>
); 