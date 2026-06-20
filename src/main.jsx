import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MoirosCalisthenics from './MoirosCalisthenics.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoirosCalisthenics />
  </StrictMode>,
)
