import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom"
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <RecoilRoot>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}

      >
        <App />
        <Toaster  />
      </BrowserRouter>
    </RecoilRoot>
)
