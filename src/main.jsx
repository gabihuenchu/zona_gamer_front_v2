import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './pages/App.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Registro/Registro.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Dashboard from './pages/DashboardPage.jsx';
// ArmaTuPC eliminado del sitio
import CartPage from './pages/CartPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/productos" element={<ProductPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
  </BrowserRouter>
)
