import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Login from './pages/login/Login'; 
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <Login/>
  </BrowserRouter>
  
  
)
