import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { addTestEntry, addSampleData, clearSampleData, clearAllEntries, viewAllEntries, deduplicateEntries } from './utils/testingUtils'

// Expose testing utilities to browser console for development
if (import.meta.env.DEV) {
  (window as any).addTestEntry = addTestEntry;
  (window as any).addSampleData = addSampleData;
  (window as any).clearSampleData = clearSampleData;
  (window as any).clearAllEntries = clearAllEntries;
  (window as any).viewAllEntries = viewAllEntries;
  (window as any).deduplicateEntries = deduplicateEntries;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
