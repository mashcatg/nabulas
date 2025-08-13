import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: React version:', React.version);
console.log('main.tsx: Starting app render');

createRoot(document.getElementById("root")!).render(<App />);
