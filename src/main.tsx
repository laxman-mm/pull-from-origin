
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './types/global.d.ts';

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
