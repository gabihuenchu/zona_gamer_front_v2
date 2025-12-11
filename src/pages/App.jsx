import { useState, useEffect } from "react";
import banner1 from "../assets/banner01.png";
import banner2 from "../assets/banner02.png";
import banner3 from "../assets/banner03.png";
import banner4 from "../assets/banner04.png";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";


function App() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [banner1, banner2, banner3, banner4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const navigate = useNavigate();
  return (
    <div className="app-container">
      <Navbar/>
      {/* ========= HERO ========= */}
      <section className="hero">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={banner} alt={`Banner ${index + 1}`} />
          </div>
        ))}

        {/* Texto principal */}
        <div className="hero-content">
          <h1>
            GAMER <span>ZONE</span>
          </h1>
          <p>Donde los sueños gaming se hacen realidad</p>
          <div className="hero-buttons">
            <button type="button" className="btn-primary" onClick={()=> navigate("/productos")}>Explorar Productos</button>
            <button type="button" className="btn-outline" onClick={()=> navigate("/registro")}>Unirse a la Comunidad</button>
          </div>
        </div>

        {/* Controles */}
        <div className="dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ========= SERVICIOS ========= */}
      <section className="services">
        <h2>
          Nuestros <span>Servicios</span>
        </h2>

        <div className="service-grid">
          <div className="service-card orange">
            <div className="icon">🖥️</div>
            <h3>Arma tu PC</h3>
            <p>
              Construimos la PC gaming de tus sueños con componentes de última
              generación.
            </p>
            <button>(Próximamente...)</button>
          </div>

          <div className="service-card blue">
            <div className="icon">🔧</div>
            <h3>Servicio Técnico</h3>
            <p>
              Reparación especializada, mantenimiento y optimización de equipos
              gaming.
            </p>
            <button>(Próximamente...)</button>
          </div>

          <div className="service-card purple">
            <div className="icon">🎮</div>
            <h3>Equipos Gamer</h3>
            <p>
              PCs pre-ensambladas listas para jugar, optimizadas para máximo
              rendimiento.
            </p>
            <button>Ver Catálogo</button>
          </div>
        </div>
      </section>

      {/* ========= FEATURES ========= */}
      <section className="features">
        <h3>
          ¿Por qué elegir <span>Zona Gamer</span>?
        </h3>

        <div className="features-grid">
          <div>
            <p>Envío Express 24/48h</p>
          </div>
          <div>
            <p>Garantía Extendida</p>
          </div>
          <div>
            <p>Asesoramiento Experto</p>
          </div>
        </div>
      </section>

      {/* ========= FOOTER ========= */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <img 
              src="/src/assets/footer01.png" 
              alt="Zona Gamer Footer" 
              className="footer-image"
            />
          </div>
          <div className="footer-section">
            <h4>Información</h4>
            <ul className="footer-list">
              <li><a href="#como-comprar">¿Cómo comprar?</a></li>
              <li><a href="#garantia">Política de garantía</a></li>
              <li><a href="#envios">Envíos y entregas</a></li>
              <li><a href="#terminos">Términos y condiciones</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Productos</h4>
            <ul className="footer-list">
              <li><a href="#monitores">Monitores Gamer</a></li>
              <li><a href="#perifericos">Periféricos</a></li>
              <li><a href="#componentes">Componentes PC</a></li>
              <li><a href="#accesorios">Accesorios</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul className="footer-list">
              <li><a href="mailto:ventas@zonagamer.com">ventas@zonagamer.com</a></li>
              <li><a href="tel:+56223456789">+56 2 2345 6789</a></li>
              <li>Horario: Lunes a Viernes 09:00-17:00</li>
              <li>Av. Gamer 1234, Santiago</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Zona Gamer. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

